<template>
    <div class="rate-pending_component">
        ¿Cómo calificarías a {{ to.name }} como 
            <span v-if="rate.user_to_type === DRIVER"> conductor </span>
            <span v-if="rate.user_to_type === PASSENGER"> pasajero </span>
            en el viaje hacía {{ trip.to_town }} el día {{ trip.trip_date | moment('dddd, DD de MMMM') }} ?
        <button class="btn rate-positive" @click="setRate(1)" :class="{active: vote === 1}">
            <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
        </button>
        <button class="btn rate-negative" @click="setRate(0)" :class="{active: vote === 0}">
            <i class="fa fa-thumbs-o-down" aria-hidden="true"></i>
        </button>
        <div v-show="expanded">
            <textarea class="rate_comment" v-model="comment" placeholder="Incluye un comentario..."></textarea>
            <button class="btn btn-primary" @click="makeVote" :disabled="sending"> Calificar </button>
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