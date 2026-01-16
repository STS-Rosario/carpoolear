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
                <h3 slot="header">
                    <span>{{ $t('pendingRequestCarpoodatos') }}</span>
                    <i
                        v-on:click="onModalClose"
                        class="fa fa-times float-right-close"
                    ></i>
                </h3>
                <div slot="body">
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
                </div>
            </modal>
            <div class="rate-pending-message">
                <div class="rate-pending-message--content">
                    <strong>{{ user.name }}</strong>
                    {{ $t('pendingRequestQuiereSubirseAlViaje') }}
                    <strong>{{
                        trip.points[trip.points.length - 1].json_address.ciudad
                    }}</strong>
                    {{ $t('pendingRequestDelDia') }} {{ trip.trip_date | moment('DD/MM/YYYY') }} {{ $t('pendingRequestALas') }} las
                    {{ trip.trip_date | moment('HH:mm') }}.
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
<script>
import { mapActions, mapGetters } from 'vuex';
import router from '../router';
import modal from './Modal';
import dialogs from '../services/dialogs.js';
import spinner from './Spinner.vue';
import bus from '../services/bus-event.js';

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
        ...mapGetters({
            currentUser: 'auth/user',
            config: 'auth/appConfig'
        })
    },
    methods: {
        ...mapActions({
            passengerAccept: 'passenger/accept',
            passengerReject: 'passenger/reject',
            lookConversation: 'conversations/createConversation',
            changeProperty: 'profile/changeProperty'
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
                    console.error(error);
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
        spinner
    },

    props: ['user', 'trip']
};
</script>
