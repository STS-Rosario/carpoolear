<template>
    <div class="trip-detail__share">
        <AppButton
            variant="secondary"
            block
            data-testid="trip-detail-share"
            icon-left="fa fa-share-alt"
            @click="onShare"
        >
            {{ $t('tripCreationShareTrip') }}
        </AppButton>
        <div v-if="canInviteFriendsToTrip" class="trip-invite-friends-trigger">
            <span
                class="tooltip-bottom trip-invite-friends-trigger__tooltip"
                :data-tooltip="inviteFriendsSelladoTooltip"
            >
                <AppButton
                    variant="secondary"
                    block
                    data-testid="trip-detail-invite-friends"
                    :disabled="inviteFriendsBlockedByUnpaidSellado"
                    @click="showInviteFriendsModal = true"
                >
                    {{ $t('invitarGenteAlViaje') }}
                </AppButton>
            </span>
        </div>
        <modal
            :name="'invite-friends-modal'"
            v-if="showInviteFriendsModal"
            @close="onInviteFriendsModalClose"
            :hideFooter="true"
        >
            <template #header>
                <h3>{{ $t('invitarGenteAlViaje') }}</h3>
            </template>
            <template #body>
                <TripInviteFriends
                    :trip-id="trip.id"
                    @close="onInviteFriendsModalClose"
                />
            </template>
        </modal>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import AppButton from '../ui/AppButton.vue';
import modal from '../Modal';
import TripInviteFriends from '../sections/TripInviteFriends.vue';
import { useTripsStore } from '../../stores/trips';
import { useAuthStore } from '../../stores/auth';
import { shareTripDetail } from '../../utils/tripDetailShare.js';
import { isUpcomingTrip } from '../../utils/isUpcomingTrip.js';
import { isInviteFriendsBlockedByUnpaidSellado } from '../../utils/tripSelladoDisplay.js';
import dayjs from '../../dayjs';

export default {
    name: 'TripDetailShareButton',

    components: {
        AppButton,
        modal,
        TripInviteFriends
    },

    data() {
        return {
            showInviteFriendsModal: false
        };
    },

    computed: {
        ...mapState(useTripsStore, {
            trip: 'currentTrip'
        }),
        ...mapState(useAuthStore, {
            user: 'user'
        }),
        owner() {
            return this.trip && this.user && this.user.id === this.trip.user?.id;
        },
        canInviteFriendsToTrip() {
            return this.owner && this.trip && isUpcomingTrip(this.trip, dayjs);
        },
        inviteFriendsBlockedByUnpaidSellado() {
            return isInviteFriendsBlockedByUnpaidSellado(this.trip);
        },
        inviteFriendsSelladoTooltip() {
            return this.inviteFriendsBlockedByUnpaidSellado
                ? this.$t('invitarAmigosSelladoPendiente')
                : null;
        }
    },

    watch: {
        trip() {
            this.maybeOpenInviteFriendsFromQuery();
        }
    },

    mounted() {
        this.maybeOpenInviteFriendsFromQuery();
    },

    methods: {
        async onShare() {
            if (!this.trip) {
                return;
            }

            await shareTripDetail({
                trip: this.trip,
                locale: this.$i18n?.locale,
                translate: (key, params) => this.$t(key, params)
            });
        },
        onInviteFriendsModalClose() {
            this.showInviteFriendsModal = false;
        },
        maybeOpenInviteFriendsFromQuery() {
            if (
                !this.canInviteFriendsToTrip ||
                this.inviteFriendsBlockedByUnpaidSellado
            ) {
                return;
            }
            const query = this.$route && this.$route.query;
            if (!query || query.inviteFriends !== '1') {
                return;
            }
            this.showInviteFriendsModal = true;
            const nextQuery = { ...query };
            delete nextQuery.inviteFriends;
            this.$router.replace({ query: nextQuery });
        }
    }
};
</script>
