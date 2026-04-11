import { defineStore } from 'pinia';
import { AuthApi, UserApi } from '../services/api';
import cache, { keys } from '../services/cache';
import localConfig from '../../config/conf';

// Lazy-load router to avoid circular dependency (stores → router → routes → components → stores)
let _router;
async function getRouter() {
    if (!_router) {
        const routerModule = await import('../router');
        _router = routerModule.default;
    }
    return _router;
}

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
            this.fetchUser();

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
            console.log('dispatch trips/tripsSearch on Loggin');
            tripsStore.tripsSearch({ is_passenger: false });
            myTripsStore.tripAsDriver();
            myTripsStore.tripAsPassenger();
            if (ratesStore) ratesStore.pendingRatesAction();
            if (carsStore) carsStore.index();
            passengerStore.getPendingRequest();
            rootStore.startThread();
            const router = await getRouter();
            if (this.firstTime) {
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
                ({ data, status }) => {
                    return Promise.reject(data);
                }
            );
        },

        activate(activationToken) {
            console.log('activate action');
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
                .then((data) => {
                    return Promise.resolve(data);
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
        },

        fetchUser() {
            return userApi
                .show()
                .then((response) => {
                    console.log('fetch user', response.data);
                    this.setUser(response.data);
                })
                .catch(({ data, status }) => {
                    console.log(data, status);
                });
        },

        retoken() {
            const data = {};

            return new Promise((resolve, reject) => {
                authApi
                    .retoken(data)
                    .then((response) => {
                        console.log('retoken response', response);
                        this.setToken(response.token);
                        this.setAppConfig({
                            ...localConfig,
                            ...response.config
                        });
                        resolve();
                    })
                    .catch(async ({ data, status }) => {
                        console.log(data, status);
                        this.doLogout();
                        const router = await getRouter();
                        router.push({ name: 'login' });
                        resolve();
                    });
            });
        },

        async logout() {
            // Call the logout API endpoint
            authApi.logout().catch((error) => {
                console.error('Logout API call failed:', error);
            });

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
            const router = await getRouter();
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
                    const router = await getRouter();
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
                    console.log(data, status);
                    return Promise.reject(data);
                });
        },

        updatePhoto(data) {
            return userApi
                .updatePhoto(data)
                .then((response) => {
                    console.log(response);
                    this.setUser(response.data);
                    return Promise.resolve(response.data);
                })
                .catch(({ data, status }) => {
                    console.log(data, status);
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
                    console.log(data, status);
                    return Promise.reject(data);
                });
        },

        getConfig() {
            localConfig.__isLocal = true;
            this.setAppConfig(localConfig);
            return authApi.config().then((response) => {
                response.__isLocal = false;
                console.log('Loading config from server: ', response);
                const config = { ...localConfig, ...response };
                this.setAppConfig(config);
                return response;
            });
        },

        onBoardingViewed() {
            return authApi.onBoardingViewed();
        }
    }
});
