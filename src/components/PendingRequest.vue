<template>
    <div class="pending-request-card">
        <div class="pending-request-card__photo">
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
                    class="pending-request-card__avatar circle-box"
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
            <template #header><h3>
                <span>{{ $t('pendingRequestCarpoodatos') }}</span>
                <i
                    v-on:click="onModalClose"
                    class="fa fa-times float-right-close"
                ></i>
            </h3></template>
            <template #body><div>
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
                <div class="pending-request-card__modal-actions">
                    <AppButton
                        variant="success"
                        :disabled="acceptInProcess"
                        :loading="acceptInProcess"
                        @click="toAcceptRequest"
                    >
                        {{ $t('pendingRequestAceptar') }}
                        <template #loading>
                            <spinner class="blue"></spinner>
                        </template>
                    </AppButton>
                    <AppButton
                        variant="secondary"
                        @click="onModalToChat"
                    >
                        {{ $t('pendingRequestEnviarMensaje') }}
                    </AppButton>
                </div>
            </div></template>
        </modal>
        <div class="pending-request-card__message">
            <div class="pending-request-card__content">
                <strong>{{ user.name }}</strong>
                {{ $t('pendingRequestQuiereSubirseAlViaje') }}
                <strong>{{
                    trip.points[trip.points.length - 1].json_address.ciudad
                }}</strong>
                {{ $t('pendingRequestDelDia') }} {{ dayjs(trip.trip_date).format('DD/MM/YYYY') }} {{ $t('pendingRequestALas') }}
                {{ dayjs(trip.trip_date).format('HH:mm') }}.
                <div class="pending-request-card__actions">
                    <AppButton
                        variant="success"
                        :disabled="acceptInProcess || rejectInProcess"
                        :loading="acceptInProcess"
                        @click="onAcceptRequest"
                    >
                        {{ $t('pendingRequestAceptar') }}
                        <template #loading>
                            <spinner class="blue"></spinner>
                        </template>
                    </AppButton>
                    <AppButton
                        variant="danger"
                        :disabled="rejectInProcess || acceptInProcess"
                        :loading="rejectInProcess"
                        @click="reject"
                    >
                        {{ $t('pendingRequestRechazar') }}
                        <template #loading>
                            <spinner class="blue"></spinner>
                        </template>
                    </AppButton>
                </div>
                <div class="pending-request-card__message-action">
                    <AppButton
                        variant="secondary"
                        @click="chat"
                    >
                        {{ $t('pendingRequestEnviarMensaje') }}
                    </AppButton>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '../stores/auth';
import { usePassengerStore } from '../stores/passenger';
import { useConversationsStore } from '../stores/conversations';
import { useProfileStore } from '../stores/profile';
import router from '../router';
import modal from './Modal';
import dialogs from '../services/dialogs.js';
import spinner from './Spinner.vue';
import bus from '../services/bus-event.js';
import dayjs from '../dayjs';
import AppButton from './ui/AppButton.vue';

export default {
    data() {
        return {
            acceptInProcess: false,
            rejectInProcess: false,
            showModalRequestSeat: false,
            acceptRequestValue: 0
        };
    },
    computed: {
        ...mapState(useAuthStore, {
            currentUser: 'user',
            config: 'appConfig'
        })
    },
    methods: {
        dayjs,
        ...mapActions(usePassengerStore, {
            passengerAccept: 'accept',
            passengerReject: 'reject'
        }),
        ...mapActions(useConversationsStore, {
            lookConversation: 'createConversation'
        }),
        ...mapActions(useProfileStore, {
            changeProperty: 'changeProperty'
        }),

        onAcceptRequest() {
            if (
                this.currentUser.do_not_alert_accept_passenger ||
                this.config.disable_user_hints
            ) {
                this.toAcceptRequest();
            } else {
                this.showModalRequestSeat = true;
            }
        },

        toAcceptRequest() {
            if (this.$redirectToIdentityValidationIfRequired()) return;
            if (this.$redirectToMyTripsIfPendingRatingsRequired()) return;
            if (this.acceptRequestValue) {
                let data = {
                    property: 'do_not_alert_accept_passenger',
                    value: 1
                };
                this.changeProperty(data).then(() => {
                    console.log('do not alert success');
                });
            }

            let user = this.user;
            let trip = this.trip;
            this.acceptInProcess = true;
            this.passengerAccept({ user, trip })
                .catch((error) => {
                    if (this.$checkError(error, 'identity_validation_required')) {
                        this.$router.push({ name: 'identity_validation' });
                        dialogs.message(this.$t('debesValidarIdentidadParaAccion'), {
                            estado: 'error'
                        });
                        return;
                    }
                    if (this.$checkError(error, 'not_seat_available')) {
                        dialogs.message(
                            this.$t('pendingRequestNoPuedesAceptarEstaSolicitud'),
                            { duration: 10, estado: 'error' }
                        );
                        return;
                    }
                    console.error(error);
                })
                .finally(() => {
                    this.acceptInProcess = false;
                    bus.emit('request-status-changed');
                });
        },

        reject() {
            if (this.$redirectToIdentityValidationIfRequired()) return;
            if (this.$redirectToMyTripsIfPendingRatingsRequired()) return;
            if (this.acceptRequestValue) {
                let data = {
                    property: 'do_not_alert_accept_passenger',
                    value: 1
                };
                this.changeProperty(data).then(() => {
                    console.log('do not alert success');
                });
            }

            let user = this.user;
            let trip = this.trip;
            this.rejectInProcess = true;
            this.passengerReject({ user, trip })
                .catch((error) => {
                    if (this.$checkError(error, 'identity_validation_required')) {
                        this.$router.push({ name: 'identity_validation' });
                        dialogs.message(this.$t('debesValidarIdentidadParaAccion'), {
                            estado: 'error'
                        });
                    } else {
                        console.error(error);
                    }
                })
                .finally(() => {
                    this.rejectInProcess = false;
                    bus.emit('request-status-changed');
                });
        },

        chat() {
            let user = this.user;

            this.lookConversation(user).then((conversation) => {
                router.push({
                    name: 'conversation-chat',
                    params: { id: conversation.id }
                });
            });
        },
        onModalToChat() {
            this.showModalRequestSeat = false;

            if (this.acceptRequestValue) {
                let data = {
                    property: 'do_not_alert_accept_passenger',
                    value: 1
                };
                this.changeProperty(data).then(() => {
                    console.log('do not alert success');
                });
            }
            this.chat();
        },

        onModalClose() {
            this.showModalRequestSeat = false;

            if (this.acceptRequestValue) {
                let data = {
                    property: 'do_not_alert_accept_passenger',
                    value: 1
                };
                this.changeProperty(data).then(() => {
                    console.log('do not alert success');
                });
            }
        }
    },

    components: {
        modal,
        spinner,
        AppButton
    },

    props: ['user', 'trip']
};
</script>

<style scoped>
.pending-request-card {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    box-sizing: border-box;
    width: fit-content;
    max-width: 100%;
    background: var(--ds-card-bg);
    border-radius: var(--ds-card-radius);
    box-shadow: var(--ds-card-shadow);
    margin: 0 0 1rem;
    padding: 1.2em;
    position: relative;
}

.pending-request-card__photo {
    flex-shrink: 0;
    width: auto;
}

.pending-request-card__avatar {
    width: 5em;
    height: 5em;
}

.pending-request-card__message {
    flex: 0 1 auto;
    min-width: 0;
    width: auto;
}

.pending-request-card__content {
    margin-left: 0;
}

.pending-request-card__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6em;
    margin-top: 0.8em;
}

.pending-request-card__message-action {
    margin-top: 0.8em;
}

.pending-request-card__modal-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6em;
    justify-content: center;
}

@media only screen and (max-width: 767px) {
    .pending-request-card__avatar {
        width: 3.5em;
        height: 3.5em;
    }

    .pending-request-card__actions {
        flex-direction: column;
    }

    .pending-request-card__actions :deep(.app-button) {
        width: 100%;
    }
}
</style>
