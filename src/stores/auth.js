import { defineStore } from 'pinia';
import { AuthApi, UserApi } from '../services/api';
import cache, { keys } from '../services/cache';
import localConfig from '../../config/conf';
import { completeSessionIfRegistrationReturnsToken } from '../utils/registrationAutoLogin';
import { getLazyRouter } from '../utils/routerLazy.js';
import { hasRequiredProfileFields } from '../utils/profileRequirements';

const authApi = new AuthApi();
const userApi = new UserApi();

export const useAuthStore = defineStore('auth', {
    state: () => ({
        auth: false,
        user: null,
        token: null,
        firstTime: false,
        appConfig: null
    }),

    getters: {
        checkLogin: (state) => state.auth,
        authHeader: (state) =>
            state.auth ? { Authorization: 'Bearer ' + state.token } : {},
        tripCardTheme: (state) =>
            state.appConfig ? state.appConfig.trip_card_design : '',
        isRemoteConfig: (state) => state.appConfig && !state.appConfig.__isLocal
    },

    actions: {
        // State mutation methods (replacing Vuex mutations)
        setToken(token) {
            this.token = String(token).replace('"', '');
            this.auth = true;
            cache.setItem(keys.TOKEN_KEY, token);
        },

        setUser(user) {
            this.user = user;
            cache.setItem(keys.USER_KEY, user);
        },

        doLogout() {
            this.token = null;
            this.user = null;
            this.auth = false;
            cache.clear();
        },

        setFirstTime(firstTime) {
            this.firstTime = firstTime;
        },

        setAppConfig(appConfig) {
            this.appConfig = appConfig;
        },

        /**
         * Merge maintenance flags from a 503 maintenance JSON body (API middleware).
         */
        applyMaintenanceBlock(payload) {
            if (!this.appConfig) {
                return;
            }
            const prev = this.appConfig.maintenance || {};
            this.appConfig = {
                ...this.appConfig,
                maintenance: {
                    ...prev,
                    enabled: true,
                    mode: payload.mode ?? prev.mode,
                    message: payload.message ?? prev.message,
                    ends_at: payload.ends_at ?? prev.ends_at,
                    admin_path:
                        prev.admin_path || '/#/admin/maintenance'
                }
            };
        },

        pushDonation(donation) {
            if (this.user) {
                if (!this.user.donations) {
                    this.user.donations = [];
                }
                this.user.donations.push(donation);
            }
        },

        // Business logic actions
        async onLoggin(token) {
            this.setToken(token);
            await this.fetchUser();

            const [
                { useCordovaStore },
                { useDeviceStore },
                { useTripsStore },
                { useMyTripsStore },
                { usePassengerStore },
                { useRootStore }
            ] = await Promise.all([
                import('./cordova'),
                import('./device'),
                import('./trips'),
                import('./myTrips'),
                import('./passenger'),
                import('./root')
            ]);
            const cordovaStore = useCordovaStore();
            const deviceStore = useDeviceStore();
            const tripsStore = useTripsStore();
            const myTripsStore = useMyTripsStore();
            const passengerStore = usePassengerStore();
            const rootStore = useRootStore();

            let ratesStore, carsStore;
            try {
                const { useRatesStore } = await import('./rates');
                ratesStore = useRatesStore();
            } catch (e) { /* optional */ }
            try {
                const { useCarsStore } = await import('./car');
                carsStore = useCarsStore();
            } catch (e) { /* optional */ }

            if (cordovaStore.device) {
                deviceStore.register();
            }
            tripsStore.tripsSearch({ is_passenger: false });
            myTripsStore.tripAsDriver();
            myTripsStore.tripAsPassenger();
            if (ratesStore) ratesStore.pendingRatesAction();
            if (carsStore) carsStore.index();
            passengerStore.getPendingRequest();
            rootStore.startThread();
            const router = await getLazyRouter();
            if (this.firstTime || !hasRequiredProfileFields(this.user)) {
                router.replace({ name: 'profile_update' });
            } else {
                router.rememberBack();
            }
        },

        login({ email, password }) {
            const creds = {};
            creds.email = email;
            creds.password = password;

            return authApi.login(creds).then(
                (response) => {
                    this.onLoggin(response.token);
                    return Promise.resolve();
                },
                (error) => {
                    if (error && error.offline) {
                        return Promise.reject(error);
                    }
                    return Promise.reject(error ? error.data : error);
                }
            );
        },

        activate(activationToken) {
            this.setFirstTime(true);
            return authApi
                .activate(activationToken, {})
                .then((response) => {
                    this.onLoggin(response.token);
                })
                .catch(() => undefined);
        },

        register(data) {
            return userApi
                .register(data)
                .then(async (res) => {
                    await completeSessionIfRegistrationReturnsToken(res, (token) =>
                        this.onLoggin(token)
                    );
                    return Promise.resolve(res);
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
        },

        fetchUser() {
            return userApi
                .show()
                .then((response) => {
                    this.setUser(response.data);
                })
                .catch(() => {});
        },

        retoken() {
            const data = {};

            return new Promise((resolve, reject) => {
                authApi
                    .retoken(data)
                    .then((response) => {
                        this.setToken(response.token);
                        this.setAppConfig({
                            ...localConfig,
                            ...response.config
                        });
                        resolve();
                    })
                    .catch(async () => {
                        // Stale or invalid token: clear session and open the app as a guest (same as logout).
                        // Do not send to login — /trips and other routes work without auth; pushing login traps
                        // users when history is empty (clear / back does nothing).
                        this.doLogout();
                        const router = await getLazyRouter();
                        router.replace({ name: 'trips' });
                        resolve();
                    });
            });
        },

        async logout() {
            // Call the logout API endpoint
            authApi.logout().catch(() => {});

            const { useDeviceStore } = await import('./device');
            const { useRootStore } = await import('./root');
            const deviceStore = useDeviceStore();
            const rootStore = useRootStore();

            const device = deviceStore.current;
            if (device) {
                deviceStore.delete(device.id);
            }
            this.doLogout();
            deviceStore.devices = [];
            rootStore.stopThread();
            const router = await getLazyRouter();
            router.replace({ name: 'trips' });
        },

        resetPassword(email) {
            return authApi
                .resetPassword({ email })
                .then(() => {
                    return Promise.resolve();
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
        },

        changePassword({ token, data }) {
            return authApi
                .changePassword(token, data)
                .then(async () => {
                    const router = await getLazyRouter();
                    router.push({ name: 'login' });
                    return Promise.resolve();
                })
                .catch((err) => {
                    if (err) {
                        return Promise.reject(err);
                    }
                });
        },

        update(data) {
            return userApi
                .update(data)
                .then((response) => {
                    this.setFirstTime(false);
                    this.setUser(response.data);
                    return Promise.resolve(response.data);
                })
                .catch(({ data, status }) => {
                    return Promise.reject(data);
                });
        },

        updatePhoto(data) {
            return userApi
                .updatePhoto(data)
                .then((response) => {
                    this.setUser(response.data);
                    return Promise.resolve(response.data);
                })
                .catch(({ data, status }) => {
                    return Promise.reject(data);
                });
        },

        searchUsers(name) {
            if (this.user.is_admin) {
                return userApi.searchUsers({ name: name });
            }
        },

        adminUpdate(data) {
            return userApi
                .adminUpdate(data)
                .then((response) => {
                    return Promise.resolve(response.data);
                })
                .catch(({ data, status }) => {
                    return Promise.reject(data);
                });
        },

        reloadConfigFromServer() {
            return authApi.config().then((response) => {
                const isConfigObject =
                    response &&
                    typeof response === 'object' &&
                    !Array.isArray(response);
                if (!isConfigObject) {
                    console.error(
                        'reloadConfigFromServer: expected JSON object from /api/config.'
                    );
                    return Promise.reject(response);
                }
                response.__isLocal = false;
                console.log('Loading config from server: ', response);
                const config = { ...localConfig, ...response };
                this.setAppConfig(config);
                return import('./serverStatus').then(({ useServerStatusStore }) => {
                    useServerStatusStore().clearServerUnavailable();
                    return response;
                });
            });
        },

        getConfig() {
            localConfig.__isLocal = true;
            this.setAppConfig(localConfig);
            return this.reloadConfigFromServer().catch((error) => {
                console.warn('getConfig: remote config unavailable.', error);
                return localConfig;
            });
        },

        onBoardingViewed() {
            return authApi.onBoardingViewed();
        }
    }
});
