<template>
    <AdminLayout>
        <div class="row">
            <div class="col-md-22 col-md-offset-1">
                <adminSearchTrip
                    :params="routeSearchParams"
                    v-on:admin-trip-search="research"
                ></adminSearchTrip>
            </div>
        </div>
        <div class="row">
            <div class="col-md-22 col-md-offset-1">
                <table class="table table-dark">
                    <thead>
                        <tr>
                            <th scope="col">{{ $t('id') }}</th>
                            <th scope="col">{{ $t('usuario') }}</th>
                            <th scope="col">{{ $t('origen') }}</th>
                            <th scope="col">{{ $t('destino') }}</th>
                            <th scope="col">{{ $t('fecha') }}</th>
                            <th scope="col">{{ $t('hora') }}</th>
                            <th scope="col">{{ $t('asientosTotales') }}</th>
                            <th scope="col">{{ $t('ocupados') }}</th>
                            <th scope="col">{{ $t('solicitudes') }}</th>
                            <th scope="col">{{ $t('estado') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="viaje in viajes"
                            :key="viaje.id"
                            class="admin-trips-row-clickable"
                            v-on:click="openTrip(viaje)"
                        >
                            <td>{{ viaje.id }}</td>
                            <th scope="row">{{ viaje.user.name }}</th>
                            <td>{{ viaje.from_town }}</td>
                            <td>{{ viaje.to_town }}</td>
                            <td>{{ viaje.trip_date.slice(0, 10) }}</td>
                            <td>{{ viaje.trip_date.slice(10, 20) }}</td>
                            <td>{{ viaje.total_seats }}</td>
                            <td>{{ viaje.passengerAccepted_count }}</td>
                            <td>{{ viaje.request_count }}</td>
                            <td>
                                {{
                                    viaje.hidden
                                        ? $t('oculto')
                                            : viaje.deleted
                                            ? $t('borrado')
                                            : $t('activo')
                                }}
                                <button
                                    v-if="!viaje.deleted"
                                    class="btn btn-primary"
                                    v-on:click.stop="
                                        onChangeVisibility(viaje.id)
                                    "
                                >
                                    {{ viaje.hidden ? $t('activar') : $t('ocultar') }}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="row" v-if="viajes.length > 0">
                    <button
                        type="button"
                        class="btn btn-default pull-right"
                        v-on:click="nextPage"
                    >
                        {{ $t('siguiente') }}
                    </button>
                </div>
                <tripDisplay
                    v-if="showTrip"
                    :trip="currentViaje"
                    :clickOutside="closeTrip.bind(this)"
                ></tripDisplay>
            </div>
        </div>
    </AdminLayout>
</template>

<script>
import AdminLayout from '../layouts/AdminLayout.vue';
import adminSearchTrip from '../sections/AdminSearchTrips';
import { mapActions } from 'pinia';
import { useTripsStore } from '../../stores/trips';
import tripDisplay from '../sections/TripDisplay';

const TRIP_ID_QUERY_KEY = 'trip_id';

export default {
    name: 'admin-trips',
    data() {
        return {
            viajes: [],
            query: {},
            currentViaje: {},
            showTrip: false,
            lastPublishedListQueryStr: null
        };
    },
    computed: {
        routeSearchParams() {
            const q = { ...(this.$route.query || {}) };
            delete q[TRIP_ID_QUERY_KEY];
            return q;
        }
    },
    watch: {
        '$route.query': {
            deep: true,
            handler() {
                this.onRouteQueryChanged();
            }
        }
    },
    methods: {
        ...mapActions(useTripsStore, {
            search: 'tripsSearch',
            show: 'show',
            changeVisibility: 'changeVisibility'
        }),
        unwrapTripListResponse(response) {
            const body =
                response && response.data !== undefined
                    ? response.data
                    : response;
            if (Array.isArray(body)) {
                return body;
            }
            if (body && Array.isArray(body.data)) {
                return body.data;
            }
            return [];
        },
        listQueryString(query) {
            const qo = { ...(query || {}) };
            delete qo[TRIP_ID_QUERY_KEY];
            if (qo.page === '1' || qo.page === 1) {
                delete qo.page;
            }
            const sorted = Object.keys(qo).sort();
            const normalized = {};
            sorted.forEach((k) => {
                normalized[k] = String(qo[k]);
            });
            return JSON.stringify(normalized);
        },
        fullQueryString(query) {
            const qo = { ...(query || {}) };
            if (qo.page === '1' || qo.page === 1) {
                delete qo.page;
            }
            const sorted = Object.keys(qo).sort();
            const normalized = {};
            sorted.forEach((k) => {
                normalized[k] = String(qo[k]);
            });
            return JSON.stringify(normalized);
        },
        buildListRouteQuery() {
            const store = useTripsStore();
            const data = { ...(store.tripsSearchParam?.data || {}) };
            delete data.next;
            delete data.page;
            const query = {};
            Object.keys(data).forEach((k) => {
                const v = data[k];
                if (v === undefined || v === null || v === '') {
                    return;
                }
                query[k] =
                    typeof v === 'boolean' ? (v ? 'true' : 'false') : String(v);
            });
            const page = store.tripsSearchParam?.page ?? 1;
            if (page > 1) {
                query.page = String(page);
            }
            if (
                this.showTrip &&
                this.currentViaje &&
                this.currentViaje.id != null
            ) {
                query[TRIP_ID_QUERY_KEY] = String(this.currentViaje.id);
            }
            return query;
        },
        pushListQueryToRouter() {
            const query = this.buildListRouteQuery();
            this.lastPublishedListQueryStr = this.listQueryString(query);
            if (this.fullQueryString(query) !== this.fullQueryString(this.$route.query || {})) {
                this.$router.push({ query }).catch(() => {});
            }
        },
        routeQueryToSearchParams(rawQuery) {
            const query = { ...(rawQuery || {}) };
            delete query[TRIP_ID_QUERY_KEY];
            const numericFields = new Set([
                'user_id',
                'origin_id',
                'destination_id',
                'origin_lat',
                'origin_lng',
                'origin_radio',
                'destination_lat',
                'destination_lng',
                'destination_radio',
                'page'
            ]);
            const out = { ...query };
            Object.keys(out).forEach((k) => {
                const v = out[k];
                if (v === '' || v === undefined || v === null) {
                    delete out[k];
                    return;
                }
                if (k === 'is_passenger' || k === 'is_admin' || k === 'history') {
                    const s = String(v).toLowerCase();
                    out[k] = s === 'true' || s === '1';
                    return;
                }
                if (numericFields.has(k)) {
                    const n = parseFloat(String(v));
                    if (Number.isFinite(n)) {
                        out[k] = n;
                    } else {
                        delete out[k];
                    }
                }
            });
            return out;
        },
        internalSearch(params, { pushUrl = false, skipTripDetail = false } = {}) {
            const clean = { ...params };
            delete clean.next;
            this.query = clean;
            return this.search(params).then((response) => {
                this.viajes = this.unwrapTripListResponse(response);
                if (pushUrl) {
                    this.pushListQueryToRouter();
                }
                if (!skipTripDetail) {
                    this.syncTripDetailFromRoute();
                }
            });
        },
        research(params) {
            return this.internalSearch(params, {
                pushUrl: true,
                skipTripDetail: false
            });
        },
        refetchListFromRoute() {
            const raw = { ...(this.$route.query || {}) };
            delete raw[TRIP_ID_QUERY_KEY];
            const params = this.routeQueryToSearchParams(raw);
            const keys = Object.keys(params).filter((k) => k !== 'page');
            if (!keys.length && !params.page) {
                this.lastPublishedListQueryStr = this.listQueryString(
                    this.$route.query
                );
                this.syncTripDetailFromRoute();
                return Promise.resolve();
            }
            return this.internalSearch(params, {
                pushUrl: false,
                skipTripDetail: true
            }).then(() => {
                this.lastPublishedListQueryStr = this.listQueryString(
                    this.$route.query
                );
                this.syncTripDetailFromRoute();
            });
        },
        onRouteQueryChanged() {
            const incoming = this.listQueryString(this.$route.query);
            if (incoming === this.lastPublishedListQueryStr) {
                this.syncTripDetailFromRoute();
                return;
            }
            this.refetchListFromRoute();
        },
        syncTripDetailFromRoute() {
            const raw = this.$route.query[TRIP_ID_QUERY_KEY];
            if (raw == null || raw === '') {
                if (this.showTrip) {
                    this.closeTrip({ skipRouter: true });
                }
                return;
            }
            const tid = parseInt(String(raw), 10);
            if (!Number.isFinite(tid)) {
                return;
            }
            if (
                this.showTrip &&
                this.currentViaje &&
                this.currentViaje.id === tid
            ) {
                return;
            }
            const row = this.viajes.find((v) => v.id === tid);
            if (row) {
                this.currentViaje = row;
                this.showTrip = true;
                return;
            }
            this.show(tid)
                .then((res) => {
                    const body = res.data;
                    const trip =
                        body && body.data !== undefined ? body.data : body;
                    this.currentViaje = trip || {};
                    this.showTrip = true;
                })
                .catch(() => {
                    this.clearTripIdFromRoute();
                });
        },
        clearTripIdFromRoute() {
            const q = { ...(this.$route.query || {}) };
            delete q[TRIP_ID_QUERY_KEY];
            this.lastPublishedListQueryStr = this.listQueryString(q);
            if (this.fullQueryString(q) !== this.fullQueryString(this.$route.query || {})) {
                this.$router.push({ query: q }).catch(() => {});
            }
        },
        nextPage() {
            this.search({ next: true }).then((response) => {
                this.viajes = this.unwrapTripListResponse(response);
                this.pushListQueryToRouter();
            });
            window.scrollTo({}, 0);
        },
        openTrip(viaje) {
            this.currentViaje = viaje;
            this.showTrip = true;
            this.pushListQueryToRouter();
        },
        closeTrip(options = {}) {
            this.showTrip = false;
            this.currentViaje = {};
            if (!options.skipRouter) {
                this.pushListQueryToRouter();
            }
        },
        onChangeVisibility(id) {
            this.changeVisibility({ id: id }).then((trip) => {
                for (let index = 0; index < this.viajes.length; index++) {
                    if (this.viajes[index].id === trip.data.id) {
                        this.viajes[index] = trip.data;
                        this.$forceUpdate();
                    }
                }
            });
        }
    },
    components: {
        AdminLayout,
        adminSearchTrip,
        tripDisplay
    }
};
</script>

<style scoped>
.chart-card {
    margin-bottom: 20px;
}
.card {
    background-color: #fff;
    border-radius: 2px;
}
.picker {
    margin-top: 1em;
}

.admin-trips-row-clickable {
    cursor: pointer;
}
</style>
