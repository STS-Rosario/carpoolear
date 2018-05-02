<template>
    <div class="rate-pending_component" @click="search">
        
        <div class="rate-pending-message" v-if="subscription.trip_date">
            <div class="rate-pending-message--content">   
                Fecha aproximada: {{ subscription.trip_date | moment("DD/MM/YYYY") }}
            </div>
        </div>
        <div class="rate-pending-message" v-if="subscription.from_address">
            <div class="rate-pending-message--content">
                Desde: {{ subscription.from_address }}
            </div>
        </div>
        <div class="rate-pending-message" v-if="subscription.to_address">
            Hasta: {{ subscription.to_address }}
        </div>
        <button v-on:click.stop="remove" :disabled="inProgress" class="btn btn-default"  aria-label="Eliminar suscripción">
            <i class="fa fa-trash-o" aria-hidden="true"></i>
        </button>
        
    </div>
</template>
<script>
import { mapActions } from 'vuex';
export default {
    name: 'subscriptions-item',
    props: {
        'subscription': {
            type: Object,
            required: false,
            default: () => {
                return {};
            }
        },
        'user': {
            type: Object,
            required: false,
            default: () => {
                return {};
            }
        }
    },
    data () {
        return {
            inProgress: false
        };
    },
    methods: {
        ...mapActions({
            'removeStore': 'subscriptions/remove',
            searchTrip: 'trips/tripsSearch'
        }),
        remove () {
            this.inProgress = true;
            this.removeStore(this.subscription).then(() => {
                this.inProgress = false;
            }).catch(() => {
                this.inProgress = false;
            });
        },
        search () {
            let params = {};
            if (this.subscription.trip_date) {
                params.date = this.subscription.trip_date;
            }
            if (this.subscription.from_address) {
                params.origin_name = this.subscription.from_address;
                params.origin_lat = this.subscription.from_lat;
                params.origin_lng = this.subscription.from_lng;
                params.origin_radio = this.subscription.from_radio;
                // this.subscription.from_json_address = [];
            }
            if (this.subscription.to_address) {
                params.destination_name = this.subscription.to_address;
                params.destination_lat = this.subscription.to_lat;
                params.destination_lng = this.subscription.to_lng;
                params.destination_radio = this.subscription.to_radio;
                // this.subscription.to_json_address = [];
            }
            this.searchTrip(params);
            this.$router.replace({ name: 'trips', params: { keepSearch: true } });
        }
    }
};
</script>