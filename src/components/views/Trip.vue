<template>  
    <div>
        <template v-if="trip"> 
            <div class="trip-detail-component">
                <div class="row">
                    <div class="col-xs-8">
                        <div class="driver-profile">
                            <div class="row">
                                <div class="col-xs-12">
                                    <img alt="" :src="trip.user.image | profile-image" class="trip_driver_img circle-box" />
                                </div>
                                <div class="col-xs-12">
                                    <div>{{trip.user.name}}</div>
                                    <div>{{trip.user.positive_ratings}} {{trip.user.negative_ratings}}</div>
                                </div>
                            </div>
                            <div class="row">
                                <router-link :to="{name: 'trips'}"> Ver Perfil </router-link>
                            </div>
                            <div class="row">
                                {{trip.user.descripcion}}
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-8">
                        <div class="trip_location">
                            <template v-if="trip.points.length >= 2">
                            <div class="row trip_location_from">
                                <div class="col-xs-4 text-right">
                                <i class="fa fa-map-marker" aria-hidden="true"></i>
                                </div>
                                <div class="col-xs-20">
                                <span class="trip_location_from_city">{{ trip.points[0].json_address.ciudad }}</span>
                                <span class="trip_location_from_state-country">{{ trip.points[0].json_address.provincia }}, {{ trip.points[0].json_address.pais }}</span>
                                </div>
                            </div>
                            <div class="row trip_location_to">
                                <div class="col-xs-4 text-right">
                                <i class="fa fa-map-marker" aria-hidden="true"></i>
                                </div>
                                <div class="col-xs-20">
                                <span class="trip_location_from_city">{{ trip.points[trip.points.length - 1].json_address.ciudad }}</span>
                                <span class="trip_location_from_state-country">{{ trip.points[trip.points.length - 1].json_address.provincia }}, {{ trip.points[trip.points.length - 1].json_address.pais }}</span>
                                </div>
                            </div>
                            </template>
                            <template v-else>
                                <div class="row trip_location_from">
                                <div class="col-xs-4 text-right">
                                    <i class="fa fa-map-marker" aria-hidden="true"></i>
                                </div>
                                <div  class="col-xs-20">
                                    {{ trip.from_town }}
                                </div>
                            </div>
                            <div class="row trip_location_to">
                                <div class="col-xs-4 text-right">
                                <i class="fa fa-map-marker" aria-hidden="true"></i>
                                </div>
                                <div class="col-xs-20">
                                {{ trip.to_town }}
                                </div>
                            </div>
                            </template>
                        </div>
                        <div class="row">
                            <time class="trip_datetime col-xs-offset-4 col-xs-20" :datetime="trip.trip_date">
                                <span class="trip_datetime_date">{{ [ trip.trip_date ] | moment("DD MMMM YYYY") }}</span>
                                -
                                <span class="trip_datetime_time">{{ [ trip.trip_date ] | moment("h:mm a") }}</span>
                            </time>
                        </div>
                        <div class="row">
                            <div class="trip_seats-available col-xs-offset-2 col-xs-12">
                                <span class="trip_seats-available_value pull-left">{{ trip.seats_available }}</span>
                                <span class="trip_seats-available_label">Lugares<br />libres</span>
                            </div> 
                        </div>
                    </div>
                    <div class="col-xs-8">
                    </div>
                </div>
            </div>
            <router-link v-if="user.id == trip.user.id" :to="{name: 'update-trip', params: { id: trip.id}}"> Editar  </router-link>

            <button class="btn btn-primary" @click="verMensajes"> Coordinar viaje  </button1>
        </template>
        <template v-else>
            <div>
                Buscando el viaje, aguarde un segundo.
            </div>
        </template>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    name: 'trip',
    data () {
        return {
            trip: null
        };
    },

    methods: {
        ...mapActions({
            getTrip: 'getTrip'
        }),

        loadTrip () {
            console.log(this.id);
            this.getTrip(this.id).then(trip => {
                console.log(trip);
                this.trip = trip;
            }).catch(error => {
                if (error) {
                    // Ver que hacer
                    this.trip = null;
                }
            });
        },

        verMensajes () {
            
        }
    },

    mounted () {
        this.loadTrip();
    },

    watch: {
        'id': function (value) {
            console.log('watiching');
            this.loadTrip();
        }
    },

    computed: {
        ...mapGetters({
            user: 'auth/user'
        })
    },

    components: {

    },

    props: [
        'id'
    ]
};
</script>