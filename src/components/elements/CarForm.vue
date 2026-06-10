<template>
    <div class="car-form">
        <div class="form-group">
            <label>{{ $t('patente') }}</label>
            <input
                v-model="entry.patente"
                type="text"
                class="form-control"
                maxlength="20"
            />
        </div>
        <div class="form-group">
            <label>{{ $t('marca') }}</label>
            <CatalogCombobox
                v-model="entry.brandSelection"
                :options="catalogBrands"
                :placeholder="$t('buscarMarca')"
                :other-label="$t('marcaOtro')"
                @update:model-value="onBrandSelectionChange"
                @other-selected="onBrandSelectionChange('other')"
            />
        </div>
        <div
            v-if="entry.brandSelection === catalogOtherValue"
            class="form-group"
        >
            <input
                v-model="entry.brand_other"
                type="text"
                class="form-control"
                :placeholder="$t('marcaOtroPlaceholder')"
            />
        </div>
        <div class="form-group">
            <label>{{ $t('modelo') }}</label>
            <CatalogCombobox
                v-model="entry.modelSelection"
                :options="catalogModels"
                :placeholder="$t('buscarModelo')"
                :other-label="$t('modeloOtro')"
                :disabled="!entry.brandSelection"
                @update:model-value="onModelSelectionChange"
                @other-selected="onModelSelectionChange('other')"
            />
        </div>
        <div
            v-if="entry.modelSelection === catalogOtherValue"
            class="form-group"
        >
            <input
                v-model="entry.model_other"
                type="text"
                class="form-control"
                :placeholder="$t('modeloOtroPlaceholder')"
            />
        </div>
        <div class="form-group">
            <label>{{ $t('anio') }}</label>
            <input
                v-model.number="entry.year"
                type="number"
                class="form-control"
                :min="carYearMin"
                :max="carYearMax"
                :placeholder="$t('anioPlaceholder')"
            />
        </div>
        <div class="form-group">
            <label>{{ $t('color') }}</label>
            <select v-model="entry.car_color_id" class="form-control">
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
    </div>
</template>

<script>
import CatalogCombobox from './CatalogCombobox.vue';
import {
    CAR_YEAR_MIN,
    CATALOG_OTHER_VALUE,
    getCarYearMax
} from '../../utils/carFields.js';

export default {
    name: 'car-form',
    components: {
        CatalogCombobox
    },
    props: {
        entry: {
            type: Object,
            required: true
        },
        catalogBrands: {
            type: Array,
            default: () => []
        },
        catalogColors: {
            type: Array,
            default: () => []
        },
        catalogModels: {
            type: Array,
            default: () => []
        }
    },
    emits: ['brand-selection-change'],
    computed: {
        catalogOtherValue() {
            return CATALOG_OTHER_VALUE;
        },
        carYearMin() {
            return CAR_YEAR_MIN;
        },
        carYearMax() {
            return getCarYearMax();
        }
    },
    methods: {
        onBrandSelectionChange(value) {
            this.$emit('brand-selection-change', value);
        },
        onModelSelectionChange(value) {
            this.entry.modelSelection = value;
            if (value === CATALOG_OTHER_VALUE) {
                this.entry.car_model_id = null;
                return;
            }

            this.entry.model_other = '';
            this.entry.car_model_id = value;
        }
    }
};
</script>

<style scoped>
.car-form :deep(.form-control) {
    color: #333;
}

.car-form :deep(select.form-control option) {
    color: #333;
    background: #fff;
}
</style>
