<template>
    <div class="col-xs-24 col-md-16 col-lg-12">
        <div class="rate-pending_component clearfix">
            <div class="rate-pending_photo">
                <router-link
                    :to="{
                        name: 'profile',
                        params: {
                            id: user.id,
                            userProfile: user,
                            activeTab: 1
                        }
                    }"
                >
                    <div
                        class="trip_driver_img circle-box"
                        v-imgSrc:profile="user.image"
                    ></div>
                </router-link>
            </div>
            <modal
                :name="'modal'"
                v-if="showModalRequestSeat"
                @close="onModalClose"
                :title="$t('pendingRequestCarpoodatos')"
                :body="'Body'"
            >
                <template #header>
                    <h3>
                        <span>{{ $t('pendingRequestCarpoodatos') }}</span>
                        <i
                            v-on:click="onModalClose"
                            class="fa fa-times float-right-close"
                        ></i>
                    </h3>
                </template>
                <template #body>
                    <div class="text-left carpoodatos">
                        <p>
                            {{ $t('pendingRequestAntesDeAceptarSolicitud') }}
                        </p>
                        <p>
                            {{ $t('pendingRequestSiAceptasUnaSolicitud') }}
                        </p>
                        <p>
                            {{ $t('pendingRequestPodranCalificarseAunque') }}
                        </p>
                        <p>
                            {{ $t('pendingRequestNoPidasAsiento') }}
                        </p>
                        <p>
                            {{ $t('pendingRequestCualquierDudaEscribinos') }}
                            <a :href="'mailto:' + config.admin_email">
                                {{ config.admin_email }}
                            </a>
                            {{ $t('pendingRequestONuestrasRedesSociales') }}
                        </p>
                    </div>
                    <div class="check" style="margin-bottom: 10px">
                        <label class="check-inline">
                            <input
                                type="checkbox"
                                name="acceptRequestValor"
                                value="0"
                                v-model="acceptRequestValue"
                            />
                            <span>{{ $t('pendingRequestNoVolverAMostrarMensaje') }}</span>
                        </label>
                    </div>
                    <div class="text-center">
                        <button
                            class="btn btn-accept-request"
                            :disabled="acceptInProcess"
                            @click="toAcceptRequest"
                        >
                            <spinner
                                class="blue"
                                v-if="acceptInProcess"
                            ></spinner>
                            <span v-else>{{ $t('pendingRequestAceptar') }}</span>
                        </button>
                        <button
                            class="btn btn-secondary"
                            @click="onModalToChat"
                        >
                            {{ $t('pendingRequestEnviarMensaje') }}
                        </button>
                    </div>
                </template>
            </modal>
            <div class="rate-pending-message">
                <div class="rate-pending-message--content">
                    <strong>{{ user.name }}</strong>
                    {{ $t('pendingRequestQuiereSubirseAlViaje') }}
                    <strong>{{
                        trip.points[trip.points.length - 1].json_address.ciudad
                    }}</strong>
                    {{ $t('pendingRequestDelDia') }} {{ formatDate(trip.trip_date, 'DD/MM/YYYY') }} {{ $t('pendingRequestALas') }}
                    {{ formatDate(trip.trip_date, 'HH:mm') }}.
                    <div class="pending-buttons">
                        <button
                            class="btn btn-accept-request"
                            :disabled="acceptInProcess || rejectInProcess"
                            @click="onAcceptRequest"
                        >
                            <spinner
                                class="blue"
                                v-if="acceptInProcess"
                            ></spinner>
                            <span v-else>{{ $t('pendingRequestAceptar') }}</span>
                        </button>
                        <button
                            class="btn btn-primary"
                            :disabled="rejectInProcess || acceptInProcess"
                            @click="reject"
                        >
                            <spinner
                                class="blue"
                                v-if="rejectInProcess"
                            ></spinner>
                            <span v-else>{{ $t('pendingRequestRechazar') }}</span>
                        </button>
                    </div>
                    <div class="message-button">
                        <button class="btn btn-secondary" @click="chat">
                            {{ $t('pendingRequestEnviarMensaje') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { usePassengerStore } from '@/stores/passenger';
import { useConversationsStore } from '@/stores/conversations';
import { useProfileStore } from '@/stores/profile';
import modal from './Modal';
import dialogs from '../services/dialogs.js';
import spinner from './Spinner.vue';
import bus from '../services/bus-event.js';
import { formatDate } from '@/composables/useFormatters';
import { checkError } from '../../utils/helpers';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const passengerStore = usePassengerStore();
const conversationsStore = useConversationsStore();
const profileStore = useProfileStore();

const props = defineProps({
    user: {
        required: true
    },
    trip: {
        required: true
    }
});

const currentUser = authStore.user;
const config = authStore.appConfig;

const acceptInProcess = ref(false);
const rejectInProcess = ref(false);
const showModalRequestSeat = ref(false);
const acceptRequestValue = ref(0);

function onAcceptRequest() {
    if (
        currentUser.do_not_alert_accept_passenger ||
        config.disable_user_hints
    ) {
        toAcceptRequest();
    } else {
        showModalRequestSeat.value = true;
    }
}

function toAcceptRequest() {
    if (acceptRequestValue.value) {
        let data = {
            property: 'do_not_alert_accept_passenger',
            value: 1
        };
        profileStore.changeProperty(data).then(() => {
            console.log('do not alert success');
        });
    }

    let user = props.user;
    let trip = props.trip;
    acceptInProcess.value = true;
    passengerStore.accept({ user, trip })
        .catch((error) => {
            if (checkError(error, 'not_seat_available')) {
                dialogs.message(
                    t('pendingRequestNoPuedesAceptarEstaSolicitud'),
                    { duration: 10, estado: 'error' }
                );
                return;
            }
            console.error(error);
        })
        .finally(() => {
            acceptInProcess.value = false;
            bus.emit('request-status-changed');
        });
}

function reject() {
    if (acceptRequestValue.value) {
        let data = {
            property: 'do_not_alert_accept_passenger',
            value: 1
        };
        profileStore.changeProperty(data).then(() => {
            console.log('do not alert success');
        });
    }

    let user = props.user;
    let trip = props.trip;
    rejectInProcess.value = true;
    passengerStore.reject({ user, trip })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            rejectInProcess.value = false;
            bus.emit('request-status-changed');
        });
}

function chat() {
    let user = props.user;

    conversationsStore.createConversation(user).then((conversation) => {
        router.push({
            name: 'conversation-chat',
            params: { id: conversation.id }
        });
    });
}

function onModalToChat() {
    showModalRequestSeat.value = false;

    if (acceptRequestValue.value) {
        let data = {
            property: 'do_not_alert_accept_passenger',
            value: 1
        };
        profileStore.changeProperty(data).then(() => {
            console.log('do not alert success');
        });
    }
    chat();
}

function onModalClose() {
    showModalRequestSeat.value = false;

    if (acceptRequestValue.value) {
        let data = {
            property: 'do_not_alert_accept_passenger',
            value: 1
        };
        profileStore.changeProperty(data).then(() => {
            console.log('do not alert success');
        });
    }
}
</script>
