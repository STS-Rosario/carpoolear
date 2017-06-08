<template>  
    <div>
        {{user.name}} quiere subirse al viaje hacia {{trip.to_town}}.
        <button class="btn btn-primary" :disabled="acceptInProcess" @click="accept"> Aceptar </button>
        <button class="btn btn-error" :disabled="rejectInProcess" @click="reject"> Cancelar </button>
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