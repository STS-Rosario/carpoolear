<template>
    <div class="cars-editor-panel">
        <p
            v-if="incompleteCars.length"
            class="alert alert-warning cars-editor-panel__incomplete"
            role="alert"
        >
            {{ $t('autosCompletarPendientes') }}
        </p>

        <ul v-if="carsList.length" class="cars-editor-panel__list">
            <li
                v-for="car in carsList"
                :key="car.id"
                class="cars-editor-panel__item"
            >
                <div class="cars-editor-panel__summary">
                    <span class="cars-editor-panel__label">{{
                        carDisplayLabel(car) || car.patente
                    }}</span>
                    <span
                        v-if="!isCarComplete(car)"
                        class="label label-warning cars-editor-panel__badge"
                    >
                        {{ $t('autosIncompleto') }}
                    </span>
                </div>
                <div class="cars-editor-panel__actions">
                    <button
                        type="button"
                        class="btn btn-default btn-sm cars-editor-panel__action-btn"
                        @click="openEditCar(car)"
                    >
                        <i class="fa fa-pencil" aria-hidden="true"></i>
                        {{ $t('editarAuto') }}
                    </button>
                    <button
                        type="button"
                        class="btn btn-danger btn-sm cars-editor-panel__action-btn"
                        @click="deleteCar(car)"
                    >
                        <i class="fa fa-trash-o" aria-hidden="true"></i>
                        {{ $t('eliminarAuto') }}
                    </button>
                </div>
            </li>
        </ul>

        <p v-else class="cars-editor-panel__empty">{{ $t('autosSinRegistros') }}</p>

        <button
            type="button"
            class="btn btn-primary cars-editor-panel__add cars-editor-panel__action-btn"
            @click="openAddCar"
        >
            <i class="fa fa-plus" aria-hidden="true"></i>
            {{ $t('agregarAuto') }}
        </button>

        <modal v-if="showForm" :name="formModalName" @close="closeForm">
            <template #header>
                <h4>
                    {{
                        formEntry.id ? $t('editarAuto') : $t('agregarAuto')
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
    </div>
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
    name: 'cars-editor-panel',
    components: {
        modal,
        CarForm
    },
    props: {
        active: {
            type: Boolean,
            default: true
        },
        promptIncompleteOnLoad: {
            type: Boolean,
            default: false
        },
        formModalName: {
            type: String,
            default: 'cars-editor-form'
        }
    },
    emits: ['updated'],
    data() {
        return {
            catalogBrands: [],
            catalogColors: [],
            catalogModels: [],
            showForm: false,
            formEntry: emptyCarForm(),
            formError: '',
            saving: false,
            catalogLoaded: false,
            openedIncompleteOnLoad: false
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
        active: {
            immediate: true,
            async handler(isActive) {
                if (!isActive) {
                    return;
                }

                await this.refreshCars();
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
        async refreshCars() {
            await this.carIndex();
            if (!this.catalogLoaded) {
                await this.loadCarCatalog();
                this.catalogLoaded = true;
            }
            this.promptIncompleteCarsIfNeeded();
        },
        async loadCarCatalog() {
            const catalogStore = useCarCatalogStore();
            this.catalogBrands = await catalogStore.fetchBrands();
            this.catalogColors = await catalogStore.fetchColors();
        },
        promptIncompleteCarsIfNeeded() {
            if (
                !this.promptIncompleteOnLoad ||
                this.openedIncompleteOnLoad ||
                !this.incompleteCars.length
            ) {
                return;
            }

            this.openedIncompleteOnLoad = true;
            this.openEditCar(this.incompleteCars[0]);
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
.cars-editor-panel {
    color: var(--main-font-color, #555);
}

.cars-editor-panel__list {
    list-style: none;
    margin: 0 0 1rem;
    padding: 0;
    color: var(--main-font-color, #555);
}

.cars-editor-panel__item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid #e5e5e5;
}

.cars-editor-panel__summary {
    flex: 1 1 12rem;
    color: var(--main-font-color, #555);
}

.cars-editor-panel__label {
    color: #333;
    font-weight: 500;
}

.cars-editor-panel__badge {
    margin-left: 0.5rem;
}

.cars-editor-panel__actions {
    display: flex;
    gap: 0.5rem;
}

.cars-editor-panel__action-btn .fa {
    margin-right: 0.35em;
}

.cars-editor-panel__add {
    margin-top: 0.5rem;
}

.cars-editor-panel__empty {
    margin: 0 0 1rem;
    color: #666;
}
</style>
