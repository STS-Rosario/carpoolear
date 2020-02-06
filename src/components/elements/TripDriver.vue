<template>
    <div class="trip-driver">
        <div class="panel-heading card_heading" v-if="tripCardTheme === 'light'">
            <div class="panel-title card-trip_title row">
                <span class="trip-data--subtitle" v-if="!isMobile">Conductor</span>
                <TripDate v-if="isMobile" />
                <template v-if="trip && trip.user">
                    <div class="trip_driver_img_container" @click="goToProfile()">
                        <div class="trip_driver_img circle-box" v-imgSrc:profile="getUserImage">
                        </div>
                    </div>
                    <div class="trip_driver_details">
                        <a class="btn-link trip_driver_name" @click="goToProfile()">
                            {{ trip.user.name }}
                        </a>
                        <div class="trip_driver_ratings" v-if="config ? config.trip_stars : false && tripStars && tripStars.length > 0">
                            <div v-if="trip.user.positive_ratings || trip.user.positive_ratings">
                                <svg-item v-for="{value, id} in tripStars" :key="id" :size="24" :icon="'star' + value"></svg-item>
                            </div>
                            <div v-else>
                                {{ $t('noCalificado') }}
                            </div>
                        </div>
                        <div class="trip_driver_ratings" v-else>
                            {{ trip.user.positive_ratings + trip.user.negative_ratings }} {{ $t('calificaciones') }}
                        </div>
                    </div>
                </template>
            </div>
            <div class="alert alert-info clearfix cf" v-if="config.module_conversation_average_delay">
                Velocidad de respuesta: {{ averageDelay }}
            </div>
        </div>
        <div class="driver-profile" v-else>
            <div class="row">
                <div class="col-xs-9 col-md-8 col-lg-8">
                    <div class="trip_driver_img circle-box" v-imgSrc:profile="getUserImage"></div>
                </div>
                <div class="col-xs-15 driver-data">
                    <div>{{trip.user.name}}</div>
                    <div class="trip_driver_ratings" v-if="config ? config.trip_stars : false && tripStars && tripStars.length > 0">
                        <div v-if="this.trip.user.positive_ratings || this.trip.user.positive_ratings">
                            <svg-item v-for="{value, id} in tripStars" :key="id" :size="$cssvar('--calification-star-size')" :icon="'star' + value"></svg-item>
                        </div>
                        <div v-else>
                            {{ $t('noCalificado') }}
                        </div>
                    </div>
                    <div class="profile-info--ratings" v-else>
                        <svgItem icon="thumbUp" size="18"></svgItem> <span> {{trip.user.positive_ratings}} </span>
                        <svgItem icon="thumbDown" size="18"></svgItem> <span> {{trip.user.negative_ratings}} </span>
                    </div>
                    <div class="user_pin">
                        <span v-if="trip.user.has_pin == 1">
                            <img src="https://carpoolear.com.ar/static/img/pin.png" alt="" title="Aportante en la campaña mi media naranja carpoolera" />
                        </span>
                        <span v-if="trip.user.is_member == 1">
                            <img src="https://carpoolear.com.ar/static/img/pin_member.png" alt="" title="Miembro del equipo de Carpoolear" />
                        </span>
                    </div>
                </div>
            </div>
            <div class="alert alert-info clearfix cf" v-if="config.module_conversation_average_delay">
                Velocidad de respuesta: {{ averageDelay }}
            </div>
            <div class="row">
                <div class="col-md-24">
                    <router-link class="btn-primary btn-search btn-shadowed-black" :to="{name: 'profile', params: {id: getUserProfile, userProfile: trip.user}}"> Ver Perfil </router-link>
                </div>
            </div>
            <TripDescription />
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import TripDate from './TripDate';
import TripDescription from './TripDescription';
import SvgItem from '../SvgItem';

export default {
    name: 'TripDriver',
    computed: {
        ...mapGetters({
            user: 'auth/user',
            trip: 'trips/currentTrip',
            tripCardTheme: 'auth/tripCardTheme',
            config: 'auth/appConfig',
            isMobile: 'device/isMobile'
        }),
        getUserProfile () {
            return this.trip.user.id === this.user.id ? 'me' : this.trip.user.id;
        },
        getUserImage () {
            return this.user.id === this.trip.user.id ? this.user.image : this.trip.user.image;
        },
        tripStars () {
            if (this.trip && this.trip.user) {
                let value = this.trip.user.positive_ratings / (this.trip.user.positive_ratings + this.trip.user.negative_ratings) * 5;
                let integerPart = Math.floor(value);
                let decimalPart = value - integerPart;
                let stars = [];
                for (let i = 1; i <= 5; i++) {
                    if (i < integerPart) {
                        stars.push({
                            id: i,
                            value: ''
                        });
                    } else {
                        if (i === integerPart) {
                            if (decimalPart >= 0.5) {
                                stars.push({
                                    id: i,
                                    value: ''
                                });
                            } else {
                                stars.push({
                                    id: i,
                                    value: '-half'
                                });
                            }
                        } else {
                            stars.push({
                                id: i,
                                value: '-empty'
                            });
                        }
                    }
                }
                return stars;
            } else {
                return [];
            }
        },
        averageDelay () {
            var delay = '';
            if (this.trip && this.trip.user) {
                if (this.trip.user.conversation_opened_count) {
                    var time = this.trip.user.answer_delay_sum / this.trip.user.conversation_opened_count;
                    // var hours = Math.floor(time / 60 / 60);
                    // var minutes = Math.floor(time / 60) % 60;
                    // var seconds = Math.floor(time - minutes * 60 - hours * 3600);
                    // delay = hours + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
                    if (time / 3600 > 24) {
                        delay = 'Más de un día';
                    } else if (time / 3600 > 12) {
                        delay = 'En el día';
                    } else if (time / 3600 > 1) {
                        delay = 'En un par de horas';
                    } else {
                        delay = 'En el momento';
                    }
                } else {
                    delay = 'Sin datos';
                }
            }
            return delay;
        }
    },
    components: {
        SvgItem,
        TripDate,
        TripDescription
    },

    secondsToHms(d) {
        var time = Number(d);
        var hours = Math.floor(time / 60 / 60);
        var minutes = Math.floor(time / 60) % 60;
        var seconds = Math.floor(time - minutes * 60);
        hour + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
    }
};
</script>
<style scoped>
    .user_pin {
        margin-top: 1em;
    }
    .user_pin img {
        width: 40px;
    }
    .driver-profile div.row:last-child {
        height: auto;
    }
    .driver-data div:first-child {
        margin-top: .4em;
    }
    .trip-data--subtitle {
        font-size: .8em;
        font-weight: bold;
        display: block;
        color: black;
    }
    @media only screen and (min-width: 400px) and (max-width: 767px) {
        .trip_driver_img {
            width: 6.7rem;
            height: 6.7rem;
        }
    }
    @media only screen and (min-width: 768px) {
        .driver-profile div.row:last-child {
            min-height: 11rem;
        }
        .driver-data div:first-child {
            margin-top: 16px;
        }
    }
</style>
