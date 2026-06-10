<template>
    <modal v-if="visible" @close="onClose">
        <template #header>
            <h4>{{ $t('completarDatosAuto') }}</h4>
        </template>
        <template #body>
            <div class="complete-car-modal">
            <p>{{ $t('completarDatosAutoDescripcion') }}</p>
            <div class="form-group">
                <label>{{ $t('patente') }}</label>
                <input
                    v-model="form.patente"
                    type="text"
                    class="form-control"
                    disabled
                />
            </div>
            <div class="form-group">
                <label>{{ $t('marca') }}</label>
                <CatalogCombobox
                    v-model="form.brandSelection"
                    :options="catalogBrands"
                    :placeholder="$t('buscarMarca')"
                    :other-label="$t('marcaOtro')"
                    @update:model-value="onBrandSelectionChange"
                    @other-selected="onBrandSelectionChange('other')"
                />
            </div>
            <div v-if="form.brandSelection === 'other'" class="form-group">
                <input
                    v-model="form.brand_other"
                    type="text"
                    class="form-control"
                    :placeholder="$t('marcaOtroPlaceholder')"
                />
            </div>
            <div class="form-group">
                <label>{{ $t('modelo') }}</label>
                <CatalogCombobox
                    v-model="form.modelSelection"
                    :options="catalogModels"
                    :placeholder="$t('buscarModelo')"
                    :other-label="$t('modeloOtro')"
                    :disabled="!form.brandSelection"
                    @update:model-value="onModelSelectionChange"
                    @other-selected="onModelSelectionChange('other')"
                />
            </div>
            <div v-if="form.modelSelection === 'other'" class="form-group">
                <input
                    v-model="form.model_other"
                    type="text"
                    class="form-control"
                    :placeholder="$t('modeloOtroPlaceholder')"
                />
            </div>
            <div class="form-group">
                <label>{{ $t('anio') }}</label>
                <input
                    v-model.number="form.year"
                    type="number"
                    class="form-control"
                    :min="carYearMin"
                    :max="carYearMax"
                    :placeholder="$t('anioPlaceholder')"
                />
            </div>
            <div class="form-group">
                <label>{{ $t('color') }}</label>
                <select v-model="form.car_color_id" class="form-control">
                    <option :value="null">{{ $t('seleccionarColor') }}</option>
                    <option
                        v-for="color in catalogColors"
                        :key="color.id"
                        :value="color.id"
                    >
                        {{ color.name }}
                    </option>
                </select>
            </div>
            <p v-if="error" class="error">{{ error }}</p>
            </div>
        </template>
        <template #footer>
            <button
                type="button"
                class="btn btn-primary"
                :disabled="saving"
                @click="save"
            >
                {{ $t('guardar') }}
            </button>
        </template>
    </modal>
</template>

<script>
import modal from '../Modal';
import CatalogCombobox from './CatalogCombobox.vue';
import { useCarCatalogStore } from '../../stores/carCatalog';
import { useCarsStore } from '../../stores/car';
import {
    buildCarFormFromCar,
    carPayloadFromForm,
    CAR_YEAR_MIN,
    CATALOG_OTHER_VALUE,
    getCarYearMax
} from '../../utils/carFields.js';

export default {
    name: 'complete-car-modal',
    components: {
        modal,
        CatalogCombobox
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        car: {
            type: Object,
            default: null
        }
    },
    emits: ['close', 'saved'],
    computed: {
        carYearMin() {
            return CAR_YEAR_MIN;
        },
        carYearMax() {
            return getCarYearMax();
        }
    },
    data() {
        return {
            form: buildCarFormFromCar(null),
            catalogBrands: [],
            catalogColors: [],
            catalogModels: [],
            saving: false,
            error: ''
        };
    },
    watch: {
        visible(value) {
            if (value && this.car) {
                this.form = buildCarFormFromCar(this.car);
                this.bootstrapCatalog();
            }
        }
    },
    methods: {
        async bootstrapCatalog() {
            const catalogStore = useCarCatalogStore();
            this.catalogBrands = await catalogStore.fetchBrands();
            this.catalogColors = await catalogStore.fetchColors();
            if (
                this.form.brandSelection &&
                this.form.brandSelection !== CATALOG_OTHER_VALUE
            ) {
                this.catalogModels = await catalogStore.fetchModels(
                    this.form.brandSelection
                );
            }
        },
        async onBrandSelectionChange(value) {
            this.form.brandSelection = value;
            this.form.car_brand_id =
                value === CATALOG_OTHER_VALUE ? null : value;
            this.form.car_model_id = null;
            this.form.modelSelection = null;
            this.form.model_other = '';
            if (value && value !== CATALOG_OTHER_VALUE) {
                const catalogStore = useCarCatalogStore();
                this.catalogModels = await catalogStore.fetchModels(value);
            } else {
                this.catalogModels = [];
            }
        },
        onModelSelectionChange(value) {
            this.form.modelSelection = value;
            if (value === CATALOG_OTHER_VALUE) {
                this.form.car_model_id = null;
                return;
            }
            this.form.model_other = '';
            this.form.car_model_id = value;
        },
        onClose() {
            this.$emit('close');
        },
        async save() {
            this.error = '';
            this.saving = true;
            try {
                const carsStore = useCarsStore();
                const payload = {
                    ...carPayloadFromForm(this.form),
                    id: this.form.id
                };
                await carsStore.update(payload);
                this.$emit('saved');
            } catch (err) {
                this.error = this.$t('autoIncompleto');
            } finally {
                this.saving = false;
            }
        }
    }
};
</script>

<style scoped>
.complete-car-modal :deep(.form-control) {
    color: #333;
}

.complete-car-modal :deep(select.form-control option) {
    color: #333;
    background: #fff;
}
</style>
