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
    </div>    
</template>
<script> 
import Trip from "./Trip.vue"

export default {
  name: 'trips',
  data () {
    return {
      trips: null
    }
  },
  mounted() {
        
        console.log("ready function on trips", this.$root.$http);
        // GET request
        this.$root.$http.get('http://carpoolear.138.197.64.208.nip.io/api/trips').then((response) => {
                var trips = [];
                if(response.body.trips) {
                    tripps = response.body.trips;
                }
                this.trips = trips;
            }, (response) => {
                // error callback
            });
    },
    components: {Trip}

}
</script>