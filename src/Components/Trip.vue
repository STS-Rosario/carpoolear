<template>
  <div class="trips">
    <h2>Viajes</h2>
    <template v-if="trip != null">
        <div>
            {{ trip.from_town }}
            {{ trip.to_town }}
            {{ trip.description }}
        </div>
    </template>
    <template v-else>
        Cargando viaje ...
    </template>
</template>
<script> 
export default {
  name: 'trip',
  data () {
    return {
      trip: null
    }
  },
  mounted() {
        
        console.log("ready function on trips", this.$root.$route.params.id);
        //Esto debería venir del ache
        this.$root.$http.get('http://carpoolear.138.197.64.208.nip.io/api/trips').then((response) => {
            var valor = JSON.stringify(response.body.trips);
            console.log('test', valor);
            var vm = this;
            
            if(response.body.trips) {
                response.body.trips.forEach(function (trip){
                    console.log("trip", trip);
                    if(trip.id == vm.$root.$route.params.id) {
                        vm.trip = trip;
                    }
                });
            }
        }, (response) => {
            // error callback
        });
    }
}
</script>