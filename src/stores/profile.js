import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { UserApi, RateApi, ReferencesApi } from '../services/api';
import { usePagination } from '../composables/usePagination';
import { useAuthStore } from './auth';

const userApi = new UserApi();
const rateApi = new RateApi();
const referencesApi = new ReferencesApi();

export const useProfileStore = defineStore('profile', () => {
    const user = ref(null);
    const registerData = ref(null);
    const badges = ref([]);

    const ratesPagination = usePagination('rates', ({ data }) => {
        data.page_size = 200;
        return rateApi.index(user.value.id, data);
    });

    const references = computed(() => user.value?.references_data || []);

    function setUser(newUser) {
        user.value = newUser;
        badges.value = [];
        ratesPagination.search();
        if (newUser && newUser.id) {
            fetchBadges(newUser.id);
        }
    }

    function setUserByID({ id, userProfile }) {
        if (userProfile) {
            user.value = userProfile;
        }
        return userApi
            .show(id)
            .then((response) => {
                user.value = response.data;
                ratesPagination.search();
                fetchBadges(id);
                return Promise.resolve(response.data);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }

    function fetchBadges(userId) {
        return userApi
            .getBadges(userId)
            .then((response) => {
                const result = response.data.data || response.data;
                badges.value = Array.isArray(result) ? result : [];
                return Promise.resolve(badges.value);
            })
            .catch(() => {
                badges.value = [];
                return Promise.resolve([]);
            });
    }

    function registerDonation(data) {
        return userApi
            .registerDonation(data)
            .then((response) => {
                const authStore = useAuthStore();
                if (response.data) {
                    authStore.pushDonation(response.data);
                }
                return Promise.resolve(response);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }

    function getBankData(data) {
        return userApi
            .getBankData(data)
            .then((response) => {
                return Promise.resolve(response);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }

    function getTermsText(data) {
        return userApi
            .getTermsText(data)
            .then((response) => {
                return Promise.resolve(response);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }

    function changeProperty(data) {
        return userApi
            .changeProperty(data)
            .then((response) => {
                const authStore = useAuthStore();
                if (response.data) {
                    authStore.setUser(response.data);
                }
                return Promise.resolve(response);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }

    function saveRegisterData(data) {
        registerData.value = data;
    }

    function cleanRegisterData() {
        registerData.value = null;
    }

    function makeReference(data) {
        return referencesApi
            .create(data)
            .then((response) => {
                if (user.value) {
                    if (!user.value.references_data) {
                        user.value.references_data = [];
                    }
                    user.value.references_data.push(response);
                }
                return Promise.resolve(response);
            })
            .catch((error) => {
                console.error(error);
                return Promise.reject(error);
            });
    }

    function setReply(rate) {
        if (ratesPagination.items.value) {
            ratesPagination.items.value.forEach((item) => {
                if (
                    rate.trip_id === item.trip.id &&
                    rate.user_id === item.from.id
                ) {
                    item.reply_comment = rate.reply_comment;
                    item.reply_comment_created_at = rate.reply_comment_created_at;
                }
            });
        }
    }

    return {
        user,
        registerData,
        badges,
        references,
        rates: ratesPagination.items,
        ratesMorePage: ratesPagination.morePage,
        ratesSearch: ratesPagination.search,
        setUser,
        setUserByID,
        fetchBadges,
        registerDonation,
        getBankData,
        getTermsText,
        changeProperty,
        saveRegisterData,
        cleanRegisterData,
        makeReference,
        setReply
    };
});
