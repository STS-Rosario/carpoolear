<template>
    <div
        class="subscription-alert-card"
        data-testid="subscription-alert-card"
        @click="search(true)"
    >
        <div class="subscription-alert-card__body">
            <div
                class="subscription-alert-card__detail"
                v-if="subscription.from_address"
            >
                <span>{{ $t('origen') }}:</span>
                <strong>{{ subscription.from_address }}</strong>
            </div>
            <div
                class="subscription-alert-card__detail"
                v-if="subscription.to_address"
            >
                <span>{{ $t('destino') }}:</span>
                <strong>{{ subscription.to_address }}</strong>
            </div>
            <div
                class="subscription-alert-card__detail"
                v-if="subscription.trip_date"
            >
                <span>{{ $t('fechaAproximada') }}:</span>
                <strong>{{
                    dayjs(subscription.trip_date).format('DD/MM/YYYY')
                }}</strong>
            </div>
            <div
                class="subscription-alert-card__detail"
                v-if="subscription.is_passenger == 1"
            >
                <span>{{ $t('buscoPasajeros') }}</span>
            </div>
            <div class="subscription-alert-card__detail" v-else>
                <span v-html="$t('buscoConductor')"></span>
            </div>
            <div
                class="subscription-alert-card__detail"
                v-if="resultCount > 0"
            >
                <span>{{ $t('coincidencias') }}:</span>
                <span class="subscription-alert-card__badge">
                    {{ resultCount }}
                    {{ resultCount === 20 ? '+' : '' }}
                </span>
            </div>
        </div>
        <AppButton
            class="subscription-alert-card__delete"
            data-testid="subscription-alert-delete"
            variant="danger"
            size="sm"
            icon-left="fa fa-trash-o"
            :label="$t('borrar')"
            :disabled="inProgress"
            :aria-label="$t('eliminarSuscripcion')"
            @click.stop="remove"
        />
    </div>
</template>
<script>
import { mapActions } from 'pinia';
import { useSubscriptionsStore } from '../../stores/subscriptions';
import { useTripsStore } from '../../stores/trips';
import AppButton from '../ui/AppButton.vue';
import dayjs from '../../dayjs';
export default {
    name: 'subscriptions-item',
    components: {
        AppButton
    },
    props: {
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
    },
    data() {
        return {
            inProgress: false,
            resultCount: 0
        };
    },
    mounted() {
        this.search(false);
    },
    methods: {
        dayjs,
        ...mapActions(useSubscriptionsStore, {
            removeStore: 'remove'
        }),
        ...mapActions(useTripsStore, {
            searchTrip: 'tripsSearch'
        }),
        remove(event) {
            if (event && event.stopPropagation) {
                event.stopPropagation();
            }
            this.inProgress = true;
            this.removeStore(this.subscription)
                .then(() => {
                    this.inProgress = false;
                })
                .catch(() => {
                    this.inProgress = false;
                });
        },
        search(redirect) {
            let params = {};
            if (this.subscription.trip_date) {
                params.date = dayjs(this.subscription.trip_date).format(
                    'YYYY-MM-DD'
                );
            }
            if (this.subscription.from_address) {
                params.origin_name = this.subscription.from_address;
                params.origin_lat = this.subscription.from_lat;
                params.origin_lng = this.subscription.from_lng;
                params.origin_radio = this.subscription.from_radio;
                params.origin_id = this.subscription.from_id;
            }
            if (this.subscription.to_address) {
                params.destination_name = this.subscription.to_address;
                params.destination_lat = this.subscription.to_lat;
                params.destination_lng = this.subscription.to_lng;
                params.destination_radio = this.subscription.to_radio;
                params.destination_id = this.subscription.to_id;
            }
            params.is_passenger = this.subscription.is_passenger;
            this.searchTrip(params).then((res) => {
                this.resultCount = res.data.length;
            });
            if (redirect) {
                this.$router.replace({
                    name: 'trips',
                    query: { keepSearch: 'true' }
                });
            }
        }
    }
};
</script>
<style scoped>
.subscription-alert-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    box-sizing: border-box;
    width: 100%;
    padding: 0.875rem 1rem;
    border: none;
    border-radius: var(--ds-card-radius);
    background: var(--ds-card-bg);
    box-shadow: var(--ds-card-shadow);
    color: var(--ds-text-primary);
    font-family: var(--ds-font-family);
    cursor: pointer;
}

.subscription-alert-card__body {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
    flex: 1 1 auto;
}

.subscription-alert-card__detail {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.35rem;
    font-size: 0.9rem;
    line-height: 1.35;
    color: var(--ds-text-secondary);
}

.subscription-alert-card__detail strong {
    color: var(--ds-text-primary);
    font-weight: var(--ds-font-weight-bold, 700);
}

.subscription-alert-card__badge {
    display: inline-flex;
    align-items: center;
    padding: 0.1rem 0.45rem;
    border-radius: 999px;
    background: var(--ds-action, #1e5f9e);
    color: #fff;
    font-size: 0.75rem;
    font-weight: var(--ds-font-weight-bold, 700);
    line-height: 1.2;
}

.subscription-alert-card__delete {
    flex: 0 0 auto;
}
</style>
