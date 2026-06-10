<template>
    <div class="profile-cars">
        <h1 class="profile-cars__heading">{{ $t('autos') }}</h1>

        <p
            v-if="incompleteCars.length"
            class="alert alert-warning profile-cars__incomplete"
            role="alert"
        >
            {{ $t('autosCompletarPendientes') }}
        </p>

        <ul v-if="carsList.length" class="profile-cars__list">
            <li
                v-for="car in carsList"
                :key="car.id"
                class="profile-cars__item"
            >
                <div class="profile-cars__summary">
                    <span>{{ carDisplayLabel(car) || car.patente }}</span>
                    <span
                        v-if="!isCarComplete(car)"
                        class="label label-warning profile-cars__badge"
                    >
                        {{ $t('autosIncompleto') }}
                    </span>
                </div>
                <div class="profile-cars__actions">
                    <button
                        type="button"
                        class="btn btn-default btn-sm"
                        @click="openEditCar(car)"
                    >
                        {{ $t('editarAuto') }}
                    </button>
                    <button
                        type="button"
                        class="btn btn-default btn-sm"
                        @click="deleteCar(car)"
                    >
                        {{ $t('eliminarAuto') }}
                    </button>
                </div>
            </li>
        </ul>

        <p v-else class="profile-cars__empty">{{ $t('autosSinRegistros') }}</p>

        <button
            type="button"
            class="btn btn-primary profile-cars__add"
            @click="openAddCar"
        >
            {{ $t('agregarAuto') }}
        </button>

        <modal v-if="showForm" :name="'profile-car-form'" @close="closeForm">
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
import CarForm from '../elements/CarForm.vue';
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
    name: 'profile-cars',
    components: {
        modal,
        CarForm
    },
    data() {
        return {
            catalogBrands: [],
            catalogColors: [],
            catalogModels: [],
            showForm: false,
            formEntry: emptyCarForm(),
            formError: '',
            saving: false,
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
    async mounted() {
        await this.carIndex();
        await this.loadCarCatalog();
        this.promptIncompleteCarsIfNeeded();
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
        promptIncompleteCarsIfNeeded() {
            if (this.openedIncompleteOnLoad || !this.incompleteCars.length) {
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
                dialogs.message(this.$t('autoGuardado'));
            } catch (err) {
                this.formError = getApiErrorMessage(err, this.$t('autosDatosIncompletos'));
            } finally {
                this.saving = false;
            }
        },
        deleteCar(car) {
            if (!window.confirm(this.$t('confirmarEliminarAuto'))) {
                return;
            }

            this.carDelete({ id: car.id })
                .then(() => this.carIndex())
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
.profile-cars__heading {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 1rem;
}

.profile-cars__list {
    list-style: none;
    margin: 0 0 1rem;
    padding: 0;
}

.profile-cars__item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid #e5e5e5;
}

.profile-cars__summary {
    flex: 1 1 12rem;
}

.profile-cars__badge {
    margin-left: 0.5rem;
}

.profile-cars__actions {
    display: flex;
    gap: 0.5rem;
}

.profile-cars__add {
    margin-top: 0.5rem;
}

.profile-cars__empty {
    margin: 0 0 1rem;
    color: #666;
}
</style>
