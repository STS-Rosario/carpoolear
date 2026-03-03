<template>
    <div class="trip-date">
        <div class="row" v-if="tripCardTheme !== 'light' && trip.trip_date">
            <time
                class="trip_datetime col-xs-offset-4 col-xs-20"
                :datetime="trip.trip_date"
                v-if="tripCardTheme !== 'light'"
            >
                <span class="trip_datetime_date">
                    {{ dayjs(trip.trip_date).format('DD MMMM YYYY') }}
                </span>
                -
                <span class="trip_datetime_time">{{
                    dayjs(trip.trip_date).format('HH:mm')
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
                        <span>{{ dayjs(trip.trip_date).format('DD') }}</span>
                    </span>
                    <br v-if="isMobile" />
                    <span v-if="isMobile" class="trip_date_date_month">
                        {{ dayjs(trip.trip_date).format('MMM') }}
                    </span>
                    <span v-else class="trip_date_date_month">
                        {{ dayjs(trip.trip_date).format('MMMM') }}
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
<script>
import { mapGetters } from 'vuex';
import WeeklySchedule from './WeeklySchedule';
import SvgItem from '../SvgItem';
import dayjs from '../../dayjs';
export default {
    name: 'TripDate',
    methods: {
        dayjs
    },
    computed: {
        ...mapGetters({
            trip: 'trips/currentTrip',
            tripCardTheme: 'auth/tripCardTheme',
            isMobile: 'device/isMobile'
        })
    },
    components: {
        WeeklySchedule,
        SvgItem
    }
};
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
