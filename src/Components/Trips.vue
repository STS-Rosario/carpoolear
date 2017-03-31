<template>
  <div class="trips">
    <h2>Viajes</h2>
    <template v-if="trips != null">
        <template v-if="trips.length > 0">
            <ul id="trips-list">
                <li v-for="trip in trips">
                    {{ trip.from_town }}
                    {{ trip.to_town }}
                    {{ trip.description }}
                </li>
            </ul>
        </template>
        <template v-else>
            No hay viajes
        </template>
    </template>
    <template v-else>
        Cargando viajes ...
    </template>
</template>
<script> 
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
                var valor = JSON.stringify(response.body.trips);
                console.log('test',valor)
                this.trips = response.body.trips;
            }, (response) => {
                // error callback
            });
    }
}
</script>