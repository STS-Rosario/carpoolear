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
                </div>
            </div>
        </template>
    </div>
</template>
<script>
import { mapState } from 'pinia';
import { useTripsStore } from '../../stores/trips';
import { useAuthStore } from '../../stores/auth';
import SvgItem from '../SvgItem';
import {
    buildCoPassengerNamesText,
    isAcceptedPassengerOnTrip
} from '../../utils/tripCoPassengers.js';
import { shouldShowRearComfortNote } from '../../utils/tripRearComfortSeats.js';

export default {
    name: 'TripSeats',
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
        }
    },
    components: {
        SvgItem
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
</style>
