<template>
    <div class="car-form">
        <AppInput
            :label="$t('patente')"
            v-model="entry.patente"
            maxlength="20"
            :disabled="patenteDisabled"
        />
        <AppField :label="$t('marca')">
            <CatalogCombobox
                v-model="entry.brandSelection"
                :options="catalogBrands"
                :placeholder="$t('buscarMarca')"
                :other-label="$t('marcaOtro')"
                @update:model-value="onBrandSelectionChange"
                @other-selected="onBrandSelectionChange('other')"
            />
        </AppField>
        <AppInput
            v-if="entry.brandSelection === catalogOtherValue"
            v-model="entry.brand_other"
            :placeholder="$t('marcaOtroPlaceholder')"
        />
        <AppField :label="$t('modelo')">
            <CatalogCombobox
                v-model="entry.modelSelection"
                :options="catalogModels"
                :placeholder="$t('buscarModelo')"
                :other-label="$t('modeloOtro')"
                :disabled="!entry.brandSelection"
                @update:model-value="onModelSelectionChange"
                @other-selected="onModelSelectionChange('other')"
            />
        </AppField>
        <AppInput
            v-if="entry.modelSelection === catalogOtherValue"
            v-model="entry.model_other"
            :placeholder="$t('modeloOtroPlaceholder')"
        />
        <AppInput
            :label="$t('anio')"
            v-model="entry.year"
            type="number"
            :min="carYearMin"
            :max="carYearMax"
            :placeholder="$t('anioPlaceholder')"
        />
        <AppField :label="$t('color')" label-for="car-form-color">
            <select
                id="car-form-color"
                v-model="entry.car_color_id"
                class="car-form__select"
            >
                <option :value="null">{{ $t('seleccionarColor') }}</option>
                <option
                    v-for="color in catalogColors"
                    :key="color.id"
                    :value="color.id"
                >
                    {{ color.name }}
                </option>
            </select>
        </AppField>
    </div>
</template>

<script>
import CatalogCombobox from './CatalogCombobox.vue';
import AppField from '../ui/AppField.vue';
import AppInput from '../ui/AppInput.vue';
import {
    CAR_YEAR_MIN,
    CATALOG_OTHER_VALUE,
    getCarYearMax
} from '../../utils/carFields.js';

export default {
    name: 'car-form',
    components: {
        CatalogCombobox,
        AppField,
        AppInput
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
        },
        patenteDisabled: {
            type: Boolean,
            default: false
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
.car-form__select {
    width: 100%;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    margin: 0;
    padding: var(--ds-input-padding-y, 0.75rem) var(--ds-input-padding-x, 1rem);
    color: var(--ds-input-text, #22211f);
    font-family: inherit;
    font-size: var(--ds-input-font-size, 1rem);
    line-height: 1.3;
    box-sizing: border-box;
}

.car-form__select:focus {
    outline: none;
}

.car-form__select option {
    color: #333;
    background: #fff;
}
</style>
