<template>
  <div class="trips">
    <h2>Viajes</h2>
    <template v-if="data != null">
        <template v-if="data.trips.length > 0">
            <div id="trips-list">
                <Trip v-for="trip in data.trips" :trip="trip" :user="null" ></Trip>
            </div>
        </template>
        <template v-else>
            <p class="alert alert-warning"  role="alert">No hay viajes</p>
            
        </template>
    </template>
    <template v-else>
        <p class="alert alert-info" role="alert">Cargando viajes ...</p>
        
    </template> 
    </div>    
</template>
<script> 
import Trip from "../Trip.vue"
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'trips',
  methods: {
    ...mapActions({
      search: 'trips/search', 
    })
  },
  mounted() { 
        this.search();
    },
    computed: {
        ...mapGetters({
            data: 'trips/trips',
        })
    },
    components: {
        Trip,
    }

}
</script>