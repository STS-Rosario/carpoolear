<template>
    <div class="profile-trip-component container">
        <div class="col-xs-24">
            <FilterChips
                v-model="tripRoleFilter"
                :options="tripFilterChips"
            />
            <Loading :data="filteredTripItems">
                <div class="trips-list">
                    <div
                        v-for="item in filteredTripItems"
                        :key="item.role + '-' + item.trip.id"
                        class="profile-trip-card"
                    >
                        <div class="profile-trip-card__role">
                            <i
                                :class="
                                    item.role === 'driver'
                                        ? 'fa fa-car'
                                        : 'fa fa-user'
                                "
                                aria-hidden="true"
                            ></i>
                            {{
                                item.role === 'driver'
                                    ? $t('filtroViajesConductor')
                                    : $t('filtroViajesPasajero')
                            }}
                        </div>
                        <Trip
                            :clickModal="false"
                            :trip="item.trip"
                            :user="user"
                        ></Trip>
                    </div>
                </div>
                <template #no-data><p class="alert alert-warning" role="alert">
                    {{ $t('noHayViajes') }}
                </p></template>
                <template #loading><p class="alert alert-info" role="alert">
                    <img
                        :src="$publicImg('loader.gif')"
                        alt=""
                        class="ajax-loader"
                    />
                    {{ $t('cargandoViajes') }}
                </p></template>
            </Loading>
        </div>
        <div v-if="user.is_admin">
            <div class="col-xs-24" v-if="oldDriverTrips">
                <h2>{{ $t('misViajesPasados') }}</h2>
                <Loading :data="oldDriverTrips">
                    <div class="trips-list">
                        <Trip
                            v-for="trip in oldDriverTrips"
                            v-bind:key="'old-driver-' + trip.id"
                            :clickModal="false"
                            :trip="trip"
                            :user="user"
                        ></Trip>
                    </div>
                    <template #no-data><p class="alert alert-warning" role="alert">
                        {{ $t('noHayNingunViajePasado') }}
                    </p></template>
                    <template #loading><p class="alert alert-info" role="alert">
                        <img
                            :src="$publicImg('loader.gif')"
                            alt=""
                            class="ajax-loader"
                        />
                        {{ $t('cargandoViajes') }}
                    </p></template>
                </Loading>
            </div>

            <div class="col-xs-24" v-if="oldPassengerTrips">
                <Loading :data="oldPassengerTrips">
                    <template #title><h2 v-html="$t('viajesMeSubi')"></h2></template>
                    <div class="trips-list">
                        <Trip
                            v-for="trip in oldPassengerTrips"
                            v-bind:key="'old-passenger-' + trip.id"
                            :clickModal="false"
                            :trip="trip"
                            :user="user"
                        ></Trip>
                    </div>
                    <template #no-data><p class="alert alert-warning" role="alert">
                        {{ $t('noTeHasSubidoViaje') }}
                    </p></template>
                    <template #loading><p class="alert alert-info" role="alert">
                        <img
                            :src="$publicImg('loader.gif')"
                            alt=""
                            class="ajax-loader"
                        />
                        {{ $t('cargandoViajes') }}
                    </p></template>
                </Loading>
            </div>
        </div>
    </div>
</template>

<script>
import Trip from '../sections/Trip.vue';
import Loading from '../Loading.vue';
import FilterChips from '../elements/FilterChips.vue';
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { useTripsStore } from '../../stores/trips';

export default {
    name: 'profile-trip',
    data() {
        return {
            driverTrips: [],
            passengerTrips: [],
            oldDriverTrips: [],
            oldPassengerTrips: [],
            tripRoleFilter: 'all',
            tripsLoading: true
        };
    },
    props: {
        userId: {
            required: false
        }
    },
    computed: {
        ...mapState(useAuthStore, {
            user: 'user'
        }),
        tripItems() {
            const drivers = (this.driverTrips || []).map((trip) => ({
                trip,
                role: 'driver'
            }));
            const passengers = (this.passengerTrips || []).map((trip) => ({
                trip,
                role: 'passenger'
            }));
            return drivers.concat(passengers);
        },
        filteredTripItems() {
            if (this.tripsLoading) {
                return null;
            }
            if (this.tripRoleFilter === 'driver') {
                return this.tripItems.filter((item) => item.role === 'driver');
            }
            if (this.tripRoleFilter === 'passenger') {
                return this.tripItems.filter((item) => item.role === 'passenger');
            }
            return this.tripItems;
        },
        tripFilterChips() {
            const driverCount = (this.driverTrips || []).length;
            const passengerCount = (this.passengerTrips || []).length;
            return [
                {
                    id: 'all',
                    label: `${this.$t('filtroViajesTodos')} ${driverCount + passengerCount}`
                },
                {
                    id: 'driver',
                    label: `${this.$t('filtroViajesConductor')} ${driverCount}`
                },
                {
                    id: 'passenger',
                    label: `${this.$t('filtroViajesPasajero')} ${passengerCount}`
                }
            ];
        }
    },
    mounted() {
        this.loadTrips();
    },

    methods: {
        ...mapActions(useTripsStore, {
            tripAsDriver: 'tripsAsDriver',
            tripAsPassenger: 'tripsAsPassenger',
            oldTripsAsDriver: 'oldTripsAsDriver',
            oldTripsAsPassenger: 'oldTripsAsPassenger'
        }),

        async loadTrips() {
            this.tripsLoading = true;
            try {
                this.driverTrips = await this.tripAsDriver(this.userId);
                try {
                    this.passengerTrips = await this.tripAsPassenger(this.userId);
                } catch (e) {
                    this.passengerTrips = [];
                }
                if (this.user.is_admin) {
                    this.oldDriverTrips = await this.oldTripsAsDriver(this.userId);
                    this.oldPassengerTrips = await this.oldTripsAsPassenger(
                        this.userId
                    );
                }
            } finally {
                this.tripsLoading = false;
            }
        }
    },

    components: {
        Trip,
        Loading,
        FilterChips
    }
};
</script>

<style scoped>
.profile-trip-component :deep(.trip) {
    margin-bottom: 0;
}
.profile-trip-card :deep(.trip-card-shell) {
    box-shadow: none;
    border: none;
}
h2 {
    font-weight: 300;
}
</style>
