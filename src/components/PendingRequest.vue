<template>
    <div class="col-xs-24 col-md-16 col-lg-12">
        <div class="rate-pending_component clearfix">
            <div class="rate-pending_photo">
                <router-link :to="{name: 'profile', params: { id: user.id, userProfile: user, activeTab: 1}}">
                    <div class="trip_driver_img circle-box" v-imgSrc:profile="user.image">
                    </div>
                </router-link>
            </div>
            <div class="rate-pending-message">
                <div class="rate-pending-message--content">
                    <strong>{{user.name}}</strong> quiere subirse al viaje hacia <strong>{{trip.points[trip.points.length - 1].json_address.ciudad}}</strong> del día {{ trip.trip_date | moment("DD/MM/YYYY") }} a las  {{ trip.trip_date | moment("HH:mm") }}.
                    <div class='pending-buttons'>
                        <button class="btn btn-accept-request" :disabled="acceptInProcess" @click="accept"> Aceptar </button>
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
import dialogs from '../services/dialogs.js';
export default {
    data () {
        return {
            acceptInProcess: false,
            rejectInProcess: false
        };
    },

    methods: {
        ...mapActions({
            passengerAccept: 'passenger/accept',
            passengerReject: 'passenger/reject',
            lookConversation: 'conversations/createConversation'
        }),

        accept () {
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
        }
    },

    props: [
        'user',
        'trip'
    ]
};
</script>
