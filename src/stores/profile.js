import { defineStore } from 'pinia';
import { UserApi, RateApi, ReferencesApi } from '../services/api';
import { makePaginationState, makePaginationGetters, makePaginationActions } from './pagination';

const userApi = new UserApi();
const rateApi = new RateApi();
const referencesApi = new ReferencesApi();

export const useProfileStore = defineStore('profile', {
    state: () => ({
        user: null,
        registerData: null,
        badges: [],
        ...makePaginationState('rates')
    }),

    getters: {
        ...makePaginationGetters('rates'),
        // user, registerData, badges are accessed via mapState directly from state.
        references: (state) => {
            if (state.user) {
                return state.user.references_data;
            } else {
                return null;
            }
        }
    },

    actions: {
        ...makePaginationActions('rates', ({ store, data }) => {
            // TODO: Pagination not working
            data.page_size = 200;
            return rateApi.index(store.user.id, data);
        }),

        setUser(user) {
            this.user = user;
            this.badges = [];
            this.ratesSearch();
            if (user && user.id) {
                this.fetchBadges(user.id);
            }
        },

        setUserByID({ id, userProfile }) {
            if (userProfile) {
                this.user = userProfile;
            }
            return userApi
                .show(id)
                .then((response) => {
                    this.user = response.data;
                    this.badges = [];
                    this.ratesSearch();
                    this.fetchBadges(id);
                    return Promise.resolve(response.data);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        },

        fetchBadges(userId) {
            return userApi
                .getBadges(userId)
                .then((response) => {
                    const badges = response.data.data || response.data;
                    this.badges = Array.isArray(badges) ? badges : [];
                    return Promise.resolve(this.badges);
                })
                .catch(() => {
                    this.badges = [];
                    return Promise.resolve([]);
                });
        },

        async registerDonation(data) {
            const { useAuthStore } = await import('./auth');
            const authStore = useAuthStore();
            return userApi
                .registerDonation(data)
                .then((response) => {
                    authStore.pushDonation(response.donation);
                    return Promise.resolve();
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        },

        getBankData(data) {
            return userApi
                .getBankData(data)
                .then((response) => {
                    console.log('getBankData', response);
                    return Promise.resolve(response);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        },

        getTermsText(data) {
            return userApi
                .getTermsText(data)
                .then((response) => {
                    console.log('getTermsText', response);
                    return Promise.resolve(response);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        },

        async changeProperty(data) {
            const { useAuthStore } = await import('./auth');
            const authStore = useAuthStore();
            return userApi
                .changeProperty(data)
                .then((response) => {
                    console.log('changeProperty', response);
                    if (!response.user && response.data) {
                        response.user = response.data;
                    }
                    authStore.setUser(response.user);
                    return Promise.resolve();
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        },

        saveRegisterData(data) {
            this.registerData = data;
        },

        cleanRegisterData() {
            this.registerData = null;
        },

        makeReference(data) {
            return referencesApi
                .create(data)
                .then((response) => {
                    // PROFILE_REFERENCE_ADD
                    if (!this.user.references_data) {
                        this.user.references_data = [];
                    }
                    console.log('PROFILE_REFERENCE_ADD', this.user);
                    this.user.references_data.push(response);
                    return Promise.resolve(response);
                })
                .catch((error) => {
                    console.error(error);
                    return Promise.reject(error);
                });
        },

        // State mutation method for rates reply
        setReply(rate) {
            if (this.rates) {
                this.rates.forEach((item) => {
                    if (
                        rate.trip_id === item.trip.id &&
                        rate.user_id === item.from.id
                    ) {
                        rate.reply_comment = item.comment;
                        rate.reply_comment_created_at = item.reply_comment_created_at;
                    }
                });
            }
        }
    }
});
