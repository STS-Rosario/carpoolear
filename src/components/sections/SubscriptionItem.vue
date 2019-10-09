<template>
    <div class="suscription-item_component panel panel-default" @click="search(true)">
        <div class="row panel-body">
            <div class="col-xs-20">
                <div class="suscription-item-detail" v-if="subscription.from_address">
                    <div class="suscription-item-detail--content">
                        <span>Origen:</span>
                        <strong>{{ subscription.from_address }}</strong>
                    </div>
                </div>
                <div class="suscription-item-detail" v-if="subscription.to_address">
                    <div class="suscription-item-detail--content">
                        <span>Destino:</span>
                        <strong>{{ subscription.to_address }}</strong>
                    </div>
                </div>
                <div class="suscription-item-detail" v-if="subscription.trip_date">
                    <div class="suscription-item-detail--content">
                        <span>Fecha aproximada:</span>
                        <strong>{{ subscription.trip_date | moment("DD/MM/YYYY") }}</strong>
                    </div>
                </div>
                <div class="suscription-item-detail" v-if="subscription.is_passenger == 1">
                    <div class="suscription-item-detail--content">
                        <span>Busco pasajeros</span>
                    </div>
                </div>
                <div class="suscription-item-detail" v-if="resultCount > 0">
                    <div class="suscription-item-detail--content">
                        <span>Coincidencias:</span>
                        <span class="badge">
                            {{ resultCount }}
                            {{ resultCount === 20 ? '+' : '' }}
                        </span>
                    </div>
                </div>

            </div>
            <div class="col-xs-4">
                <button v-on:click.stop="remove" :disabled="inProgress" class="btn btn-default"  aria-label="Eliminar suscripción">
                    <i class="fa fa-trash-o" aria-hidden="true"></i>
                </button>
            </div>
        </div>

    </div>
</template>
<script>
import { mapActions } from 'vuex';
import moment from 'moment';
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
            inProgress: false,
            resultCount: 0
        };
    },
    mounted () {
        this.search(false);
    },
    methods: {
        ...mapActions({
            removeStore: 'subscriptions/remove',
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
        search (redirect) {
            let params = {};
            if (this.subscription.trip_date) {
                params.date = moment(this.subscription.trip_date).format('YYYY-MM-DD');
            }
            if (this.subscription.from_address) {
                params.origin_name = this.subscription.from_address;
                params.origin_lat = this.subscription.from_lat;
                params.origin_lng = this.subscription.from_lng;
                params.origin_radio = this.subscription.from_radio;
                params.origin_id = this.subscription.from_id;
                // this.subscription.from_json_address = [];
            }
            if (this.subscription.to_address) {
                params.destination_name = this.subscription.to_address;
                params.destination_lat = this.subscription.to_lat;
                params.destination_lng = this.subscription.to_lng;
                params.destination_radio = this.subscription.to_radio;
                params.destination_id = this.subscription.to_id;
                // this.subscription.to_json_address = [];
            }
            params.is_passenger = this.subscription.is_passenger;
            this.searchTrip(params).then((res) => {
                this.resultCount = res.data.length;
            });
            if (redirect) {
                this.$router.replace({ name: 'trips', params: { keepSearch: true } });
            }
        }
    }
};
</script>
<style scoped>
    .badge {
        background: red;
    }
</style>
