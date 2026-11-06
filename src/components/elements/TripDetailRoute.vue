<template>
    <div class="trip-detail__detalle" v-if="trip && hasRoute">
        <div class="trip-detail__route">
            <div
                v-for="(row, index) in routeRows"
                :key="index"
                class="trip-detail__route-segment"
            >
                <div class="trip-detail__route-graphic-col" aria-hidden="true">
                    <span
                        class="trip-detail__route-marker"
                        :class="markerClassFor(row.kind)"
                    ></span>
                    <div
                        v-if="index < routeRows.length - 1"
                        class="trip-detail__route-segment-line"
                    ></div>
                </div>
                <div class="trip-detail__route-text-col">
                    <div class="trip-detail__endpoint">
                        <div class="trip-detail__place">
                            <span class="trip-detail__city">{{ row.city }}</span>
                            <span v-if="row.region" class="trip-detail__region">{{
                                row.region
                            }}</span>
                        </div>
                        <div v-if="row.point" class="trip-detail__point">
                            {{ row.point }}
                        </div>
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
import { getTripRouteStopRows } from '../../utils/ongoingTrip.js';
import {
    formatTripCardDate,
    formatTripCardTime
} from '../../utils/tripCardDisplay.js';

export default {
    name: 'TripDetailRoute',
    methods: {
        markerClassFor(kind) {
            return {
                'trip-detail__route-marker--origin': kind === 'origin',
                'trip-detail__route-marker--stop': kind === 'stop',
                'trip-detail__route-marker--dest': kind === 'dest'
            };
        }
    },
    computed: {
        ...mapState(useTripsStore, {
            trip: 'currentTrip'
        }),
        routeRows() {
            return getTripRouteStopRows(this.trip);
        },
        hasRoute() {
            return this.routeRows.some((row) => row.city);
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
