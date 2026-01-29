<template>
    <div v-if="trip">
        <Modal :clickOutside="clickOutside" :name="'tripModel_' + trip.id">
            <div slot="header" class="trip-display-title">
                {{ $t('detallesDelViaje') }}
            </div>
            <div slot="body">
                <div class="row">
                    <div class="row">
                        <div class="col-md-24">
                            <span>
                                <h4>{{ $t('itinerario') }}:</h4>
                                <div v-for="point in trip.points">
                                    {{ point.address }}
                                </div>
                            </span>
                        </div>
                    </div>
                    <div class="row">
                        <div
                            class="col-md-6"
                            v-on:click="openProfile(trip.user.id)"
                        >
                            <span>
                                <h4>{{ $t('nombre') }}:</h4>
                                <UserNameWithBadge :user="trip.user" />
                            </span>
                        </div>
                        <div class="col-md-6">
                            <span>
                                <h4>{{ $t('tipo') }}:</h4>
                                {{
                                    trip.is_passenger ? $t('pasajero') : $t('conductor')
                                }}
                            </span>
                        </div>
                        <div class="col-md-6">
                            <span>
                                <h4>{{ $t('fecha') }}:</h4>
                                {{ trip.trip_date.slice(0, 10) }}
                            </span>
                        </div>
                        <div class="col-md-6">
                            <span>
                                <h4>{{ $t('hora') }}:</h4>
                                {{ trip.trip_date.slice(10, 20) }}
                            </span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-24">
                            <span>
                                <h4>{{ $t('descripcion') }}:</h4>
                                {{ trip.description }}
                            </span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-24">
                            <h4>
                                {{ $t('estado') }}:
                                {{
                                    trip.hidden
                                        ? $t('oculto')
                                        : trip.deleted
                                        ? $t('borrado')
                                        : $t('activo')
                                }}
                            </h4>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <span>
                                <h4>{{ $t('asientos') }}:</h4>
                                {{ trip.total_seats }}
                            </span>
                        </div>
                        <div class="col-md-6">
                            <span>
                                <h4>{{ $t('visibilidad') }}:</h4>
                                {{ visibilityParser(trip.friendship_type_id) }}
                            </span>
                        </div>
                        <div class="col-md-6">
                            <span>
                                <h4>{{ $t('distancia') }}:</h4>
                                {{ Math.round(trip.distance / 1000) + $t('km') }}
                            </span>
                        </div>
                        <div class="col-md-6" v-if="trip.car">
                            <span>
                                <h4>{{ $t('auto') }}:</h4>
                                {{ trip.car.patente }}
                            </span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <span><h4>{{ $t('solicitudes') }}:</h4></span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <span>
                                <h5>{{ $t('aceptadas') }}:</h5>
                                <div
                                    v-for="pas in trip.allPassengerRequest"
                                    v-on:click="openProfile(pas.user.id)"
                                >
                                    <UserNameWithBadge v-if="pas.request_state == 1" :user="pas.user" />
                                </div>
                            </span>
                        </div>
                        <div class="col-md-6">
                            <span>
                                <h5>{{ $t('rechazadas') }}:</h5>
                                <div
                                    v-for="pas in trip.allPassengerRequest"
                                    v-on:click="openProfile(pas.user.id)"
                                >
                                    <UserNameWithBadge v-if="pas.request_state == 2" :user="pas.user" />
                                </div>
                            </span>
                        </div>
                        <div class="col-md-6">
                            <span>
                                <h5>{{ $t('canceladas') }}:</h5>
                                <div
                                    v-for="pas in trip.allPassengerRequest"
                                    v-on:click="openProfile(pas.user.id)"
                                >
                                    <UserNameWithBadge v-if="pas.request_state == 3" :user="pas.user" />
                                </div>
                            </span>
                        </div>
                        <div class="col-md-6">
                            <span>
                                <h5>{{ $t('pendientes') }}:</h5>
                                <div
                                    v-for="pas in trip.allPassengerRequest"
                                    v-on:click="openProfile(pas.user.id)"
                                >
                                    <UserNameWithBadge v-if="pas.request_state == 0" :user="pas.user" />
                                </div>
                            </span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-24">
                            <span v-if="Array.isArray(trip.ratings)">
                                <h4>{{ $t('calificacion') }}:</h4>
                                <div
                                    v-for="rating in trip.ratings.filter(
                                        (r) => r.voted > 0
                                    )"
                                >
                                    <span>
                                        <strong><UserNameWithBadge :user="rating.from" /></strong>
                                        {{ $t('calificadoA') }}
                                        <strong><UserNameWithBadge :user="rating.to" /></strong>
                                        {{ $t('como') }}
                                        {{
                                            rating.rating
                                                ? $t('positivo')
                                                : $t('negativo')
                                        }}
                                        {{ $t('en') }}
                                        {{
                                            rating.rate_at
                                                ? rating.rate_at.slice(0, 10)
                                                : $t('indefinido')
                                        }}
                                        {{
                                            rating.comment
                                                ? $t('conElComentario') + ': ' +
                                                  rating.comment
                                                : ''
                                        }}
                                    </span>
                                    <br />
                                </div>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
import Modal from '../Modal';
import UserNameWithBadge from '../elements/UserNameWithBadge.vue';
import router from '../../router';

// FIXME: Rate_at undefined

export default {
    name: 'trip-display',
    mounted() {},
    props: {
        trip: {
            required: true
        },
        clickOutside: {
            required: false
        }
    },
    methods: {
        openProfile(id) {
            router.push({ name: 'profile', params: { id: id } });
        },
        visibilityParser(id) {
            switch (id) {
                case 0:
                    return this.$t('amigos');
                case 1:
                    return this.$t('amigosDeAmigos');
                case 2:
                    return this.$t('publico');
                default:
                    return this.$t('indefinido');
            }
        }
    },
    components: {
        Modal,
        UserNameWithBadge
    }
};
</script>

<style>
.trip-display-title {
    font-size: 2em;
}
</style>
