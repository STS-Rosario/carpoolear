<template>
    <div>
        <div
            class="buttons-container"
            v-if="!isPassengersView || (isPassengersView && owner)"
        >
            <router-link
                class="btn btn-primary"
                v-if="owner && !expired"
                :to="{ name: 'update-trip', params: { id: trip.id } }"
            >
                {{ t('editar') }}
            </router-link>
            <a
                class="btn btn-primary"
                v-if="owner && !expired"
                @click="emit('deleteTrip')"
                :disabled="sendingStatus"
            >
                <spinner
                    class="blue"
                    v-if="sending && sending.deleteAction"
                ></spinner>
                <span v-else>{{ t('cancelarViaje') }}</span>
            </a>
            <template
                v-if="
                    !owner &&
                    !expired &&
                    (!canRequest ||
                        !config.module_coordinate_by_message ||
                        (config.module_coordinate_by_message && isPassenger))
                "
            >
                <button
                    class="btn btn-primary"
                    @click="emit('toMessages')"
                    v-if="!owner"
                    :disabled="sendingStatus"
                >
                    <spinner
                        class="blue"
                        v-if="sending && sending.sendMessageAction"
                    ></spinner>
                    <span v-else>{{ t('enviarMensaje') }}</span>
                </button>
            </template>
            <template v-if="!owner && !trip.is_passenger && !expired">
                <template v-if="!isPassenger">
                    <button
                        class="btn btn-primary"
                        @click="emit('onMakeRequest')"
                        v-if="canRequest && trip.seats_available > 0"
                        :disabled="sendingStatus"
                    >
                        <template v-if="sending && sending.requestAction">
                            <spinner class="blue"></spinner>
                        </template>
                        <template v-else>
                            <template v-if="trip.user.autoaccept_requests">
                                <template
                                    v-if="
                                        config &&
                                        config.module_trip_seats_payment
                                    "
                                >
                                    {{ t('reservar') }} {{ $n(trip.seat_price_cents / 100, 'currency') }}
                                </template>
                                <template v-else>{{ t('reservar') }}</template>
                            </template>
                            <template
                                v-else-if="config.module_coordinate_by_message"
                            >
                                {{ t('enviarMensaje') }}
                            </template>
                            <template v-else>{{ t('solicitarAsiento') }}</template>
                        </template>
                    </button>
                    <button
                        class="btn"
                        v-if="!canRequest"
                        @click="emit('cancelRequest')"
                        :disabled="sendingStatus"
                    >
                        <spinner
                            class="blue"
                            v-if="sending && sending.requestAction"
                        ></spinner>
                        <span v-else>{{ t('solicitadoRetirar') }}</span>
                    </button>
                </template>

                <template v-if="isPassenger">
                    <button
                        class="btn btn-primary"
                        @click="emit('cancelRequest')"
                        v-if="canRequest"
                        :disabled="sendingStatus"
                    >
                        <spinner
                            class="blue"
                            v-if="sending && sending.requestAction"
                        ></spinner>
                        <span v-else>{{ t('bajarmeViaje') }}</span>
                    </button>
                </template>
            </template>
            <template v-if="expired">
                <button class="btn btn-primary" disabled>{{ t('finalizado') }}</button>
            </template>
            <template v-if="trip.seats_available === 0 && !trip.is_passenger">
                <div class="carpooled-trip">{{ t('viajeCarpooleado') }}</div>
            </template>
            <div
                class="alert alert-warning"
                role="alert"
                v-if="
                    config.module_show_pending_request_count &&
                    !isPassengersView &&
                    !owner &&
                    trip.passengerPending_count > 2
                "
                >
                    {{ t('atencionViajeSolicitado', { count: trip.passengerPending_count }) }}
                </div>
        </div>
        <div class="buttons-container" v-if="isPassengersView && !owner">
            <template v-if="true">
                <button
                    class="btn btn-primary"
                    @click="emit('toMessages')"
                    v-if="!owner"
                    :disabled="sendingStatus"
                >
                    <spinner
                        class="blue"
                        v-if="sending && sending.sendMessageAction"
                    ></spinner>
                    <span v-else>{{ t('enviarMensaje') }}</span>
                </button>
            </template>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTripsStore } from '@/stores/trips';
import { useAuthStore } from '@/stores/auth';
import { useDeviceStore } from '@/stores/device';
import moment from 'moment';
import spinner from '../Spinner.vue';
import Transactions from '../views/transactions.vue';

const { t } = useI18n();
const tripsStore = useTripsStore();
const authStore = useAuthStore();
const deviceStore = useDeviceStore();

const props = defineProps({
    sending: {
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(['deleteTrip', 'toMessages', 'onMakeRequest', 'cancelRequest']);

const trip = computed(() => tripsStore.currentTrip);
const tripCardTheme = computed(() => authStore.tripCardTheme);
const user = computed(() => authStore.user);
const isMobile = computed(() => deviceStore.isMobile);
const config = computed(() => authStore.appConfig);

const sendingStatus = computed(() => {
    return Object.keys(props.sending).some((k) => props.sending[k] === true);
});

const isPassenger = computed(() => {
    return Array.isArray(trip.value.allPassengerRequest)
        ? trip.value.allPassengerRequest.findIndex(
              (item) =>
                  item.user_id === user.value.id &&
                  (item.request_state === 1 || item.request_state === 4)
          ) >= 0
        : false;
});

const expired = computed(() => {
    return moment(trip.value.trip_date).format() < moment().format();
});

const owner = computed(() => {
    return trip.value && user.value && user.value.id === trip.value.user.id;
});

const canRequest = computed(() => {
    return !owner.value && !trip.value.request;
});

const isPassengersView = computed(() => {
    return trip.value.is_passenger;
});

function onShareLinkClick(event) {
    if (
        window.device &&
        window.device.platform &&
        window.device.platform.toLowerCase() !== 'browser'
    ) {
        event.preventDefault();
        let href = event.target.getAttribute('href');
        if (!href) {
            href = event.target.parentElement.getAttribute('href');
        }
        if (href) {
            window.location.href = href;
        }
    }
}

function onWhatsAppShareClick(event) {
    if (
        window.device &&
        window.device.platform &&
        window.device.platform.toLowerCase() !== 'browser'
    ) {
        event.preventDefault();
        if (
            window &&
            window.plugins &&
            window.plugins.socialsharing &&
            window.plugins.socialsharing.shareWithOptions
        ) {
            let message = t('publicarUnViajeCompartir');
            window.plugins.socialsharing.shareViaWhatsApp(
                message,
                null /* img */,
                decodeURIComponent(currentUrl.value),
                function () {
                    console.log('share ok');
                },
                function (errormsg) {
                    console.log('share not ok:', errormsg);
                }
            );
        }
    }
}
</script>
<style scoped>
.buttons-container button:first-child {
    margin-right: 0;
}
.buttons-container button {
    margin-bottom: 0.4em;
}
.buttons-container {
    text-align: center;
    margin-top: 1em;
    padding-bottom: 2rem;
}
@media only screen and (min-width: 768px) {
    .buttons-container button:first-child {
        margin-right: 1em;
    }
    .buttons-container {
        left: 42px;
        bottom: -25px;
        position: absolute;
        padding-bottom: 0;
        z-index: 1;
    }
}
.alert-warning {
    max-width: 400px;
    margin: 1em auto;
}
</style>
