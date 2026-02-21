<template>
    <div class="trip-date">
        <div class="row" v-if="tripCardTheme !== 'light' && trip.trip_date">
            <time
                class="trip_datetime col-xs-offset-4 col-xs-20"
                :datetime="trip.trip_date"
                v-if="tripCardTheme !== 'light'"
            >
                <span class="trip_datetime_date">
                    {{ formatDate(trip.trip_date, 'DD MMMM YYYY') }}
                </span>
                -
                <span class="trip_datetime_time">{{
                    formatDate(trip.trip_date, 'HH:mm')
                }}</span>
            </time>
        </div>
        <div class="row" v-else-if="tripCardTheme !== 'light' && !trip.trip_date">
            <div class="col-xs-offset-4 col-xs-20">
                <WeeklySchedule
                    :weeklySchedule="trip.weekly_schedule"
                    :weeklyScheduleTime="trip.weekly_schedule_time"
                    readonly
                    :theme="tripCardTheme"
                />
            </div>
        </div>
        <template v-else-if="tripCardTheme === 'light' && trip.trip_date">
            <time class="trip_date_right" :datetime="trip.trip_date">
                <div class="trip_date_date">
                    <span class="trip_date_date_day">
                        <span>{{ formatDate(trip.trip_date, 'DD') }}</span>
                    </span>
                    <br v-if="isMobile" />
                    <span v-if="isMobile" class="trip_date_date_month">
                        {{ formatDate(trip.trip_date, 'MMM') }}
                    </span>
                    <span v-else class="trip_date_date_month">
                        {{ formatDate(trip.trip_date, 'MMMM') }}
                    </span>
                </div>
            </time>
        </template>
        <template v-else-if="tripCardTheme === 'light' && !trip.trip_date">
            <div class="trip_date_right">
                <WeeklySchedule
                    :weeklySchedule="trip.weekly_schedule"
                    :weeklyScheduleTime="trip.weekly_schedule_time"
                    readonly
                    :theme="tripCardTheme"
                />
            </div>
        </template>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { useTripsStore } from '@/stores/trips';
import { useAuthStore } from '@/stores/auth';
import { useDeviceStore } from '@/stores/device';
import { formatDate } from '@/composables/useFormatters';
import WeeklySchedule from './WeeklySchedule';
import SvgItem from '../SvgItem';

const tripsStore = useTripsStore();
const authStore = useAuthStore();
const deviceStore = useDeviceStore();

const trip = computed(() => tripsStore.currentTrip);
const tripCardTheme = computed(() => authStore.tripCardTheme);
const isMobile = computed(() => deviceStore.isMobile);
</script>
<style scoped>
.trip_datetime {
    margin-top: 0;
    margin-bottom: 0;
}
@media only screen and (min-width: 768px) {
    .trip_datetime {
        margin-top: 1rem;
        margin-bottom: 1.5rem;
    }
    .trip_date_right {
        float: none;
        padding-right: 0;
    }
    .trip_date_date_month {
        padding-left: 0.4em;
    }
}
:deep(.weekly-schedule-wrapper) {
    display: inline-block;
}
</style>
