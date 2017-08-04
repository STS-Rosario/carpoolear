<template>  
    <div class="col-xs-24 col-md-12 col-lg-8">
        <div class="rate-pending_component clearfix">
            <div class="rate-pending_photo">
                <router-link :to="{name: 'profile', params: {id: user.id, userProfile: user}}">
                    <div class="trip_driver_img circle-box" v-imgSrc:profile="user.image">
                    </div>
                </router-link>
            </div>
            <div class="rate-pending-message">
                <div class="rate-pending-message--content">
                    <strong>{{user.name}}</strong> quiere subirse al viaje hacia <strong>{{trip.points[trip.points.length - 1].json_address.ciudad}}</strong>.
                    <div class='pending-buttons'>
                        <button class="btn btn-accept-request" :disabled="acceptInProcess" @click="accept"> Aceptar </button>
                        <button class="btn btn-primary" :disabled="rejectInProcess" @click="reject"> Rechazar </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapActions} from 'vuex';

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
            passengerReject: 'passenger/reject'
        }),

        accept () {
            let user = this.user;
            let trip = this.trip;
            this.acceptInProcess = true;
            this.passengerAccept({user, trip}).then(() => {
                this.acceptInProcess = false;
            }).catch(() => {
                this.acceptInProcess = false;
            });
        },

        reject () {
            let user = this.user;
            let trip = this.trip;
            this.rejectInProcess = true;
            this.passengerReject({user, trip}).then(() => {
                this.rejectInProcess = false;
            }).catch(() => {
                this.rejectInProcess = false;
            });
        }
    },

    props: [
        'user',
        'trip'
    ]
};
</script>