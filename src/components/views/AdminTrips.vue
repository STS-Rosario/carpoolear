<template>
    <div class="col-md-24">
        <div class="row">
            <adminNav></adminNav>
        </div>
        <div class="row">
            <div class="col-md-22 col-md-offset-1">
                <adminSearchTrip
                    v-on:admin-trip-search="research"
                ></adminSearchTrip>
            </div>
        </div>
        <div class="row">
            <div class="col-md-22 col-md-offset-1">
                <table class="table table-dark">
                    <thead>
                        <tr>
                            <th scope="col">{{ t('usuario') }}</th>
                            <th scope="col">{{ t('origen') }}</th>
                            <th scope="col">{{ t('destino') }}</th>
                            <th scope="col">{{ t('fecha') }}</th>
                            <th scope="col">{{ t('hora') }}</th>
                            <th scope="col">{{ t('asientosTotales') }}</th>
                            <th scope="col">{{ t('ocupados') }}</th>
                            <th scope="col">{{ t('solicitudes') }}</th>
                            <th scope="col">{{ t('estado') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="viaje in viajes"
                            v-on:click="openTrip(viaje)"
                        >
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
                                        ? t('oculto')
                                            : viaje.deleted
                                            ? t('borrado')
                                            : t('activo')
                                }}
                                <button
                                    v-if="!viaje.deleted"
                                    class="btn btn-primary"
                                    v-on:click.stop="
                                        onChangeVisibility(viaje.id)
                                    "
                                >
                                    {{ viaje.hidden ? t('activar') : t('ocultar') }}
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
                        {{ t('siguiente') }}
                    </button>
                </div>
                <tripDisplay
                    v-if="showTrip"
                    :trip="currentViaje"
                    :clickOutside="closeTrip"
                ></tripDisplay>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, triggerRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTripsStore } from '@/stores/trips';
import adminNav from '../sections/adminNav';
import adminSearchTrip from '../sections/AdminSearchTrips';
import tripDisplay from '../sections/TripDisplay';

const { t } = useI18n();
const tripsStore = useTripsStore();

const viajes = ref([]);
const query = ref({});
const currentViaje = ref({});
const showTrip = ref(false);

const research = (params) => {
    console.log('research', params);
    query.value = params;
    tripsStore.tripsSearch(params).then((data) => {
        viajes.value = data.data;
    });
};

const nextPage = () => {
    query.value.next = true;
    tripsStore.tripsSearch(query.value).then((data) => {
        viajes.value = data.data;
    });
    window.scrollTo({}, 0);
};

const openTrip = (viaje) => {
    currentViaje.value = viaje;
    showTrip.value = true;
    console.log('trip', viaje);
};

const closeTrip = () => {
    currentViaje.value = {};
    showTrip.value = false;
};

const onChangeVisibility = (id) => {
    tripsStore.changeVisibility({ id: id }).then((trip) => {
        for (let index = 0; index < viajes.value.length; index++) {
            console.log(
                'changeVisibility',
                viajes.value[index].id === trip.data.id
            );
            if (viajes.value[index].id === trip.data.id) {
                viajes.value[index] = trip.data;
            }
        }
    });
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
</style>
