<template>
    <div class="trip_actions" v-if="conversation && conversation.trip">
        <div class="trip_actions-detail">
            <span v-if="owner">{{ t('coordinateTripTeEnviaUnaConsultaPorTuViajeDesde') }}</span>
            <span v-else>{{ t('coordinateTripViajeDesde') }}</span>
            <strong>{{ conversation.trip.from_town }}</strong>
            {{ t('coordinateTripHacia') }}
            <strong>{{ conversation.trip.to_town }}</strong>
            <span v-if="owner">
                {{ t('coordinateTripDelDia') }}
                <strong>{{
                    formatDate(conversation.trip.trip_date, 'DD/MM/YYYY')
                }}</strong>
                {{ t('coordinateTripALas') }}
                <strong
                    >{{
                        formatDate(conversation.trip.trip_date, 'HH:mm')
                    }})</strong
                >
                <template v-if="conversation.trip.return_trip">
                    {{ t('coordinateTripYVueltaElDia') }}
                    <strong>{{
                        formatDate(conversation.return_trip.trip_date, 'DD/MM/YYYY')
                    }}</strong>
                    {{ t('coordinateTripALas2') }}
                    <strong
                        >{{
                            formatDate(conversation.return_trip.trip_date, 'HH:mm')
                        }})</strong
                    >
                </template>
            </span>
        </div>
        <template v-if="!owner">
            <button
                :disabled="sending.trip || expiredTrip"
                :style="
                    !conversation.return_trip
                        ? { float: 'none', width: '100%' }
                        : {}
                "
                class="btn btn-primary"
                @click="
                    isPassengerTrip || conversation.trip.request === 'send'
                        ? cancelRequest(false)
                        : doRequest(false)
                "
            >
                <span v-if="isPassengerTrip">
                    {{ t('bajarmeViaje') }}
                    <template v-if="conversation.return_trip">{{ t('deIda') }}</template>
                </span>
                <span v-else-if="conversation.trip.request === 'send'">
                    {{ t('retirarSolicitudDeAsiento') }}
                    <template v-if="conversation.return_trip">{{ t('deIda') }}</template>
                </span>
                <span v-else-if="sending.trip">
                    <spinner
                        class="blue"
                        v-if="sending && sending.trip"
                    ></spinner>
                </span>
                <span v-else-if="expiredTrip">{{ t('viajeCarpooleado') }}</span>
                <span v-else>
                    <template v-if="config && config.module_trip_seats_payment">
                        {{ t('reservar') }} {{ $n(conversation.trip.seat_price_cents / 100, 'currency') }}
                        <template v-if="conversation.return_trip"
                            >{{ t('deIda') }}</template
                        >
                    </template>
                    <template v-else>
                        {{ t('solicitarAsiento') }}
                        <template v-if="conversation.return_trip"
                            >{{ t('deIda') }}</template
                        >
                    </template>
                </span>
                <template v-if="!sending.trip">
                    <strong
                        >({{
                            formatDate(conversation.trip.trip_date, 'DD/MM/YYYY')
                        }}</strong
                    >
                    -
                    <strong
                        >{{
                            formatDate(conversation.trip.trip_date, 'HH:mm')
                        }})</strong
                    >
                </template>
            </button>
        </template>
        <template v-if="conversation.return_trip">
            <button
                :disabled="sending.returnTrip || expiredReturnTrip"
                class="btn btn-primary"
                @click="
                    isPassengerReturnTrip ||
                    conversation.return_trip.request === 'send'
                        ? cancelRequest(true)
                        : doRequest(true)
                "
            >
                <span v-if="isPassengerReturnTrip"
                    >{{ t('bajarmeDelViajeDeVuelta') }}</span
                >
                <span v-else-if="conversation.return_trip.request === 'send'">
                    {{ t('retirarSolicitudDeAsientoDeVuelta') }}
                </span>
                <span v-else-if="sending.returnTrip">
                    <spinner class="blue" v-if="sending.returnTrip"></spinner>
                </span>
                <span v-else-if="expiredReturnTrip">{{ t('viajeCarpooleado') }}</span>
                <span v-else>
                    <template v-if="config && config.module_trip_seats_payment">
                        {{ t('reservar') }} {{ $n(conversation.return_trip.seat_price_cents / 100, 'currency') }} {{ t('deVuelta') }}
                    </template>
                    <template v-else>{{ t('solicitarAsientoDeVuelta') }}</template>
                </span>
                <template v-if="!sending.returnTrip">
                    <strong>
                        ({{
                            formatDate(conversation.return_trip.trip_date, 'DD/MM/YYYY')
                        }}
                    </strong>
                    -
                    <strong
                        >{{
                            formatDate(conversation.return_trip.trip_date, 'HH:mm')
                        }})</strong
                    >
                </template>
            </button>
        </template>
    </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useConversationsStore } from '@/stores/conversations';
import { useAuthStore } from '@/stores/auth';
import { usePassengerStore } from '@/stores/passenger';
import { formatDate } from '@/composables/useFormatters';
import dialogs from '../../services/dialogs.js';
import spinner from '../Spinner.vue';
import moment from 'moment';

const { t } = useI18n();
const conversationsStore = useConversationsStore();
const authStore = useAuthStore();
const passengerStore = usePassengerStore();

const sending = reactive({
    trip: false,
    returnTrip: false
});

const conversation = computed(() => conversationsStore.selectedConversation);
const config = computed(() => authStore.appConfig);
const user = computed(() => authStore.user);

const owner = computed(() => {
    return (
        conversation.value.trip &&
        user.value &&
        user.value.id === conversation.value.trip.user.id
    );
});

const isPassengerTrip = computed(() => {
    return (
        conversation.value.trip &&
        conversation.value.trip.passenger.findIndex(
            (item) =>
                item.user_id === user.value.id &&
                (item.request_state === 1 || item.request_state === 4)
        ) >= 0
    );
});

const isPassengerReturnTrip = computed(() => {
    return (
        conversation.value.return_trip &&
        conversation.value.return_trip.passenger.findIndex(
            (item) =>
                item.user_id === user.value.id &&
                (item.request_state === 1 || item.request_state === 4)
        ) >= 0
    );
});

const expiredTrip = computed(() => {
    return (
        moment(conversation.value.trip.trip_date).format() <
        moment().format()
    );
});

const expiredReturnTrip = computed(() => {
    return (
        moment(conversation.value.return_trip.trip_date).format() <
        moment().format()
    );
});

function doRequest(isReturnTrip = false) {
    if (config.value.module_coordinate_by_message) {
        sending[isReturnTrip ? 'returnTrip' : 'trip'] = true;
        let trip = isReturnTrip
            ? conversation.value.return_trip
            : conversation.value.trip;
        passengerStore.makeRequest(trip.id)
            .then((response) => {
                trip.request = 'send';
            })
            .finally(() => {
                sending[isReturnTrip ? 'returnTrip' : 'trip'] = false;
            });
    }
}

function cancelRequest(isReturnTrip = false) {
    if (config.value.module_coordinate_by_message) {
        if (
            window.confirm(
                t('seguroBajarteViaje')
            )
        ) {
            sending[isReturnTrip ? 'trip' : 'returnTrip'] = true;
            let trip = isReturnTrip
                ? conversation.value.return_trip
                : conversation.value.trip;
            passengerStore.cancel({ user: user.value, trip: trip })
                .then(() => {
                    dialogs.message(t('teHasBajadoViaje'));
                    if (trip.request === 'send') {
                        trip.request = '';
                    }
                    if (
                        isPassengerTrip.value ||
                        isPassengerReturnTrip.value
                    ) {
                        let index = trip.passenger.findIndex(
                            (item) =>
                                item.id === user.value.id &&
                                (item.request_state === 1 ||
                                    item.request_state === 4)
                        );
                        if (index >= 0) {
                            trip.passenger[index].request_state = 3;
                            trip.seats_available++;
                            trip.passenger_count--;
                        }
                    }
                })
                .catch((error) => {
                    console.error(error);
                    dialogs.message(
                        t('problemaSolicitar'),
                        { estado: 'error' }
                    );
                })
                .finally(() => {
                    sending[isReturnTrip ? 'trip' : 'returnTrip'] = false;
                });
        }
    }
}
</script>

<style scoped>
.trip_actions .btn-primary {
    font-size: 12px;
    width: 100%;
}
@media only screen and (max-width: 768px) {
    .trip_actions {
        padding: 0.4em 0.8em;
        width: 100%;
        border-radius: 0;
        box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.4);
        font-size: 0.9em;
        position: fixed;
        z-index: 10;
        background-color: #f6f6f6;
    }
    .trip_actions .btn-primary {
        display: block;
        width: 100%;
        font-size: 11px;
        margin-bottom: 0;
        margin: 0;
        padding: 0;
    }
    .trip_actions-detail {
        padding-bottom: 0.3em;
        padding-left: 0.4em;
    }
}
@media only screen and (min-width: 1100px) {
    .trip_actions .btn-primary {
        float: left;
        width: 50%;
    }
}
</style>

<style>
.module--coordinate-by-message #btn-more {
    padding: 0.4em;
}
.module--coordinate-by-message .conversation_chat p,
.module--coordinate-by-message .message_text {
    font-size: 12px;
}
.module--coordinate-by-message .conversation-lastmessage {
    font-size: 12px;
}
.module--coordinate-by-message .conversation-component.container {
    padding-bottom: 0;
    margin-bottom: 0;
}
.module--coordinate-by-message
    .conversation_chat
    .list-group-item:nth-child(2) {
    height: calc(100% - 245px);
}
@media only screen and (min-width: 768px) {
    .module--coordinate-by-message .conversation_chat p,
    .module--coordinate-by-message .message_text {
        font-size: 12px;
    }
    @media only screen and (min-width: 1000px) {
        .module--coordinate-by-message
            .conversation_chat
            .list-group-item:nth-child(2) {
            height: calc(100% - 205px);
        }
    }
}
</style>
