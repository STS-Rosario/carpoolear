<template>
    <AdminLayout>
        <div class="container admin-user-trips">
            <p class="admin-user-detail__back">
                <router-link
                    :to="hubRoute"
                    class="btn btn-default btn-sm"
                >
                    {{ $t('adminUsuariosVolverResumen') }}
                </router-link>
            </p>
            <div v-if="loading" class="alert alert-info">
                <img
                    :src="$publicImg('loader.gif')"
                    alt=""
                    class="ajax-loader"
                />
                {{ $t('cargandoViajes') }}
            </div>
            <div v-else-if="profileUser" class="profile-trip-component container">
                <h2>
                    {{ profileUser.name }}
                    <small class="text-muted">#{{ profileUser.id }}</small>
                </h2>
                <div class="col-xs-24">
                    <h3>
                        {{ $t('viajes') }}
                        <strong>{{ $t('creados') }}</strong>
                    </h3>
                    <Loading :data="driverTrips">
                        <div class="trips-list">
                            <Trip
                                v-for="trip in driverTrips"
                                :key="trip.id"
                                :trip="trip"
                                :user="profileUser"
                                :clickModal="true"
                            />
                        </div>
                        <template #no-data>
                            <p class="alert alert-warning" role="alert">
                                {{ $t('noHayViajes') }}
                            </p>
                        </template>
                    </Loading>
                </div>
                <div class="col-xs-24">
                    <h3>
                        {{ $t('viajes') }}
                        <strong>{{ $t('pasajero') }}</strong>
                    </h3>
                    <Loading :data="passengerTrips">
                        <div class="trips-list">
                            <Trip
                                v-for="trip in passengerTrips"
                                :key="trip.id"
                                :trip="trip"
                                :user="profileUser"
                                :clickModal="true"
                            />
                        </div>
                        <template #no-data>
                            <p class="alert alert-warning" role="alert">
                                {{ $t('noEstasSubidoViaje') }}
                            </p>
                        </template>
                    </Loading>
                </div>
                <div class="col-xs-24">
                    <h3>{{ $t('misViajesPasados') }}</h3>
                    <Loading :data="oldDriverTrips">
                        <div class="trips-list">
                            <Trip
                                v-for="trip in oldDriverTrips"
                                :key="trip.id"
                                :trip="trip"
                                :user="profileUser"
                                :clickModal="true"
                            />
                        </div>
                        <template #no-data>
                            <p class="alert alert-warning" role="alert">
                                {{ $t('noHayNingunViajePasado') }}
                            </p>
                        </template>
                    </Loading>
                </div>
                <div class="col-xs-24">
                    <h3 v-html="$t('viajesMeSubi')"></h3>
                    <Loading :data="oldPassengerTrips">
                        <div class="trips-list">
                            <Trip
                                v-for="trip in oldPassengerTrips"
                                :key="trip.id"
                                :trip="trip"
                                :user="profileUser"
                                :clickModal="true"
                            />
                        </div>
                        <template #no-data>
                            <p class="alert alert-warning" role="alert">
                                {{ $t('noTeHasSubidoViaje') }}
                            </p>
                        </template>
                    </Loading>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script>
import AdminLayout from '../layouts/AdminLayout.vue';
import Trip from '../sections/Trip.vue';
import Loading from '../Loading.vue';
import { UserApi } from '../../services/api';
import { useTripsStore } from '../../stores/trips';
import { mapActions } from 'pinia';
import dialogs from '../../services/dialogs.js';

export default {
    name: 'admin-user-trips',
    components: {
        AdminLayout,
        Trip,
        Loading
    },
    data() {
        return {
            loading: true,
            profileUser: null,
            driverTrips: [],
            passengerTrips: [],
            oldDriverTrips: [],
            oldPassengerTrips: [],
            userApi: null
        };
    },
    computed: {
        hubRoute() {
            return {
                name: 'admin-users-user',
                params: { userId: this.$route.params.userId }
            };
        }
    },
    methods: {
        ...mapActions(useTripsStore, {
            tripAsDriver: 'tripsAsDriver',
            tripAsPassenger: 'tripsAsPassenger',
            oldTripsAsDriver: 'oldTripsAsDriver',
            oldTripsAsPassenger: 'oldTripsAsPassenger'
        }),
        load() {
            const userId = this.$route.params.userId;
            if (!userId) {
                this.$router.replace({ name: 'admin-users' });
                return;
            }
            this.loading = true;
            this.userApi
                .show(userId)
                .then(async (body) => {
                    this.profileUser = body.data || null;
                    if (!this.profileUser) {
                        throw new Error('not found');
                    }
                    const id = this.profileUser.id;
                    this.driverTrips = await this.tripAsDriver(id);
                    this.passengerTrips = await this.tripAsPassenger(id);
                    this.oldDriverTrips = await this.oldTripsAsDriver(id);
                    this.oldPassengerTrips = await this.oldTripsAsPassenger(id);
                })
                .catch(() => {
                    dialogs.message(this.$t('noSeEncontroNingunUsuario'), {
                        estado: 'error'
                    });
                    this.$router.replace({ name: 'admin-users' });
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    },
    watch: {
        '$route.params.userId'() {
            this.load();
        }
    },
    mounted() {
        this.userApi = new UserApi();
        this.load();
    }
};
</script>

<style scoped>
.admin-user-detail__back {
    margin-bottom: 12px;
}
</style>
