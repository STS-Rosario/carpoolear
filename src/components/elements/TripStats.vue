<template>
    <div class="row trip-stats" v-if="!trip.is_passenger && !isPassengersView">
        <div>
            <i class="fa fa-link" aria-hidden="true" v-if="tripCardTheme === 'light'"></i>
            <span v-if="tripCardTheme !== 'light' || !isMobile">Distancia a recorrer</span><br v-if="tripCardTheme !== 'light'">
            <span>{{ distanceString }} <abbr title="kilometros">km</abbr></span>
        </div>
        <div>
            <i class="fa fa-clock-o" aria-hidden="true" v-if="tripCardTheme === 'light'"></i>
            <span v-if="tripCardTheme !== 'light' || !isMobile">Tiempo estimado de viaje</span><br v-if="tripCardTheme !== 'light'">
            <span>{{ trip.estimated_time }} horas</span>
        </div>
        <div>
            <i class="fa fa-leaf" aria-hidden="true" v-if="tripCardTheme === 'light'"></i>
            <span v-if="tripCardTheme !== 'light' || !isMobile">Huella de carbono (<abbr title="aproximada">aprox</abbr>)</span><br v-if="tripCardTheme !== 'light'">
            <span>{{ (trip.distance / 1000 * 1.5).toFixed(2) }} <abbr title="kilogramos dióxido de carbono equivalente">kg CO<sub>2eq</sub></abbr></span>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import SvgItem from '../SvgItem';
export default {
    name: 'TripDate',
    computed: {
        ...mapGetters({
            trip: 'trips/currentTrip',
            tripCardTheme: 'auth/tripCardTheme',
            isMobile: 'device/isMobile'
        }),
        distanceString () {
            return Math.floor(this.trip.distance / 1000);
        },
        isPassengersView () {
            return this.trip.is_passenger;
        }
    },
    components: {
        SvgItem
    },
    methods: {
    }
};
</script>
<style scoped>
</style>