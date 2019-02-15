<template>
    <div class="col-xs-24 col-md-16 col-lg-12">
        <div class="rate-pending_component clearfix">
            <div class="rate-pending_photo">
                <router-link :to="{name: 'profile', params: { id: user.id, userProfile: user, activeTab: 1}}">
                    <div class="trip_driver_img circle-box" v-imgSrc:profile="user.image">
                    </div>
                </router-link>
            </div>
            <modal :name="'modal'" v-if="showModalRequestSeat" @close="onModalClose" :title="'Test'" :body="'Body'">
                <h3 slot="header">
                    <span>¡Carpoodatos!</span>
                </h3>
                <div slot="body">
                    <div class="text-left">
                      <p>Antes de aceptar solicitud de asiento, mandale mensaje a la otra persona para coordinar todo lo vinculado al viaje: punto de encuentro, punto de llegada, tamaño de bolsos, contribución para combustible y peajes, etc.</p>
                      <p>Si aceptás una solicitud de asiento, se genera el compromiso de viajar entre vos y la otra persona, habilitándose la posibilidad de calificación 24hs después de comenzado el viaje. Tendrán 14 días para calificarse.</p>
                      <p>Se podrán calificar aunque canceles el viaje o bajes a / se baje la otra persona.</p>
                      <p>No ofrezcas un viaje si no tenés seguridad de que vas a viajar. Si ocurriera algo que te obligue a cancelarlo, avisale lo más rápido que puedas a las personas que iban a viajar.</p>
                      <p>Cualquier duda escribinos a <a href="mailto:carpoolear@stsrosario.org.ar">carpoolear@stsrosario.org.ar</a> o nuestras redes sociales.</p>
                    </div>
                    <div class="check" style="margin-bottom:10px;">
                        <label class="check-inline">
                            <input type="checkbox" name="acceptRequestValor" value="0" v-model="acceptRequestValue"><span> No volver a mostrar mensaje</span>
                        </label>
                    </div>
                    <div class="text-center">
                      <button class="btn btn-accept-request" :disabled="acceptInProcess" @click="toAcceptRequest"> Aceptar </button>
                      <button class="btn btn-primary" :disabled="rejectInProcess" @click="reject"> Rechazar </button>
                    </div>
                </div>
            </modal>
            <div class="rate-pending-message">
                <div class="rate-pending-message--content">
                    <strong>{{user.name}}</strong> quiere subirse al viaje hacia <strong>{{trip.points[trip.points.length - 1].json_address.ciudad}}</strong> del día {{ trip.trip_date | moment("DD/MM/YYYY") }} a las  {{ trip.trip_date | moment("HH:mm") }}.
                    <div class='pending-buttons'>
                        <button class="btn btn-accept-request" :disabled="acceptInProcess" @click="onAcceptRequest"> Aceptar </button>
                        <button class="btn btn-primary" :disabled="rejectInProcess" @click="reject"> Rechazar </button>
                    </div>
                    <div class="message-button">
                        <button class="btn btn-secondary"  @click="chat"> Enviar Mensaje </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapActions} from 'vuex';
import router from '../router';
import modal from './Modal';
import dialogs from '../services/dialogs.js';
export default {
    data () {
        return {
            acceptInProcess: false,
            rejectInProcess: false,
            showModalRequestSeat: false,
            acceptRequestValue: 0
        };
    },

    methods: {
        ...mapActions({
            passengerAccept: 'passenger/accept',
            passengerReject: 'passenger/reject',
            lookConversation: 'conversations/createConversation',
            changeProperty: 'profile/changeProperty'
        }),

        onAcceptRequest () {
            console.log(this.user.do_not_alert_accept_passenger);
            if (this.user.do_not_alert_accept_passenger) {
                this.toAcceptRequest();
            } else {
                this.showModalRequestSeat = true;
            }
        },

        toAcceptRequest () {
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
            this.passengerAccept({user, trip}).then(() => {
                this.acceptInProcess = false;
            }).catch((resp) => {
                this.acceptInProcess = false;
                if (resp.status === 422) {
                    if (resp.data && resp.data.errors && resp.data.errors.error && resp.data.errors.error.length) {
                        for (let i = 0; i < resp.data.errors.error.length; i++) {
                            let error = resp.data.errors.error[i];
                            if (error === 'not_seat_available') {
                                dialogs.message('No puedes aceptar esta solicitud, todos los asientos del viaje están ocupados.', { duration: 10, estado: 'error' });
                            }
                        }
                    }
                }
            });
        },

        reject () {
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
            this.passengerReject({user, trip}).then(() => {
                this.rejectInProcess = false;
            }).catch((resp) => {
                this.rejectInProcess = false;
            });
        },

        chat () {
            let user = this.user;

            this.lookConversation(user).then(conversation => {
                router.push({ name: 'conversation-chat', params: { id: conversation.id } });
            });
        },

        onModalClose () {
            this.showModalRequestSeat = false;
        }
    },

    components: {
        modal
    },

    props: [
        'user',
        'trip'
    ]
};
</script>
