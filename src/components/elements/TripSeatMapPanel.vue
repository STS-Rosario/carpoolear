<template>
    <div class="trip-seat-map-panel">
        <p class="trip-seat-map-panel__subtitle label-soft">
            {{ $t('tripSeatMapSubtitle') }}
        </p>

        <div class="trip-seat-map-panel__row">
            <div class="trip-seat-map-panel__seat trip-seat-map-panel__seat--driver">
                <img
                    :src="driverIcon"
                    alt=""
                    class="trip-seat-map-panel__icon"
                />
                <strong>{{ $t('tripSeatMapDriver') }}</strong>
                <span>{{ $t('tripSeatMapDriverRole') }}</span>
            </div>
            <button
                v-if="passengerSeatAvailability.length"
                type="button"
                class="trip-seat-map-panel__seat"
                :class="seatClass(0)"
                @click="toggleSeat(0)"
            >
                <img
                    :src="seatIcon"
                    alt=""
                    class="trip-seat-map-panel__icon"
                />
                <strong>{{ $t(seatLabelKeys[0]) }}</strong>
                <span>{{ seatStatusLabel(0) }}</span>
            </button>
        </div>

        <div
            class="trip-seat-map-panel__row"
            :class="'trip-seat-map-panel__row--rear-' + rearSeatCount"
        >
            <button
                v-for="index in rearSeatIndexes"
                :key="'seat-' + index"
                type="button"
                class="trip-seat-map-panel__seat"
                :class="seatClass(index)"
                @click="toggleSeat(index)"
            >
                <img
                    :src="seatIcon"
                    alt=""
                    class="trip-seat-map-panel__icon"
                />
                <strong>{{ $t(seatLabelKeys[index]) }}</strong>
                <span>{{ seatStatusLabel(index) }}</span>
            </button>
        </div>

        <div class="trip-seat-map-panel__footer">
            <p class="trip-seat-map-panel__count">
                <template v-if="offeredCount > 0">
                    {{ $t('tripSeatMapOffering', { n: offeredCount }) }}
                </template>
                <template v-else>
                    {{ $t('tripSeatMapOfferAtLeastOne') }}
                </template>
            </p>
            <p class="trip-seat-map-panel__hint label-soft">
                {{ $t('tripSeatMapHint') }}
            </p>
        </div>
    </div>
</template>

<script>
import {
    countAvailableSeats,
    seatLabelsForLayout,
    togglePassengerSeat
} from '../../utils/tripSeatLayout.js';

export default {
    name: 'trip-seat-map-panel',

    props: {
        seatLayoutCapacity: {
            type: [Number, String],
            required: true
        },
        passengerSeatAvailability: {
            type: Array,
            required: true
        }
    },

    emits: ['update:passengerSeatAvailability'],

    data() {
        const base = process.env.ROUTE_BASE || '/';
        const normalized = base.endsWith('/') ? base : `${base}/`;
        return {
            driverIcon: `${normalized}img/volante.svg`,
            seatIcon: `${normalized}img/asiento.svg`
        };
    },

    computed: {
        seatLabelKeys() {
            return seatLabelsForLayout(this.seatLayoutCapacity);
        },
        offeredCount() {
            return countAvailableSeats(this.passengerSeatAvailability);
        },
        rearSeatCount() {
            return Math.max(0, this.passengerSeatAvailability.length - 1);
        },
        rearSeatIndexes() {
            return Array.from(
                { length: this.rearSeatCount },
                (_, i) => i + 1
            );
        }
    },

    methods: {
        seatClass(index) {
            const available = this.passengerSeatAvailability[index];
            return {
                'trip-seat-map-panel__seat--on': available,
                'trip-seat-map-panel__seat--off': !available
            };
        },
        seatStatusLabel(index) {
            return this.passengerSeatAvailability[index]
                ? this.$t('tripSeatMapAvailable')
                : this.$t('tripSeatMapUnavailable');
        },
        toggleSeat(index) {
            this.$emit(
                'update:passengerSeatAvailability',
                togglePassengerSeat(this.passengerSeatAvailability, index)
            );
        }
    }
};
</script>

<style scoped>
.trip-seat-map-panel__subtitle {
    margin: 0 0 1rem;
}

.trip-seat-map-panel__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
}

.trip-seat-map-panel__row--rear-3 {
    grid-template-columns: 1fr 1fr 1fr;
}

.trip-seat-map-panel__seat {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    min-height: 6.5rem;
    padding: 0.85rem 0.5rem;
    border: 1px solid #d0d0d0;
    border-radius: 0.75rem;
    background: #fff;
    color: #737373;
    font: inherit;
    text-align: center;
    cursor: pointer;
}

.trip-seat-map-panel__seat i,
.trip-seat-map-panel__icon {
    display: block;
    width: 1.5rem;
    height: 1.5rem;
    margin-bottom: 0.25rem;
    object-fit: contain;
}

.trip-seat-map-panel__seat--off .trip-seat-map-panel__icon {
    opacity: 0.45;
    filter: grayscale(1);
}

.trip-seat-map-panel__seat strong {
    display: block;
    font-size: 0.95rem;
}

.trip-seat-map-panel__seat span {
    font-size: 0.85rem;
}

.trip-seat-map-panel__seat--driver {
    background: #f3f3f3;
    border-color: #e5e5e5;
    color: #404040;
    cursor: default;
}

.trip-seat-map-panel__seat--driver i {
    color: var(--ds-action, #1e5f9e);
}

.trip-seat-map-panel__seat--on {
    border-color: var(--ds-action, #1e5f9e);
    background: #eef5fb;
    color: var(--ds-action, #1e5f9e);
}

.trip-seat-map-panel__seat--off {
    background: #fff;
    color: #9a9a9a;
}

.trip-seat-map-panel__footer {
    margin-top: 1.5rem;
    text-align: center;
}

.trip-seat-map-panel__count {
    margin: 0 0 0.35rem;
    font-size: 1.15rem;
    font-weight: 700;
}

.trip-seat-map-panel__hint {
    margin: 0;
}
</style>
