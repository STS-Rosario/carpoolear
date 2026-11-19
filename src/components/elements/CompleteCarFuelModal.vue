<template>
    <modal v-if="visible" @close="onClose">
        <template #header>
            <h4>{{ $t('fuelGateTitle') }}</h4>
        </template>
        <template #body>
            <div class="complete-car-fuel-modal">
                <CarFuelFields
                    :entry="form"
                    :show-subtitle="false"
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
import CarFuelFields from './CarFuelFields.vue';
import AppButton from '../ui/AppButton.vue';
import { useCarsStore } from '../../stores/car';
import {
    buildCarFormFromCar,
    carFormMissingFieldKeys,
    carPayloadFromForm,
    hasCarFuelProfile
} from '../../utils/carFields.js';

export default {
    name: 'complete-car-fuel-modal',
    components: {
        modal,
        CarFuelFields,
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
            saving: false,
            error: ''
        };
    },
    watch: {
        visible(value) {
            if (value && this.car) {
                this.form = buildCarFormFromCar(this.car);
                this.error = '';
            }
        }
    },
    methods: {
        onClose() {
            this.$emit('close');
        },
        async save() {
            this.error = '';

            if (!hasCarFuelProfile(this.form)) {
                const missing = carFormMissingFieldKeys(this.form).filter(
                    (key) => key === 'combustible' || key === 'consumo'
                );
                this.error = this.$t('autosDatosIncompletos', {
                    fields: missing.map((key) => this.$t(key)).join(', ')
                });
                return;
            }

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
