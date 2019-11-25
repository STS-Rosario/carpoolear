<template>
    <div class="trip-data--container">
        <div class="row trip-data" v-if="trip.is_passenger">
            <strong class="warning-is-passenger">Pasajero que busca viaje</strong>
        </div>
        <div class="row trip-data"  v-if="!isPassengersView">
            <span class="trip-data--subtitle" v-if="tripCardTheme === 'light'">Privacidad del viaje</span>
            <em v-if="trip.friendship_type_id == 2">
                <i class="fa fa-globe" aria-hidden="true"></i>
                Viaje público
            </em>
            <em v-if="trip.friendship_type_id == 1">
                <i class="fa fa-users" aria-hidden="true"></i>
                Amigos de amigos
            </em>
            <em v-if="trip.friendship_type_id == 0">
                <i class="fa fa-user" aria-hidden="true"></i>
                Sólo amigos
            </em>
            <span class="trip-data--subtitle" v-if="tripCardTheme === 'light'">Preferencias del viaje</span>
            <em v-if="trip.allow_smoking > 0">
                <svgItem icon="smoking" size="18"></svgItem>
                Se puede fumar
            </em>
            <em v-else>
                <svgItem icon="no-smoking" size="18"></svgItem>
                No fumar
            </em>

            <em v-if="trip.allow_pets > 0">
                <svgItem icon="pets" size="18"></svgItem>
                Mascotas
            </em>
            <em v-else>
                <svgItem icon="no-animals" size="18"></svgItem>
                No mascotas
            </em>

            <em v-if="trip.allow_kids > 0">
                <svgItem icon="kids" size="18"></svgItem>
                Niños
            </em>
            <em v-else>
                <svgItem icon="no-kids" size="18"></svgItem>
                No niños
            </em>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import SvgItem from '../SvgItem';
export default {
    name: 'TripData',
    computed: {
        ...mapGetters({
            trip: 'trips/currentTrip',
            tripCardTheme: 'auth/tripCardTheme'
        }),
        isPassengersView () {
            return this.trip.is_passenger;
        }
    },
    components: {
        SvgItem
    }
};
</script>
<style scoped>
    .trip-data em {
        display: inline-block;
        width: 49%;
        padding-top: 6px;
    }
    .trip-data em > * {
        vertical-align: middle;
    }
    .trip-data em .fa {
        padding-right: 6px;
    }
    .trip-data em .svgItem {
        height: 25px;
        display: inline-block;
        padding-right: 6px;
    }
    .trip-data--subtitle {
        font-weight: bold;
        display: block;
    }
</style>