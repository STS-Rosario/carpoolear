<template>
    <div v-if="trip">
        <Modal :clickOutside="clickOutside" :name="'tripModel_' + trip.id">
            <div slot="header" class="trip-display-title">
                Detalles del viaje
            </div>
            <div slot="body">
                <div class="row">   
                        <div class="row">
                            <div class="col-md-24"><span><h4>Itinerario:</h4> 
                                <div v-for="point in trip.points">{{ point.address }}</div>
                            </span></div>
                        </div>
                        <div class="row">
                            <div class="col-md-6" v-on:click="openProfile(trip.user.id)"><span><h4>Nombre:</h4> {{ trip.user.name }}</span></div>
                            <div class="col-md-6"><span><h4>Tipo:</h4> {{ trip.is_passenger ? 'pasajero' : 'conductor' }}</span></div>
                            <div class="col-md-6"><span><h4>Fecha:</h4> {{ trip.trip_date.slice(0,10) }}</span></div>
                            <div class="col-md-6"><span><h4>Hora:</h4> {{ trip.trip_date.slice(10,20) }}</span></div>
                        </div> 
                        <div class="row">
                            <div class="col-md-24"><span><h4>descripción:</h4> {{ trip.description }}</span></div>
                        </div>
                        <div class="row">
                            <div class="col-md-6"><span><h4>Asientos:</h4> {{ trip.total_seats }}</span></div>
                            <div class="col-md-6"><span><h4>Visibilidad:</h4> {{ visibilityParser(trip.friendship_type_id) }}</span></div>
                            <div class="col-md-6"><span><h4>Distancia:</h4> {{ Math.round(trip.distance / 1000) + 'km' }}</span></div>
                            <div class="col-md-6" v-if="trip.car"><span><h4>Auto:</h4> {{ trip.car.patente }}</span></div>
                        </div>      
                        <div class="row">
                            <div class="col-md-6"><span><h4>Solicitudes:</h4></span></div>
                        </div>                   
                        <div class="row">
                            <div class="col-md-6"><span><h5>Aceptadas:</h5> 
                                <div v-for="pas in trip.passenger" v-on:click="openProfile(pas.user.id)">{{ pas.request_state == 1 ? pas.user.name : '' }}</div>
                            </span></div>
                            <div class="col-md-6"><span><h5>Rechazadas:</h5> 
                                <div v-for="pas in trip.passenger" v-on:click="openProfile(pas.user.id)">{{ pas.request_state == 2 ? pas.user.name : '' }}</div>
                            </span></div>
                            <div class="col-md-6"><span><h5>Canceladas:</h5> 
                                <div v-for="pas in trip.passenger" v-on:click="openProfile(pas.user.id)">{{ pas.request_state == 3 ? pas.user.name : '' }}</div>
                            </span></div>
                            <div class="col-md-6"><span><h5>Pendientes:</h5> 
                                <div v-for="pas in trip.passenger" v-on:click="openProfile(pas.user.id)">{{ pas.request_state == 0 ? pas.user.name : '' }}</div>
                            </span></div>
                        </div>
                        <div class="row">
                            <div class="col-md-24"><span><h4>Calficacion:</h4> 
                                <div v-for="rating in trip.ratings">
                                    <span>
                                        <strong>{{ rating.from.name }}</strong> califico a <strong> {{ rating.to.name }}</strong> como {{ rating.rating ? 'positivo' : 'negativo'}} en {{ rating.rate_at ? rating.rate_at.slice(0, 10) : 'undefined' }} {{ rating.comment ? 'con el comentario: ' + rating.comment : ''}}
                                    </span>
                                    <br>
                                </div>
                            </span></div>
                        </div>
                </div>
            </div>
            <div slot="footer">
            </div>
        </Modal>
    </div>
</template>

<script>
import Modal from '../Modal';
import router from '../../router';

// FIXME: Rate_at undefined

export default {
    name: 'trip-display',
    mounted () {
    },
    props: {
        trip: {
            required: true
        },
        clickOutside: {
            required: false
        }
    },
    methods: {
        openProfile (id) {
            router.replace({ name: 'profile', params: { id: id } });
        },
        visibilityParser (id) {
            switch (id) {
            case 0:
                return 'Amigos';
            case 1:
                return 'Amigos de amigos';
            case 2:
                return 'Publico';
            default:
                return 'Indefinido';
            }
        }
    },
    components: {
        Modal
    }
};
</script>

<style>
.trip-display-title {
    font-size: 2em;
}

</style>