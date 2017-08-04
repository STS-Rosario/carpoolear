<template>
    <div class="rate-pending_component row">
        <div class="col-xs-8 col-sm-4 col-md-3 rate-pending_photo">
            <router-link :to="{name: 'profile', params: {id: to.id, userProfile: to}}">
                <div class="trip_driver_img circle-box" v-imgSrc:profile="to.image">
                </div>
            </router-link>
        </div>
        <div class="col-xs-16 col-sm-offset-4 col-sm-20 col-md-21 col-md-offset-3">
            <div class="rate-pending_message">
                ¿Cómo calificarías a <strong>{{ to.name }}</strong> como 
                <span v-if="rate.user_to_type === DRIVER"> conductor </span>
                <span v-if="rate.user_to_type === PASSENGER"> pasajero </span>
                en el viaje hacía <strong>{{ trip.points[trip.points.length - 1].json_address.ciudad }}</strong> el día <strong>{{ trip.trip_date | moment('dddd DD [de] MMMM') }}</strong> ?
            </div>
        </div>
        <div class="col-xs-24 col-sm-offset-4 col-sm-20  col-md-21 col-md-offset-3">
            <div class='rate-buttons'>
                <button class="btn rate-positive" @click="setRate(1)" :class="{active: vote === 1}">
                    <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
                </button>
                <button class="btn rate-negative" @click="setRate(0)" :class="{active: vote === 0}">
                    <i class="fa fa-thumbs-o-down" aria-hidden="true"></i>
                </button>
            </div>
            <div class="rate--comment-box" v-show="expanded">
                <textarea class="rate_comment" v-model="comment" placeholder="Incluye un comentario..."></textarea>
                <button class="btn btn-primary" @click="makeVote" :disabled="sending"> Calificar </button>
            </div>
        </div>
    </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex';

export default {
    name: 'rate-pending',

    data () {
        return {
            ACCEPTED: 1,
            CANCELED: 3,
            DRIVER: 0,
            PASSENGER: 1,
            vote: null,
            expanded: false,
            comment: '',
            sending: false
        };
    },

    methods: {
        ...mapActions({
            emit: 'rates/vote'
        }),

        setRate (value) {
            this.vote = value;
            this.expanded = true;
        },

        makeVote () {
            this.sending = true;
            let data = {
                id: this.rate.id,
                trip_id: this.trip.id,
                user_id: this.to.id,
                comment: this.comment,
                rating: this.vote
            };
            this.emit(data).then(() => {
                this.sending = false;
            }).catch(() => {
                this.sending = false;
            });
        }
    },

    computed: {
        ...mapGetters({
            user: 'auth/user'
        }),

        to () {
            return this.rate.to;
        },

        trip () {
            return this.rate.trip;
        }
    },

    props: [
        'rate'
    ]
};
</script>