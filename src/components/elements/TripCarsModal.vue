<template>
    <modal
        v-if="visible"
        :name="'trip-cars-modal'"
        @close="$emit('close')"
    >
        <template #header>
            <h4>{{ $t('autos') }}</h4>
        </template>
        <template #body>
            <div class="trip-cars-modal">
                <p
                    v-if="incompleteCars.length"
                    class="alert alert-warning trip-cars-modal__incomplete"
                    role="alert"
                >
                    {{ $t('autosCompletarPendientes') }}
                </p>

                <ul v-if="carsList.length" class="trip-cars-modal__list">
                    <li
                        v-for="car in carsList"
                        :key="car.id"
                        class="trip-cars-modal__item"
                    >
                        <div class="trip-cars-modal__summary">
                            <span class="trip-cars-modal__label">{{
                                carDisplayLabel(car) || car.patente
                            }}</span>
                            <span
                                v-if="!isCarComplete(car)"
                                class="label label-warning trip-cars-modal__badge"
                            >
                                {{ $t('autosIncompleto') }}
                            </span>
                        </div>
                        <div class="trip-cars-modal__actions">
                            <button
                                type="button"
                                class="btn btn-default btn-sm trip-cars-modal__action-btn"
                                @click="openEditCar(car)"
                            >
                                <i class="fa fa-pencil" aria-hidden="true"></i>
                                {{ $t('editarAuto') }}
                            </button>
                            <button
                                type="button"
                                class="btn btn-danger btn-sm trip-cars-modal__action-btn"
                                @click="deleteCar(car)"
                            >
                                <i class="fa fa-trash-o" aria-hidden="true"></i>
                                {{ $t('eliminarAuto') }}
                            </button>
                        </div>
                    </li>
                </ul>

                <p v-else class="trip-cars-modal__empty">
                    {{ $t('autosSinRegistros') }}
                </p>

                <button
                    type="button"
                    class="btn btn-primary trip-cars-modal__add trip-cars-modal__action-btn"
                    @click="openAddCar"
                >
                    <i class="fa fa-plus" aria-hidden="true"></i>
                    {{ $t('agregarAuto') }}
                </button>
            </div>

            <modal
                v-if="showForm"
                :name="'trip-car-form'"
                @close="closeForm"
            >
                <template #header>
                    <h4>
                        {{
                            formEntry.id
                                ? $t('editarAuto')
                                : $t('agregarAuto')
                        }}
                    </h4>
                </template>
                <template #body>
                    <CarForm
                        :entry="formEntry"
                        :catalog-brands="catalogBrands"
                        :catalog-colors="catalogColors"
                        :catalog-models="catalogModels"
                        @brand-selection-change="onBrandSelectionChange"
                    />
                    <p v-if="formError" class="error">{{ formError }}</p>
                </template>
                <template #footer>
                    <button
                        type="button"
                        class="btn btn-primary"
                        :disabled="saving"
                        @click="saveCar"
                    >
                        {{ $t('guardar') }}
                    </button>
                </template>
            </modal>
        </template>
    </modal>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import modal from '../Modal';
import CarForm from './CarForm.vue';
import { useCarsStore } from '../../stores/car';
import { useCarCatalogStore } from '../../stores/carCatalog';
import dialogs from '../../services/dialogs.js';
import { getApiErrorMessage } from '../../utils/apiErrors.js';
import {
    buildCarFormFromCar,
    carDisplayLabel,
    carFormMissingFieldKeys,
    carPayloadFromForm,
    carsNeedingCompletion,
    CATALOG_OTHER_VALUE,
    emptyCarForm,
    isCarComplete,
    isCarFormComplete
} from '../../utils/carFields.js';

export default {
    name: 'trip-cars-modal',
    components: {
        modal,
        CarForm
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    emits: ['close', 'updated'],
    data() {
        return {
            catalogBrands: [],
            catalogColors: [],
            catalogModels: [],
            showForm: false,
            formEntry: emptyCarForm(),
            formError: '',
            saving: false,
            catalogLoaded: false
        };
    },
    computed: {
        ...mapState(useCarsStore, {
            cars: 'cars'
        }),
        carsList() {
            return Array.isArray(this.cars) ? this.cars : [];
        },
        incompleteCars() {
            return carsNeedingCompletion(this.carsList);
        }
    },
    watch: {
        visible: {
            immediate: true,
            async handler(isVisible) {
                if (!isVisible) {
                    return;
                }

                await this.carIndex();
                if (!this.catalogLoaded) {
                    await this.loadCarCatalog();
                    this.catalogLoaded = true;
                }
            }
        }
    },
    methods: {
        carDisplayLabel,
        isCarComplete,
        ...mapActions(useCarsStore, {
            carCreate: 'create',
            carUpdate: 'update',
            carDelete: 'delete',
            carIndex: 'index'
        }),
        async loadCarCatalog() {
            const catalogStore = useCarCatalogStore();
            this.catalogBrands = await catalogStore.fetchBrands();
            this.catalogColors = await catalogStore.fetchColors();
        },
        async onBrandSelectionChange(value) {
            this.formEntry.brandSelection = value;
            this.formEntry.car_brand_id =
                value === CATALOG_OTHER_VALUE ? null : value;
            this.formEntry.car_model_id = null;
            this.formEntry.modelSelection = null;
            this.formEntry.model_other = '';
            this.formEntry.brand_other =
                value === CATALOG_OTHER_VALUE ? this.formEntry.brand_other : '';

            if (value && value !== CATALOG_OTHER_VALUE) {
                const catalogStore = useCarCatalogStore();
                this.catalogModels = await catalogStore.fetchModels(value);
            } else {
                this.catalogModels = [];
            }
        },
        async openEditCar(car) {
            this.formEntry = buildCarFormFromCar(car);
            this.formError = '';
            if (
                this.formEntry.brandSelection &&
                this.formEntry.brandSelection !== CATALOG_OTHER_VALUE
            ) {
                const catalogStore = useCarCatalogStore();
                this.catalogModels = await catalogStore.fetchModels(
                    this.formEntry.brandSelection
                );
            } else {
                this.catalogModels = [];
            }
            this.showForm = true;
        },
        openAddCar() {
            this.formEntry = emptyCarForm();
            this.catalogModels = [];
            this.formError = '';
            this.showForm = true;
        },
        closeForm() {
            this.showForm = false;
            this.formError = '';
        },
        async saveCar() {
            this.formError = '';

            if (!(this.formEntry.patente || '').trim()) {
                this.formError = this.$t('olvidastePatente');
                return;
            }

            if (!isCarFormComplete(this.formEntry)) {
                const missing = carFormMissingFieldKeys(this.formEntry);
                this.formError = this.$t('autosDatosIncompletos', {
                    fields: missing.map((key) => this.$t(key)).join(', ')
                });
                return;
            }

            this.saving = true;
            try {
                const payload = carPayloadFromForm(this.formEntry);
                if (this.formEntry.id) {
                    await this.carUpdate({ ...payload, id: this.formEntry.id });
                } else {
                    await this.carCreate(payload);
                }
                await this.carIndex();
                this.closeForm();
                this.$emit('updated');
                dialogs.message(this.$t('autoGuardado'));
            } catch (err) {
                this.formError = getApiErrorMessage(
                    err,
                    this.$t('autosDatosIncompletos')
                );
            } finally {
                this.saving = false;
            }
        },
        deleteCar(car) {
            if (!window.confirm(this.$t('confirmarEliminarAuto'))) {
                return;
            }

            this.carDelete({ id: car.id })
                .then(async () => {
                    await this.carIndex();
                    this.$emit('updated');
                })
                .catch((err) => {
                    dialogs.message(getApiErrorMessage(err), {
                        duration: 10,
                        estado: 'error'
                    });
                });
        }
    }
};
</script>

<style scoped>
.trip-cars-modal {
    color: var(--main-font-color, #555);
}

.trip-cars-modal__list {
    list-style: none;
    margin: 0 0 1rem;
    padding: 0;
    color: var(--main-font-color, #555);
}

.trip-cars-modal__item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid #e5e5e5;
}

.trip-cars-modal__summary {
    flex: 1 1 12rem;
    color: var(--main-font-color, #555);
}

.trip-cars-modal__label {
    color: #333;
    font-weight: 500;
}

.trip-cars-modal__badge {
    margin-left: 0.5rem;
}

.trip-cars-modal__actions {
    display: flex;
    gap: 0.5rem;
}

.trip-cars-modal__action-btn .fa {
    margin-right: 0.35em;
}

.trip-cars-modal__add {
    margin-top: 0.5rem;
}

.trip-cars-modal__empty {
    margin: 0 0 1rem;
    color: #666;
}
</style>
