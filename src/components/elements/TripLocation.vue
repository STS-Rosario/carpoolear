<template>
    <div class="trip_location">
        <template v-if="trip.points.length >= 2">
            <TripSeats v-if="tripCardTheme === 'light' && isMobile" />
            <div class="row trip_location_from">
                <div class="col-xs-4" v-if="tripCardTheme === 'light'">
                    <span class="trip_from_time">{{
                        formatDate(trip.trip_date, 'HH:mm')
                    }}</span>
                </div>
                <div
                    class="text-right"
                    :class="tripCardTheme === 'light' ? 'col-xs-2' : 'col-xs-4'"
                >
                    <i
                        class="fa fa-map-marker"
                        aria-hidden="true"
                        v-if="tripCardTheme !== 'light'"
                    ></i>
                    <i class="fa fa-circle" aria-hidden="true" v-else></i>
                </div>
                <div :class="widthLocationClass">
                    <span class="trip_location_from_city">
                        {{ getLocationName(trip.points[0]) }}
                    </span>
                    <span class="trip_location_from_state-country">
                        {{ googleInfoClean(getStateName(trip.points[0])) }}
                    </span>
                </div>
            </div>
            <div
                class="row trip_inner_points"
                v-if="trip.points.length && trip.points.length > 2"
            >
                <div
                    class="trip_point"
                    :class="tripCardTheme === 'light' ? '' : 'row'"
                    v-for="(p, index) in trip.points.slice(
                        1,
                        trip.points.length - 1
                    )"
                >
                    <div class="col-xs-4" v-if="tripCardTheme === 'light'">
                        <span class="trip_to_time"></span>
                    </div>
                    <div
                        class="text-right"
                        :class="
                            tripCardTheme === 'light' ? 'col-xs-2' : 'col-xs-4'
                        "
                    >
                        <i class="fa fa-map-marker" aria-hidden="true"></i>
                    </div>
                    <div :class="widthLocationClass">
                        <span class="trip_location_inner_city">{{
                            getLocationName(p)
                        }}</span>
                        <span class="trip_location_inner_state-country">
                            {{ googleInfoClean(getStateName(p)) }}
                        </span>
                    </div>
                </div>
            </div>
            <div
                class="row trip_location_to"
                :class="
                    tripCardTheme !== 'light' &&
                    trip.points.length &&
                    trip.points.length > 2
                        ? 'has_points'
                        : ''
                "
            >
                <div class="col-xs-4" v-if="tripCardTheme === 'light'">
                    <span class="trip_to_time">{{
                        formatDate(tripArrivingTime, 'HH:mm')
                    }}</span>
                </div>
                <div
                    class="text-right"
                    :class="tripCardTheme === 'light' ? 'col-xs-2' : 'col-xs-4'"
                >
                    <i class="fa fa-map-marker" aria-hidden="true"></i>
                </div>
                <div :class="widthLocationClass">
                    <span class="trip_location_from_city">
                        {{
                            getLocationName(trip.points[trip.points.length - 1])
                        }}
                    </span>
                    <span class="trip_location_from_state-country">
                        {{
                            googleInfoClean(getStateName(trip.points[trip.points.length - 1]))
                        }}
                    </span>
                </div>
            </div>
            <div
                class="col-xs-4 trip_location-dot-line"
                v-if="tripCardTheme !== 'light'"
            >
                <div
                    :style="{
                        height:
                            trip.points.length && trip.points.length <= 2
                                ? '3.6rem'
                                : `${4.8 + 2.3 * (trip.points.length - 2)}rem`
                    }"
                ></div>
            </div>
        </template>
        <template v-else>
            <div class="row trip_location_from">
                <div class="col-xs-4 text-right">
                    <i class="fa fa-map-marker" aria-hidden="true"></i>
                </div>
                <div class="col-xs-20">
                    {{ trip.from_town }}
                </div>
            </div>
            <div class="row trip_location_to">
                <div class="col-xs-4 text-right">
                    <i class="fa fa-map-marker" aria-hidden="true"></i>
                </div>
                <div class="col-xs-20">
                    {{ trip.to_town }}
                </div>
            </div>
        </template>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTripsStore } from '@/stores/trips';
import { useAuthStore } from '@/stores/auth';
import { useDeviceStore } from '@/stores/device';
import { formatDate, googleInfoClean } from '@/composables/useFormatters';
import svgItem from '../SvgItem';
import moment from 'moment';
import TripSeats from './TripSeats';

const router = useRouter();
const tripsStore = useTripsStore();
const authStore = useAuthStore();
const deviceStore = useDeviceStore();

const isMobile = computed(() => deviceStore.isMobile);
const trip = computed(() => tripsStore.currentTrip);
const tripCardTheme = computed(() => authStore.tripCardTheme);

const widthLocationClass = computed(() => {
    return tripCardTheme.value === 'light' ? 'col-xs-14' : 'col-xs-18';
});

const tripArrivingTime = computed(() => {
    if (trip.value && trip.value.estimated_time) {
        let minutes = 0;
        minutes = parseInt(trip.value.estimated_time.split(':')[0]) * 60;
        minutes += parseInt(trip.value.estimated_time.split(':')[1]);
        return moment(trip.value.trip_date).add(minutes, 'minutes');
    }
    return '';
});

function goToProfile(event) {
    event.stopPropagation();
    router.push({
        name: 'profile',
        params: {
            id: trip.value.user.id,
            userProfile: trip.value.user,
            activeTab: 1
        }
    });
}

function getLocationName(location) {
    if (location.json_address) {
        if (location.json_address.ciudad) {
            return location.json_address.ciudad;
        }
        if (location.json_address.name) {
            return location.json_address.name;
        }
    }
    return location.address;
}

function getStateName(location) {
    if (location.json_address) {
        if (location.json_address.provincia) {
            return location.json_address.provincia;
        }
        if (location.json_address.state) {
            return location.json_address.state;
        }
    }
    return '';
}
</script>
