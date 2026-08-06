<template>
    <div class="trip-car-step-panel">
        <p class="trip-car-step-panel__subtitle label-soft">
            {{ $t('tripCreationStepCarSubtitle') }}
        </p>

        <div
            class="trip-car-step-panel__dropdown"
            :class="{ 'trip-car-step-panel__dropdown--open': dropdownOpen }"
        >
            <button
                type="button"
                class="trip-car-step-panel__dropdown-trigger"
                :aria-expanded="dropdownOpen ? 'true' : 'false'"
                aria-haspopup="listbox"
                @click="dropdownOpen = !dropdownOpen"
            >
                <i class="fa fa-car" aria-hidden="true"></i>
                <span class="trip-car-step-panel__dropdown-label">
                    {{ selectedCarLabel || $t('elegiPatente') }}
                </span>
                <i class="fa fa-chevron-down" aria-hidden="true"></i>
            </button>
            <ul
                v-if="dropdownOpen"
                class="trip-car-step-panel__dropdown-menu"
                role="listbox"
            >
                <li
                    v-for="car in driverCarsWithPlate"
                    :key="car.id"
                    role="option"
                    :aria-selected="String(car.id) === String(selectedCarId)"
                    class="trip-car-step-panel__dropdown-option"
                    @click="selectCar(car.id)"
                >
                    {{ formatCarDropdownLabel(car) }}
                </li>
            </ul>
        </div>
        <span class="error" v-if="carSelectionError.state">
            {{ carSelectionError.message }}
        </span>

        <div class="trip-car-step-panel__add-wrap">
            <button
                type="button"
                class="trip-car-step-panel__add-link btn btn-link"
                @click="$emit('edit-cars')"
            >
                {{ $t('tripCreationAddVehicle') }}
            </button>
        </div>

        <div class="trip-car-step-panel__layouts">
            <p class="trip-car-step-panel__layout-prompt">
                {{ $t('tripSeatLayoutPrompt') }}
            </p>
            <p class="trip-car-step-panel__layout-tip label-soft">
                {{ $t('tripSeatLayoutTip') }}
            </p>
            <div class="trip-car-step-panel__layout-cards">
                <button
                    type="button"
                    class="trip-car-step-panel__layout-card"
                    :class="{
                        'trip-car-step-panel__layout-card--active':
                            Number(seatLayoutCapacity) === 4
                    }"
                    @click="selectLayout(4)"
                >
                    <span
                        class="trip-car-step-panel__layout-icon"
                        :style="layoutIconStyle(fourSeatsIcon)"
                        aria-hidden="true"
                    ></span>
                    <span>{{ $t('tripSeatLayoutFour') }}</span>
                </button>
                <button
                    type="button"
                    class="trip-car-step-panel__layout-card"
                    :class="{
                        'trip-car-step-panel__layout-card--active':
                            Number(seatLayoutCapacity) === 5
                    }"
                    @click="selectLayout(5)"
                >
                    <span
                        class="trip-car-step-panel__layout-icon"
                        :style="layoutIconStyle(fiveSeatsIcon)"
                        aria-hidden="true"
                    ></span>
                    <span>{{ $t('tripSeatLayoutFive') }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { useCarsStore } from '../../stores/car';
import { formatCarDropdownLabel } from '../../utils/carFields.js';
import { activeCarsWithPlate } from '../../utils/userCars.js';

export default {
    name: 'trip-car-step-panel',

    props: {
        selectedCarId: {
            type: [Number, String],
            default: null
        },
        seatLayoutCapacity: {
            type: [Number, String],
            default: null
        },
        carSelectionError: {
            type: Object,
            required: true
        }
    },

    emits: [
        'update:selectedCarId',
        'update:seatLayoutCapacity',
        'cars-updated',
        'edit-cars'
    ],

    data() {
        return {
            dropdownOpen: false,
            fourSeatsIcon: process.env.ROUTE_BASE + 'img/4-seats.svg',
            fiveSeatsIcon: process.env.ROUTE_BASE + 'img/5-seats.svg'
        };
    },

    computed: {
        ...mapState(useCarsStore, {
            cars: 'cars'
        }),
        driverCarsWithPlate() {
            return activeCarsWithPlate(this.cars);
        },
        selectedCar() {
            return this.driverCarsWithPlate.find(
                (car) => String(car.id) === String(this.selectedCarId)
            );
        },
        selectedCarLabel() {
            return this.selectedCar
                ? formatCarDropdownLabel(this.selectedCar)
                : '';
        }
    },

    methods: {
        formatCarDropdownLabel,
        selectCar(id) {
            this.$emit('update:selectedCarId', id);
            this.dropdownOpen = false;
        },
        selectLayout(capacity) {
            this.$emit('update:seatLayoutCapacity', capacity);
        },
        layoutIconStyle(url) {
            return {
                '-webkit-mask-image': `url(${url})`,
                'mask-image': `url(${url})`
            };
        }
    }
};
</script>

<style scoped>
.trip-car-step-panel__subtitle {
    margin: 0 0 0.75rem;
}

.trip-car-step-panel__dropdown {
    position: relative;
}

.trip-car-step-panel__dropdown-trigger {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    min-height: 3rem;
    padding: 0.75rem 1rem;
    border: 1px solid #d0d0d0;
    border-radius: 0.75rem;
    background: #fff;
    color: #22211f;
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.trip-car-step-panel__dropdown-trigger .fa-car {
    color: #737373;
}

.trip-car-step-panel__dropdown-trigger .fa-chevron-down {
    margin-left: auto;
    color: var(--ds-action, #1e5f9e);
}

.trip-car-step-panel__dropdown-label {
    flex: 1;
    min-width: 0;
}

.trip-car-step-panel__dropdown-menu {
    position: absolute;
    z-index: 5;
    left: 0;
    right: 0;
    top: calc(100% + 0.25rem);
    margin: 0;
    padding: 0.35rem 0;
    list-style: none;
    border: 1px solid #d0d0d0;
    border-radius: 0.75rem;
    background: #fff;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    max-height: 14rem;
    overflow: auto;
}

.trip-car-step-panel__dropdown-option {
    padding: 0.75rem 1rem;
    cursor: pointer;
}

.trip-car-step-panel__dropdown-option:hover,
.trip-car-step-panel__dropdown-option[aria-selected='true'] {
    background: #f3f7fb;
    color: var(--ds-action, #1e5f9e);
}

.trip-car-step-panel__add-wrap {
    display: flex;
    justify-content: flex-end;
    margin: 0.5rem 0 1.25rem;
}

.trip-car-step-panel__add-link {
    padding: 0;
    font-weight: 600;
    color: var(--ds-action, #1e5f9e);
    text-decoration: none;
}

.trip-car-step-panel__layout-prompt {
    font-weight: 700;
    margin: 0 0 0.5rem;
}

.trip-car-step-panel__layout-tip {
    margin: 0 0 1rem;
}

.trip-car-step-panel__layout-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
}

.trip-car-step-panel__layout-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 0.75rem;
    border: 1px solid #d0d0d0;
    border-radius: 0.75rem;
    background: #fff;
    color: #434240;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
}

.trip-car-step-panel__layout-card--active {
    border-color: var(--ds-action, #1e5f9e);
    background: #eef5fb;
    color: var(--ds-action, #1e5f9e);
}

.trip-car-step-panel__layout-icon {
    display: block;
    width: 2.5rem;
    height: 4.25rem;
    background-color: currentColor;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-position: center;
    -webkit-mask-size: contain;
    mask-size: contain;
}
</style>
