<template>
    <AccountSettingsLayout :show-nav="isMyOwnProfile">
        <div
            class="profile-page"
            :class="{ 'profile-page--public': !isMyOwnProfile }"
        >
            <ProfileIdentityHeader :profile="profile" />
            <div
                v-if="showPendingFriendRequestBanner"
                class="profile-pending-friend-request home-prompt-banner"
            >
                <div class="home-prompt-banner__icon" aria-hidden="true">
                    <i class="fa fa-user-plus"></i>
                </div>
                <div class="home-prompt-banner__body">
                    <div class="home-prompt-banner__title">
                        {{ $t('solicitudAmistadPendiente') }}
                    </div>
                </div>
                <div class="profile-pending-friend-request__actions">
                    <AppButton
                        variant="tertiary"
                        tone="destructive"
                        icon-right="fa fa-times"
                        :disabled="friendActionLoading"
                        @click="onRejectFriend"
                    >
                        {{ $t('rechazar') }}
                    </AppButton>
                    <AppButton
                        variant="primary"
                        icon-right="fa fa-check"
                        :disabled="friendActionLoading"
                        :loading="friendActionLoading"
                        @click="onAcceptFriend"
                    >
                        {{ $t('aceptar') }}
                    </AppButton>
                </div>
            </div>
            <div class="profile-page__content-card">
                <tabset
                    ref="tabs"
                    :keytabset="'profile'"
                    :rememberTab="isMyOwnProfile"
                >
                    <tab :header="viajesHeaderTitle">
                        <component :is="currentView" :userId="id"></component>
                    </tab>
                    <tab :header="$t('perfil')">
                        <ProfileInfo></ProfileInfo>
                    </tab>
                    <tab :header="$t('calificaciones')">
                        <ProfileRates :id="id"></ProfileRates>
                    </tab>
                </tabset>
            </div>
        </div>
    </AccountSettingsLayout>
</template>
<script>
import Tab from '../elements/Tab';
import Tabset from '../elements/Tabset';
import ProfileIdentityHeader from '../elements/ProfileIdentityHeader.vue';
import AccountSettingsLayout from '../layouts/AccountSettingsLayout.vue';
import AppButton from '../ui/AppButton.vue';
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { useProfileStore } from '../../stores/profile';
import { useFriendsStore } from '../../stores/friends';
import { useActionbarsStore } from '../../stores/actionbars';
import ProfileInfo from '../sections/ProfileInfo';
import ProfileRates from '../sections/ProfileRates';
import MyTrips from './MyTrips';
import ProfileTrip from '../sections/ProfileTrip';
import bus from '../../services/bus-event.js';
import router from '../../router';
import { resolveProfileTabIndex } from '../../utils/profileDeepLinks';

export default {
    components: {
        Tab,
        Tabset,
        ProfileIdentityHeader,
        AccountSettingsLayout,
        AppButton,
        ProfileInfo,
        ProfileRates,
        MyTrips,
        ProfileTrip
    },

    props: {
        id: {
            required: false,
            default: 'me'
        },
        userProfile: {
            required: false
        },
        activeTab: {
            required: false
        }
    },

    data() {
        return {
            currentView: null,
            friendActionLoading: false
        };
    },

    computed: {
        ...mapState(useAuthStore, {
            user: 'user'
        }),
        ...mapState(useProfileStore, {
            profile: 'user'
        }),
        viajesHeaderTitle() {
            return this.id === 'me' || this.id === this.user.id
                ? this.$t('misViajes')
                : this.$t('viajes');
        },
        isMyOwnProfile() {
            return this.id === 'me' || this.id === this.user.id;
        },
        showPendingFriendRequestBanner() {
            return (
                this.user &&
                this.profile &&
                this.profile.id !== this.user.id &&
                this.profile.friendship_state === 'pending_received'
            );
        }
    },

    methods: {
        ...mapActions(useActionbarsStore, {
            setTitle: 'setTitle'
        }),
        ...mapActions(useProfileStore, {
            setProfile: 'setUser',
            setProfileByID: 'setUserByID',
            fetchBadges: 'fetchBadges'
        }),
        ...mapActions(useFriendsStore, {
            acceptFriend: 'accept',
            rejectFriend: 'reject'
        }),
        updateFriendshipState(friendshipState) {
            this.setProfile({
                ...this.profile,
                friendship_state: friendshipState
            });
        },
        runFriendAction(action, friendshipState) {
            this.friendActionLoading = true;
            return action(this.profile.id)
                .then(() => this.updateFriendshipState(friendshipState))
                .finally(() => {
                    this.friendActionLoading = false;
                });
        },
        onAcceptFriend() {
            this.runFriendAction(this.acceptFriend, 'friend');
        },
        onRejectFriend() {
            this.runFriendAction(this.rejectFriend, 'none');
        },
        applyProfileDeepLink() {
            const index = resolveProfileTabIndex({
                query: (this.$route && this.$route.query) || {},
                activeTab: this.activeTab,
                hash: (this.$route && this.$route.hash) || ''
            });
            this.$nextTick(() => {
                if (this.$refs.tabs) {
                    this.$refs.tabs.activateTab(index);
                }
            });
        },
        updateProfile() {
            if (this.id === 'me' || this.id === this.user.id) {
                // this.setTitle('Mi Perfil');
                this.setProfile(this.user);
                this.fetchBadges(this.user ? this.user.id : 'me');
                this.currentView = 'my-trips';
            } else {
                if (this.userProfile) {
                    this.setTitle(this.userProfile.name);
                }
                this.setProfileByID({
                    id: this.id,
                    userProfile: this.userProfile
                })
                    .then(() => {
                        this.setTitle(this.profile.name);
                        this.fetchBadges(this.id);
                    })
                    .catch(() => {
                        this.$router.replace({ name: 'trips' });
                    });
                this.currentView = 'profile-trip';
            }
        },
        onBackClick() {
            router.back();
        }
    },
    watch: {
        $route: function () {
            this.applyProfileDeepLink();
            this.updateProfile();
        }
    },

    mounted() {
        this.applyProfileDeepLink();
        this.updateProfile();
        bus.on('back-click', this.onBackClick);
    },
    beforeUnmount() {
        bus.off('back-click', this.onBackClick);
    }
};
</script>

<style scoped>
.profile-pending-friend-request {
    width: fit-content;
    max-width: 100%;
    margin: 0 0 1rem;
    cursor: default;
}

.profile-pending-friend-request:hover,
.profile-pending-friend-request:focus {
    background: #fff5e6;
    color: #5d4037;
    text-decoration: none;
}

.profile-pending-friend-request :deep(.home-prompt-banner__body) {
    flex: 0 1 auto;
}

.profile-pending-friend-request__actions {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem;
}

@media only screen and (max-width: 640px) {
    .profile-pending-friend-request {
        flex-wrap: wrap;
    }
}
</style>
