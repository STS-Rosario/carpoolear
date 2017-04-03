<template>
  <div class="trips">
    <h2>Viajes</h2>
    <template v-if="trips != null">
        <template v-if="trips.length > 0">
            <ul id="trips-list">
                <Trip v-for="trip in trips" :trip="trip" >
                </Trip>
            </ul>
        </template>
        <template v-else>
            No hay viajes
        </template>
    </template>
    <template v-else>
        Cargando viajes ...
    </template>
    <pre>
            {{this.$store.state}}
    </pre>
    </div>    
</template>
<script> 
import Trip from "./Trip.vue"
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'trips',
  methods: {
    ...mapActions({
      getTrips: 'trips/search', 
    })
  },
  mounted() {

        console.log("ready function on trips", this.$root.$http);
        this.getTrips();

        // GET request
        /*window.network.get('/api/trips').then((response) => {
                let valor = JSON.stringify(response.body.trips);
                console.log('test',valor)
                this.trips = response.body.trips;
            }, (response) => {
                // error callback
            });*/
    },
    computed: {
        ...mapGetters({trips: 'trips/trips'})
    },
    components: {Trip}

}
</script>