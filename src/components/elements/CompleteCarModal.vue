<template>
    <modal v-if="visible" @close="onClose">
        <template #header>
            <h4>{{ $t('completarDatosAuto') }}</h4>
        </template>
        <template #body>
            <div class="complete-car-modal">
                <p>{{ $t('completarDatosAutoDescripcion') }}</p>
                <CarForm
                    :entry="form"
                    :catalog-brands="catalogBrands"
                    :catalog-models="catalogModels"
                    :catalog-colors="catalogColors"
                    patente-disabled
                    @brand-selection-change="onBrandSelectionChange"
                />
                <p v-if="error" class="error">{{ error }}</p>
            </div>
        </template>
        <template #footer>
            <AppButton
                variant="primary"
                :loading="saving"
                :disabled="saving"
                @click="save"
            >
                {{ $t('guardar') }}
            </AppButton>
        </template>
    </modal>
</template>

<script>
import modal from '../Modal';
import CarForm from './CarForm.vue';
import AppButton from '../ui/AppButton.vue';
import { useCarCatalogStore } from '../../stores/carCatalog';
import { useCarsStore } from '../../stores/car';
import {
    buildCarFormFromCar,
    carPayloadFromForm,
    CATALOG_OTHER_VALUE
} from '../../utils/carFields.js';

export default {
    name: 'complete-car-modal',
    components: {
        modal,
        CarForm,
        AppButton
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
