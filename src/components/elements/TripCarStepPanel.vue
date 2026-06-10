<template>
    <div class="trip-car-step-panel">
        <select
            id="trip-car-select"
            class="form-control trip-car-step-panel__select"
            v-model="selectedCarIdModel"
            :class="{ 'has-error': carSelectionError.state }"
        >
            <option disabled value="">
                {{ $t('elegiPatente') }}
            </option>
            <option
                v-for="car in driverCarsWithPlate"
                :key="car.id"
                :value="car.id"
            >
                {{ formatCarSelectLabel(car) }}
            </option>
        </select>
        <span class="error" v-if="carSelectionError.state">
            {{ carSelectionError.message }}
        </span>

        <button
            type="button"
            class="trip-car-step-panel__add-link"
            @click="showEditor = !showEditor"
        >
            {{ showEditor ? $t('cerrar') : $t('agregarOtroAuto') }}
        </button>

        <div v-if="showEditor" class="trip-car-step-panel__editor">
            <div
                v-for="(entry, index) in editorRows"
                :key="entry.id ? 'car-' + entry.id : 'car-new-' + index"
                class="trip-car-step-panel__row"
            >
                <input
                    maxlength="20"
                    v-model="entry.patente"
                    type="text"
                    class="form-control"
                    :placeholder="$t('patente')"
                />
                <button
                    v-if="canShowRemoveCarRow(entry, editorRows.length)"
                    type="button"
                    class="btn btn-default"
                    :aria-label="$t('eliminarAuto')"
                    @click="removeEditorRow(index)"
                >
                    <i aria-hidden="true" class="fa fa-times"></i>
                </button>
            </div>
            <button
                type="button"
                class="btn btn-default trip-car-step-panel__add-row"
                @click="addEditorRow"
            >
                {{ $t('agregarOtroAuto') }}
            </button>
            <button
                type="button"
                class="btn btn-primary trip-car-step-panel__save"
                :disabled="savingCars"
                @click="saveCars"
            >
                <spinner v-if="savingCars" class="blue"></spinner>
                <span v-else>{{ $t('guardar') }}</span>
            </button>
            <span class="error" v-if="editorError">{{ editorError }}</span>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { useCarsStore } from '../../stores/car';
import { formatCarSelectLabel } from '../../utils/carFields.js';
import {
    buildPatenteRowsFromCars,
    canShowRemoveCarRow,
    activeCarsWithPlate
} from '../../utils/userCars.js';
import spinner from '../Spinner.vue';

export default {
    name: 'trip-car-step-panel',

    components: {
        spinner
    },

    props: {
        selectedCarId: {
            type: [Number, String],
            default: null
        },
        carSelectionError: {
            type: Object,
            required: true
        }
    },

    emits: ['update:selectedCarId', 'cars-updated'],

    data() {
        return {
            showEditor: false,
            editorRows: [{ id: null, patente: '' }],
            editorError: '',
            savingCars: false
        };
    },

    computed: {
        ...mapState(useCarsStore, {
            cars: 'cars'
        }),
        driverCarsWithPlate() {
            return activeCarsWithPlate(this.cars);
        },
        selectedCarIdModel: {
            get() {
                return this.selectedCarId;
            },
            set(value) {
                this.$emit('update:selectedCarId', value);
            }
        }
    },

    watch: {
        cars: {
            immediate: true,
            handler() {
                if (this.showEditor) {
                    this.syncEditorFromStore();
                }
            }
        }
    },

    methods: {
        ...mapActions(useCarsStore, {
            carCreate: 'create',
            carUpdate: 'update',
            carIndex: 'index'
        }),
        canShowRemoveCarRow,
        formatCarSelectLabel,
        syncEditorFromStore() {
            this.editorRows = buildPatenteRowsFromCars(this.cars);
        },
        addEditorRow() {
            this.editorRows.push({ id: null, patente: '' });
        },
        removeEditorRow(index) {
            this.editorRows.splice(index, 1);
            if (this.editorRows.length === 0) {
                this.editorRows.push({ id: null, patente: '' });
            }
        },
        async saveCars() {
            this.editorError = '';
            const rows = this.editorRows
                .map((entry) => ({
                    id: entry.id,
                    patente: (entry.patente || '').trim()
                }))
                .filter((entry) => entry.patente);

            if (!rows.length) {
                this.editorError = this.$t('olvidastePatente');
                return;
            }

            this.savingCars = true;
            try {
                for (const row of rows) {
                    if (row.id) {
                        await this.carUpdate({ id: row.id, patente: row.patente });
                    } else {
                        const created = await this.carCreate({ patente: row.patente });
                        if (created && created.id) {
                            this.$emit('update:selectedCarId', created.id);
                        }
                    }
                }
                await this.carIndex();
                this.$emit('cars-updated');
                this.showEditor = false;
            } catch {
                this.editorError = this.$t('problemaAlCargarElViaje');
            } finally {
                this.savingCars = false;
            }
        }
    }
};
</script>

<style scoped>
.trip-car-step-panel__select {
    margin-bottom: 0.75rem;
}

.trip-car-step-panel__add-link {
    display: block;
    margin: 0 auto 1rem;
    background: none;
    border: none;
    color: inherit;
    text-decoration: underline;
    cursor: pointer;
}

.trip-car-step-panel__editor {
    margin-top: 0.5rem;
    padding-top: 0.75rem;
    border-top: 1px solid #eee;
}

.trip-car-step-panel__row {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.trip-car-step-panel__add-row {
    margin-bottom: 0.75rem;
}

.trip-car-step-panel__save {
    min-width: 120px;
}
</style>
