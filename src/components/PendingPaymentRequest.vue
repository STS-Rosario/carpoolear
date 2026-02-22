<template>
    <div class="col-xs-24 col-md-16 col-lg-12">
        <div class="rate-pending_component clearfix" v-if="trip">
            <div class="rate-pending-message">
                <div class="rate-pending-message--content">
                    <h3>{{ $t('pendingPaymentConfirmarTuAsiento') }}</h3>
                    {{ $t('pendingPaymentTeHanAceptadoEnElViajeHacia') }}
                    <strong>
                        {{
                            trip.points[trip.points.length - 1].json_address
                                ? trip.points[trip.points.length - 1]
                                      .json_address.name
                                : trip.points[trip.points.length - 1].address
                        }}
                        {{ $t('pendingRequestDelDia') }} {{ formatDate(trip.trip_date, 'DD/MM/YYYY') }} {{ $t('pendingRequestALas') }}
                        {{ formatDate(trip.trip_date, 'HH:mm') }}
                    </strong>
                    {{ $t('pendingPaymentAhoraDebesRealizarElPagoDe') }}
                    <strong>{{ $n(trip.seat_price_cents / 100, 'currency') }}</strong>
                    {{ $t('pendingPaymentParaConfirmarTuAsiento') }}
                    <div class="pending-buttons">
                        <button
                            class="btn btn-accept-request"
                            :disabled="acceptInProcess"
                            @click="onAcceptRequest"
                        >
                            {{ $t('pendingPaymentPagar') }}
                        </button>
                        <button
                            class="btn btn-default"
                            :disabled="rejectInProcess"
                            @click="onCancelRequest"
                        >
                            {{ $t('cancelar') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { useTripsStore } from '@/stores/trips';
import { useMyTripsStore } from '@/stores/myTrips';
import { usePassengerStore } from '@/stores/passenger';
import { getTrip } from '@/stores/index';
import dialogs from '../services/dialogs.js';
import { formatDate } from '@/composables/useFormatters';

const { t } = useI18n();
const authStore = useAuthStore();
const tripsStore = useTripsStore();
const myTripsStore = useMyTripsStore();
const passengerStore = usePassengerStore();

const props = defineProps({
    request: {
        required: true
    }
});

const currentUser = authStore.user;

const acceptInProcess = ref(false);
const rejectInProcess = ref(false);
const acceptRequestValue = ref(0);
const trip = ref(null);

onMounted(() => {
    getTrip(tripsStore, myTripsStore, props.request.trip_id).then((tripData) => {
        console.log('trip to pay', tripData);
        trip.value = tripData;
    });
});

function onAcceptRequest() {
    let baseUrl = import.meta.env.VITE_API_URL;
    let url = baseUrl + '/transbank?tp_id=' + props.request.id;
    if (window.location.protocol.indexOf('http') >= 0) {
        window.location.href = url;
    } else {
        var popup = window.open(
            url,
            '_blank',
            'location=no,hidden=yes,zoom=no'
        );
        console.log('onAcceptRequest', url);
        popup.addEventListener(
            'message',
            (params) => {
                console.log('message', params);
                popup.close();
            },
            false
        );
    }
}

function onCancelRequest() {
    if (window.confirm(t('seguroBajarteViaje'))) {
        rejectInProcess.value = true;
        passengerStore.cancel({
            user: currentUser,
            trip: trip.value,
            cancelTripForPayment: true
        })
            .then(() => {
                rejectInProcess.value = false;
                dialogs.message(t('teHasBajadoViaje'));
            })
            .catch(() => {
                rejectInProcess.value = false;
            });
    }
}
</script>
