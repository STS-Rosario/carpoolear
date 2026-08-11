<template>
    <div class="trip-detail__detalle" v-if="trip && hasRoute">
        <div class="trip-detail__route">
            <div class="trip-detail__route-graphic" aria-hidden="true">
                <span class="trip-detail__route-marker trip-detail__route-marker--origin"></span>
                <span class="trip-detail__route-marker trip-detail__route-marker--dest"></span>
            </div>
            <div class="trip-detail__route-content">
                <div class="trip-detail__endpoint">
                    <div class="trip-detail__place">
                        <span class="trip-detail__city">{{ labels.fromCity }}</span>
                        <span v-if="labels.fromRegion" class="trip-detail__region">{{
                            labels.fromRegion
                        }}</span>
                    </div>
                    <div v-if="labels.fromPoint" class="trip-detail__point">
                        {{ labels.fromPoint }}
                    </div>
                </div>
                <div class="trip-detail__endpoint">
                    <div class="trip-detail__place">
                        <span class="trip-detail__city">{{ labels.toCity }}</span>
                        <span v-if="labels.toRegion" class="trip-detail__region">{{
                            labels.toRegion
                        }}</span>
                    </div>
                    <div v-if="labels.toPoint" class="trip-detail__point">
                        {{ labels.toPoint }}
                    </div>
                </div>
            </div>
        </div>
        <div v-if="dateLabel || timeLabel" class="trip-detail__schedule">
            <div v-if="dateLabel" class="trip-detail__chip">
                <i class="fa fa-calendar" aria-hidden="true"></i>
                {{ dateLabel }}
            </div>
            <div v-if="timeLabel" class="trip-detail__chip">
                <i class="fa fa-clock-o" aria-hidden="true"></i>
                {{ timeLabel }}
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { useTripsStore } from '../../stores/trips';
import dayjs from '../../dayjs';
import { getTripLocationLabels } from '../../utils/ongoingTrip.js';
import {
    formatTripCardDate,
    formatTripCardTime
} from '../../utils/tripCardDisplay.js';

export default {
    name: 'TripDetailRoute',
    computed: {
        ...mapState(useTripsStore, {
            trip: 'currentTrip'
        }),
        labels() {
            return getTripLocationLabels(this.trip);
        },
        hasRoute() {
            return Boolean(this.labels.fromCity || this.labels.toCity);
        },
        dateLabel() {
            return formatTripCardDate(this.trip?.trip_date, dayjs);
        },
        timeLabel() {
            return formatTripCardTime(this.trip?.trip_date, dayjs);
        }
    }
};
</script>
