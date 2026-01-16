<template>
    <div class="trip-data--container">
        <div class="row trip-data" v-if="trip.is_passenger">
            <strong class="warning-is-passenger"
                >{{ $t('pasajeroQueBuscaViaje') }}</strong
            >
        </div>
        <div class="row trip-data">
            <span class="trip-data--subtitle" v-if="tripCardTheme === 'light'">
                {{ $t('privacidadViaje') }}
            </span>
            <em v-if="trip.friendship_type_id == 2">
                <i class="fa fa-globe" aria-hidden="true"></i>
                {{ $t('publico') }}
            </em>
            <em v-if="trip.friendship_type_id == 1">
                <i class="fa fa-users" aria-hidden="true"></i>
                {{ $t('amigosamigos') }}
            </em>
            <em v-if="trip.friendship_type_id == 0">
                <i class="fa fa-user" aria-hidden="true"></i>
                {{ $t('soloAmigos') }}
            </em>
            <span class="trip-data--subtitle" v-if="tripCardTheme === 'light'">
                {{ $t('preferenciasViaje') }}
            </span>
            <template v-if="!isPassengersView">
                <em v-if="trip.allow_smoking > 0">
                    <svgItem icon="smoking" size="18"></svgItem>
                    {{ $t('sePuedeFumar') }}
                </em>
                <em v-else>
                    <svgItem icon="no-smoking" size="18"></svgItem>
                    {{ $t('nofumar') }}
                </em>

                <em v-if="trip.allow_animals > 0">
                    <svgItem icon="pets" size="18"></svgItem>
                    {{ $t('aceptaMascotas') }}
                </em>
                <em v-else>
                    <svgItem icon="no-animals" size="18"></svgItem>
                    {{ $t('noanimales') }}
                </em>

                <em v-if="trip.allow_kids > 0">
                    <svgItem icon="kids" size="18"></svgItem>
                    {{ $t('aceptaNinos') }}
                </em>
                <em v-else>
                    <svgItem icon="no-kids" size="18"></svgItem>
                    {{ $t('noninos') }}
                </em>
            </template>
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
        isPassengersView() {
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
    display: block;
    width: 50%;
    padding-top: 6px;
    float: left;
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
