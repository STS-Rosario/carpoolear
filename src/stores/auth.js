import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { AuthApi, UserApi } from '../services/api';
import cache, { keys } from '../services/cache';
import localConfig from '../../config/conf.json';
import { stopThread } from './index';
import { useDeviceStore } from './device';
import { useTripsStore } from './trips';
import { useMyTripsStore } from './myTrips';
import { usePassengerStore } from './passenger';
import { useNotificationsStore } from './notifications';
import { useConversationsStore } from './conversations';
import { useRatesStore } from './rates';
import { useCarsStore } from './cars';
import router from '../router';

const authApi = new AuthApi();
const userApi = new UserApi();

export const useAuthStore = defineStore('auth', () => {
    const auth = ref(false);
    const user = ref(null);
    const token = ref(null);
    const firstTime = ref(false);
    const appConfig = ref(null);

    const checkLogin = computed(() => auth.value);
    const authHeader = computed(() =>
        auth.value ? { Authorization: 'Bearer ' + token.value } : {}
    );
    const tripCardTheme = computed(() =>
        appConfig.value ? appConfig.value.trip_card_design : ''
    );
    const isRemoteConfig = computed(() =>
        appConfig.value && !appConfig.value.__isLocal
    );

    function setToken(newToken) {
        token.value = String(newToken).replaceAll('"', '');
        auth.value = true;
        cache.setItem(keys.TOKEN_KEY, newToken);
    }

    function setUser(newUser) {
        user.value = newUser;
        cache.setItem(keys.USER_KEY, newUser);
    }

    function setAppConfig(config) {
        appConfig.value = config;
    }

    function logout() {
        // Stop notification polling thread
        stopThread();

        // Delete device registration from backend
        try {
            const deviceStore = useDeviceStore();
            if (deviceStore.current) {
                deviceStore.deleteDevice(deviceStore.current.id);
            }
        } catch (e) {
            console.error('Device cleanup on logout failed:', e);
        }

        authApi.logout().catch((error) => {
            console.error('Logout API call failed:', error);
        });

        token.value = null;
        user.value = null;
        auth.value = false;
        cache.clear();

        // Clear user-specific data from other stores
        try {
            const tripsStore = useTripsStore();
            tripsStore.currentTrip = null;

            const myTripsStore = useMyTripsStore();
            myTripsStore.driverTrips = null;
            myTripsStore.passengerTrips = null;
            myTripsStore.driverOldTrips = null;
            myTripsStore.passengerOldTrips = null;

            const passengerStore = usePassengerStore();
            passengerStore.pendingRequest = null;
            passengerStore.pendingPaymentRequests = null;

            const notificationsStore = useNotificationsStore();
            notificationsStore.list = null;
            notificationsStore.count = 0;

            const conversationsStore = useConversationsStore();
            conversationsStore.userList = null;
            conversationsStore.selectedID = null;
            conversationsStore.conversationSelected = null;

            const ratesStore = useRatesStore();
            ratesStore.pendingRates = null;

            const carsStore = useCarsStore();
            carsStore.cars = null;
        } catch (e) {
            console.error('Store cleanup on logout failed:', e);
        }

        // Navigate to trips page
        router.replace({ name: 'trips' });
    }

    function setFirstTime(value) {
        firstTime.value = value;
    }

    function pushDonation(donation) {
        if (user.value) {
            if (!user.value.donations) {
                user.value.donations = [];
            }
            user.value.donations.push(donation);
        }
    }

    function login({ email, password }) {
        const creds = { email, password };
        return authApi.login(creds).then(
            (response) => {
                return response.token;
            },
            ({ data }) => {
                return Promise.reject(data);
            }
        );
    }

    function activate(activationToken) {
        firstTime.value = true;
        return authApi
            .activate(activationToken, {})
            .then((response) => {
                return response.token;
            })
            .catch((err) => {
                if (err) console.error(err);
            });
    }

    function onBoardingViewed() {
        return authApi.onBoardingViewed();
    }

    function searchUsers(name) {
        if (user.value && user.value.is_admin) {
            return userApi.searchUsers({ name: name });
        }
        return Promise.resolve([]);
    }

    function resetPassword(email) {
        return authApi
            .resetPassword({ email })
            .then(() => Promise.resolve())
            .catch((err) => Promise.reject(err));
    }

    function changePassword({ token: pwToken, data }) {
        return authApi
            .changePassword(pwToken, data)
            .then(() => {
                router.replace({ name: 'login' });
                return Promise.resolve();
            })
            .catch((err) => Promise.reject(err));
    }

    function register(data) {
        return userApi
            .register(data)
            .then((data) => Promise.resolve(data))
            .catch((err) => Promise.reject(err));
    }

    function fetchUser() {
        return userApi
            .show()
            .then((response) => {
                setUser(response.data);
            })
            .catch(({ data, status }) => {
                console.log(data, status);
            });
    }

    function getConfig() {
        const config = { ...localConfig, __isLocal: true };
        appConfig.value = config;
        return authApi.config().then((response) => {
            response.__isLocal = false;
            const mergedConfig = { ...localConfig, ...response };
            appConfig.value = mergedConfig;
            return response;
        });
    }

    function retoken() {
        return new Promise((resolve) => {
            authApi
                .retoken({})
                .then((response) => {
                    setToken(response.token);
                    appConfig.value = { ...localConfig, ...response.config };
                    resolve();
                })
                .catch(({ data, status }) => {
                    console.log(data, status);
                    logout();
                    resolve();
                });
        });
    }

    function update(data) {
        return userApi
            .update(data)
            .then((response) => {
                firstTime.value = false;
                setUser(response.data);
                return Promise.resolve(response.data);
            })
            .catch(({ data, status }) => {
                console.log(data, status);
                return Promise.reject(data);
            });
    }

    function adminUpdate(data) {
        return userApi
            .adminUpdate(data)
            .then((response) => Promise.resolve(response.data))
            .catch(({ data, status }) => {
                console.log(data, status);
                return Promise.reject(data);
            });
    }

    function updatePhoto(data) {
        return userApi
            .updatePhoto(data)
            .then((response) => {
                setUser(response.data);
                return Promise.resolve(response.data);
            })
            .catch(({ data, status }) => {
                console.log(data, status);
                return Promise.reject(data);
            });
    }

    return {
        auth,
        user,
        token,
        firstTime,
        appConfig,
        checkLogin,
        authHeader,
        tripCardTheme,
        isRemoteConfig,
        setToken,
        setUser,
        setAppConfig,
        logout,
        setFirstTime,
        pushDonation,
        login,
        activate,
        onBoardingViewed,
        searchUsers,
        resetPassword,
        changePassword,
        register,
        fetchUser,
        getConfig,
        retoken,
        update,
        adminUpdate,
        updatePhoto
    };
});
