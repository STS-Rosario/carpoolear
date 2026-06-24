<template>
    <div
        class="trip-seats"
        v-if="tripCardTheme === 'light' || !trip.is_passenger"
    >
        <div class="row" v-if="tripCardTheme !== 'light'">
            <div
                class="trip_seats-available col-xs-offset-2 col-sm-offset-4 col-xs-24"
            >
                <div class="trip-seats__passenger-detail">
                    <span
                        v-if="showRearComfortNote"
                        class="trip-seats__rear-comfort-note trip-seats__rear-comfort-note--above label-soft"
                    >
                        {{ $t('atrasViajanSolo2Personas') }}
                    </span>
                    <div class="trip-seats__availability">
                        <span class="trip_seats-available_value">{{
                            trip.seats_available
                        }}</span>
                        <span
                            v-if="trip.seats_available == 1"
                            class="trip_seats-available_label"
                        >
                            {{ $t('Lugar') }}
                            <br />
                            {{ $t('libre') }}
                        </span>
                        <span v-else class="trip_seats-available_label">
                            {{ $t('Lugares') }}
                            <br />
                            {{ $t('libres') }}
                        </span>
                    </div>
                    <span
                        v-if="coPassengerNamesText"
                        class="trip-seats__co-passengers label-soft"
                    >
                        {{
                            $t('viajasCon', {
                                names: coPassengerNamesText
                            })
                        }}
                    </span>
                    <div
                        v-if="canInviteFriendsToTrip"
                        class="trip-invite-friends-trigger"
                    >
                        <span
                            class="tooltip-bottom trip-invite-friends-trigger__tooltip"
                            :data-tooltip="inviteFriendsSelladoTooltip"
                        >
                            <button
                                type="button"
                                class="btn btn-primary"
                                :disabled="inviteFriendsBlockedByUnpaidSellado"
                                @click="showInviteFriendsModal = true"
                            >
                                {{ $t('invitarAmigosAlViaje') }}
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <template v-else>
            <div class="trip_seats-available" v-if="!trip.is_passenger">
                <div class="trip-seats__passenger-detail">
                    <span
                        v-if="showRearComfortNote"
                        class="trip-seats__rear-comfort-note trip-seats__rear-comfort-note--above label-soft"
                    >
                        {{ $t('atrasViajanSolo2Personas') }}
                    </span>
                    <div class="trip-seats__availability">
                        <template v-for="n in trip.total_seats">
                            <span
                                :class="
                                    n <
                                    trip.total_seats - trip.seats_available
                                        ? 'seat-taken'
                                        : 'seat-free'
                                "
                            >
                                <svg-item
                                    :icon="'seat'"
                                    :size="18"
                                ></svg-item>
                            </span>
                        </template>
                    </div>
                    <span
                        v-if="coPassengerNamesText"
                        class="trip-seats__co-passengers label-soft"
                    >
                        {{
                            $t('viajasCon', {
                                names: coPassengerNamesText
                            })
                        }}
                    </span>
                    <div
                        v-if="canInviteFriendsToTrip"
                        class="trip-invite-friends-trigger"
                    >
                        <span
                            class="tooltip-bottom trip-invite-friends-trigger__tooltip"
                            :data-tooltip="inviteFriendsSelladoTooltip"
                        >
                            <button
                                type="button"
                                class="btn btn-primary"
                                :disabled="inviteFriendsBlockedByUnpaidSellado"
                                @click="showInviteFriendsModal = true"
                            >
                                {{ $t('invitarAmigosAlViaje') }}
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        </template>
        <modal
            :name="'invite-friends-modal'"
            v-if="showInviteFriendsModal"
            @close="onInviteFriendsModalClose"
            :hideFooter="true"
        >
            <template #header>
                <h3>{{ $t('invitarAmigosAlViaje') }}</h3>
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
import { useTripsStore } from '../../stores/trips';
import { useAuthStore } from '../../stores/auth';
import SvgItem from '../SvgItem';
import modal from '../Modal';
import TripInviteFriends from '../sections/TripInviteFriends.vue';
import dayjs from '../../dayjs';
import { isUpcomingTrip } from '../../utils/isUpcomingTrip.js';
import {
    buildCoPassengerNamesText,
    isAcceptedPassengerOnTrip
} from '../../utils/tripCoPassengers.js';
import { shouldShowRearComfortNote } from '../../utils/tripRearComfortSeats.js';
import { isInviteFriendsBlockedByUnpaidSellado } from '../../utils/tripSelladoDisplay.js';

export default {
    name: 'TripSeats',
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
            tripCardTheme: 'tripCardTheme',
            user: 'user'
        }),
        owner() {
            return this.trip && this.user && this.user.id === this.trip.user.id;
        },
        isAcceptedPassengerView() {
            return (
                !this.owner &&
                isAcceptedPassengerOnTrip(
                    this.trip?.allPassengerRequest,
                    this.user?.id
                )
            );
        },
        showRearComfortNote() {
            return shouldShowRearComfortNote(this.trip);
        },
        coPassengerNamesText() {
            if (!this.isAcceptedPassengerView) {
                return '';
            }

            return buildCoPassengerNamesText(
                this.trip?.allPassengerRequest,
                this.user?.id
            );
        },
        canInviteFriendsToTrip() {
            return (
                this.owner && this.trip && isUpcomingTrip(this.trip, dayjs)
            );
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
    },
    components: {
        SvgItem,
        modal,
        TripInviteFriends
    }
};
</script>
<style scoped>
.trip-seats {
    margin-bottom: 2em;
}

.trip-seats__passenger-detail {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.trip-seats__availability {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 0.75rem;
    margin: 0.75rem 0;
}

.trip-seats__availability .trip_seats-available_value {
    float: none;
    flex-shrink: 0;
}

.trip-seats__availability .trip_seats-available_label {
    flex-shrink: 0;
}

.trip-seats__rear-comfort-note {
    font-size: 1.15em;
    font-weight: 500;
    line-height: 1.3;
    text-transform: none;
    min-width: 0;
}

.trip-seats__rear-comfort-note--above {
    margin-left: 0;
}

.trip-seats__co-passengers {
    margin-top: 0.75rem;
    font-size: 1.15em;
    font-weight: 500;
    line-height: 1.3;
    text-transform: none;
}

.trip-invite-friends-trigger {
    margin-top: 0.25rem;
}

.trip-invite-friends-trigger__tooltip {
    display: inline-block;
}
</style>
