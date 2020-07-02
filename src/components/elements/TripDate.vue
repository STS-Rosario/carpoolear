<template>
    <div class="trip-date">
        <div class="row" v-if="tripCardTheme !== 'light'">
            <time class="trip_datetime col-xs-offset-4 col-xs-20" :datetime="trip.trip_date" v-if="tripCardTheme !== 'light'">
                <span class="trip_datetime_date">{{ [ trip.trip_date ] | moment("DD MMMM YYYY") }}</span>
                -
                <span class="trip_datetime_time">{{ [ trip.trip_date ] | moment("HH:mm") }}</span>
            </time>
        </div>
        <template v-else>
            <time class="trip_date_right" :datetime="trip.trip_date">
                <div class="trip_date_date">
                    <span class="trip_date_date_day">
                        <span>{{ [ trip.trip_date ] | moment("DD") }}</span>
                    </span>
                    <br v-if="isMobile" />
                    <span v-if="isMobile" class="trip_date_date_month">{{ [ trip.trip_date ] | moment("MMM") }}</span>
                    <span v-else class="trip_date_date_month">{{ [ trip.trip_date ] | moment("MMMM") }}</span>
                </div>
            </time>
        </template>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import SvgItem from '../SvgItem';
export default {
    name: 'TripDate',
    computed: {
        ...mapGetters({
            trip: 'trips/currentTrip',
            tripCardTheme: 'auth/tripCardTheme',
            isMobile: 'device/isMobile'
        })
    },
    components: {
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
            padding-left: .4em;
        }
    }
</style>