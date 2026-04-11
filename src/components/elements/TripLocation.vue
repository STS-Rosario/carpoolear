<template>
    <div class="trip_location">
        <template v-if="trip.points.length >= 2">
            <TripSeats v-if="tripCardTheme === 'light' && isMobile" />
            <div class="row trip_location_from">
                <div class="col-xs-4" v-if="tripCardTheme === 'light'">
                    <span class="trip_from_time">{{
                        dayjs(trip.trip_date).format('HH:mm')
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
                        dayjs(tripArrivingTime).format('HH:mm')
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
<script>
import { mapState } from 'pinia';
import { useDeviceStore } from '../../stores/device';
import { useTripsStore } from '../../stores/trips';
import { useAuthStore } from '../../stores/auth';
import svgItem from '../SvgItem';
import dayjs from '../../dayjs';
import TripSeats from './TripSeats';
import { googleInfoClean } from '../../filters';

export default {
    name: 'tripLocation',
    data() {
        return {};
    },
    computed: {
        ...mapState(useDeviceStore, {
            isMobile: 'isMobile'
        }),
        ...mapState(useTripsStore, {
            trip: 'currentTrip'
        }),
        ...mapState(useAuthStore, {
            tripCardTheme: 'tripCardTheme'
        }),
        widthLocationClass() {
            return this.tripCardTheme === 'light' ? 'col-xs-14' : 'col-xs-18';
        },
        tripArrivingTime() {
            if (this.trip && this.trip.estimated_time) {
                let minutes = 0;
                minutes = parseInt(this.trip.estimated_time.split(':')[0]) * 60;
                minutes += parseInt(this.trip.estimated_time.split(':')[1]);
                return dayjs(this.trip.trip_date).add(minutes, 'minutes');
            }
            return '';
        }
    },
    methods: {
        googleInfoClean,
        dayjs,
        goToProfile: function (event) {
            event.stopPropagation();
            this.$router.push({
                name: 'profile',
                params: {
                    id: this.trip.user.id,
                    userProfile: this.trip.user,
                    activeTab: 1
                }
            });
        },
        getLocationName(location) {
            if (location.json_address) {
                if (location.json_address.ciudad) {
                    return location.json_address.ciudad;
                }
                if (location.json_address.name) {
                    return location.json_address.name;
                }
            }
            return location.address;
        },
        getStateName(location) {
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
    },
    components: {
        svgItem,
        TripSeats
    }
};
</script>
