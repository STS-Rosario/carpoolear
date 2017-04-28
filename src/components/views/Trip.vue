<template>  
    <div v-if="trip">
        Tengo un trip
        <router-link v-if="user.id == trip.user.id" :to="{name: 'update-trip', params: { id: trip.id}}"> Editar  </router-link>
    </div>
    <div v-else>
        Buscando un trip
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    name: 'trip',
    data () {
        return {
            trip: null
        };
    },

    methods: {
        ...mapActions({
            getTrip: 'getTrip'
        }),

        loadTrip () {
            this.getTrip(this.id).then(trip => {
                console.log(trip);
                this.trip = trip;
            }).catch(error => {
                if (error) {
                    // Ver que hacer
                    this.trip = null;
                }
            });
        }
    },

    mounted () {
        this.loadTrip();
    },

    beforeUpdate () {
        this.loadTrip();
    },

    computed: {
        ...mapGetters({
            user: 'auth/user'
        })
    },

    components: {

    },

    props: [
        'id'
    ]
};
</script>