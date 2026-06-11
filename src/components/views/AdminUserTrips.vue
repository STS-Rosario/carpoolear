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
                    <AdminUserTripsTable
                        :trips="driverTrips"
                        :empty-message="$t('noHayViajes')"
                        :canceling-id="cancelingTripId"
                        v-on:cancel="onTripCanceled"
                    />
                </div>
                <div class="col-xs-24">
                    <h3>
                        {{ $t('viajes') }}
                        <strong>{{ $t('pasajero') }}</strong>
                    </h3>
                    <AdminUserTripsTable
                        :trips="passengerTrips"
                        :empty-message="$t('noEstasSubidoViaje')"
                        :canceling-id="cancelingTripId"
                        v-on:cancel="onTripCanceled"
                    />
                </div>
                <div class="col-xs-24">
                    <h3>{{ $t('misViajesPasados') }}</h3>
                    <AdminUserTripsTable
                        :trips="oldDriverTrips"
                        :empty-message="$t('noHayNingunViajePasado')"
                        :canceling-id="cancelingTripId"
                        v-on:cancel="onTripCanceled"
                    />
                </div>
                <div class="col-xs-24">
                    <h3 v-html="$t('viajesMeSubi')"></h3>
                    <AdminUserTripsTable
                        :trips="oldPassengerTrips"
                        :empty-message="$t('noTeHasSubidoViaje')"
                        :canceling-id="cancelingTripId"
                        v-on:cancel="onTripCanceled"
                    />
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script>
import AdminLayout from '../layouts/AdminLayout.vue';
import AdminUserTripsTable from '../elements/AdminUserTripsTable.vue';
import { UserApi } from '../../services/api';
import { useTripsStore } from '../../stores/trips';
import { mapActions } from 'pinia';
import dialogs from '../../services/dialogs.js';

export default {
    name: 'admin-user-trips',
    components: {
        AdminLayout,
        AdminUserTripsTable
    },
    data() {
        return {
            loading: true,
            profileUser: null,
            driverTrips: [],
            passengerTrips: [],
            oldDriverTrips: [],
            oldPassengerTrips: [],
            userApi: null,
            cancelingTripId: null
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
            oldTripsAsPassenger: 'oldTripsAsPassenger',
            remove: 'remove'
        }),
        async fetchTripLists(userId) {
            const body = await this.userApi.show(userId);
            this.profileUser = body.data || null;
            if (!this.profileUser) {
                throw new Error('not found');
            }
            const id = this.profileUser.id;
            this.driverTrips = await this.tripAsDriver(id);
            this.passengerTrips = await this.tripAsPassenger(id);
            this.oldDriverTrips = await this.oldTripsAsDriver(id);
            this.oldPassengerTrips = await this.oldTripsAsPassenger(id);
        },
        load() {
            const userId = this.$route.params.userId;
            if (!userId) {
                this.$router.replace({ name: 'admin-users' });
                return;
            }
            this.loading = true;
            this.fetchTripLists(userId)
                .catch(() => {
                    dialogs.message(this.$t('noSeEncontroNingunUsuario'), {
                        estado: 'error'
                    });
                    this.$router.replace({ name: 'admin-users' });
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        onTripCanceled(trip) {
            if (!trip || trip.deleted || !window.confirm(this.$t('seguroCancelar'))) {
                return;
            }
            this.cancelingTripId = trip.id;
            this.remove(trip.id)
                .then(() => {
                    dialogs.message(this.$t('viajeCancelado'), {
                        estado: 'success'
                    });
                    return this.fetchTripLists(this.$route.params.userId);
                })
                .catch(() => {
                    dialogs.message(this.$t('errorAlCancelar'), {
                        estado: 'error'
                    });
                })
                .finally(() => {
                    this.cancelingTripId = null;
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
