<template>
    <div
        class="suscription-item_component panel panel-default"
        @click="search(true)"
    >
        <div class="row panel-body">
            <div class="col-xs-20">
                <div
                    class="suscription-item-detail"
                    v-if="subscription.from_address"
                >
                    <div class="suscription-item-detail--content">
                        <span>{{ t('origen') }}:</span>
                        <strong>{{ subscription.from_address }}</strong>
                    </div>
                </div>
                <div
                    class="suscription-item-detail"
                    v-if="subscription.to_address"
                >
                    <div class="suscription-item-detail--content">
                        <span>{{ t('destino') }}:</span>
                        <strong>{{ subscription.to_address }}</strong>
                    </div>
                </div>
                <div
                    class="suscription-item-detail"
                    v-if="subscription.trip_date"
                >
                    <div class="suscription-item-detail--content">
                        <span>{{ t('fechaAproximada') }}:</span>
                        <strong>{{
                            formatDate(subscription.trip_date, 'DD/MM/YYYY')
                        }}</strong>
                    </div>
                </div>
                <div
                    class="suscription-item-detail"
                    v-if="subscription.is_passenger == 1"
                >
                    <div class="suscription-item-detail--content">
                        <span>{{ t('buscoPasajeros') }}</span>
                    </div>
                </div>
                <div
                    class="suscription-item-detail"
                    v-else
                >
                    <div class="suscription-item-detail--content">
                        <span v-html="t('buscoConductor')"></span>
                    </div>
                </div>
                <div class="suscription-item-detail" v-if="resultCount > 0">
                    <div class="suscription-item-detail--content">
                        <span>{{ t('coincidencias') }}:</span>
                        <span class="badge">
                            {{ resultCount }}
                            {{ resultCount === 20 ? '+' : '' }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="col-xs-4">
                <button
                    v-on:click.stop="remove"
                    :disabled="inProgress"
                    class="btn btn-default"
                    :aria-label="t('eliminarSuscripcion')"
                >
                    <i class="fa fa-trash-o" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useSubscriptionsStore } from '@/stores/subscriptions';
import { useTripsStore } from '@/stores/trips';
import moment from 'moment';
import { formatDate } from '@/composables/useFormatters';

const { t } = useI18n();
const router = useRouter();
const subscriptionsStore = useSubscriptionsStore();
const tripsStore = useTripsStore();

const props = defineProps({
    subscription: {
        type: Object,
        required: false,
        default: () => {
            return {};
        }
    },
    user: {
        type: Object,
        required: false,
        default: () => {
            return {};
        }
    }
});

const inProgress = ref(false);
const resultCount = ref(0);

function remove() {
    inProgress.value = true;
    subscriptionsStore.remove(props.subscription)
        .then(() => {
            inProgress.value = false;
        })
        .catch(() => {
            inProgress.value = false;
        });
}

function search(redirect) {
    let params = {};
    if (props.subscription.trip_date) {
        params.date = moment(props.subscription.trip_date).format(
            'YYYY-MM-DD'
        );
    }
    if (props.subscription.from_address) {
        params.origin_name = props.subscription.from_address;
        params.origin_lat = props.subscription.from_lat;
        params.origin_lng = props.subscription.from_lng;
        params.origin_radio = props.subscription.from_radio;
        params.origin_id = props.subscription.from_id;
    }
    if (props.subscription.to_address) {
        params.destination_name = props.subscription.to_address;
        params.destination_lat = props.subscription.to_lat;
        params.destination_lng = props.subscription.to_lng;
        params.destination_radio = props.subscription.to_radio;
        params.destination_id = props.subscription.to_id;
    }
    params.is_passenger = props.subscription.is_passenger;
    tripsStore.tripsSearch(params).then((res) => {
        resultCount.value = res.data.length;
    });
    if (redirect) {
        router.replace({
            name: 'trips',
            params: { keepSearch: true }
        });
    }
}

onMounted(() => {
    search(false);
});
</script>
<style scoped>
.badge {
    background: red;
}
</style>
