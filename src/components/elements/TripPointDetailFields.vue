<template>
    <div v-if="visible" class="trip-point-details">
        <div
            v-if="showPuntoPartida"
            class="trip_point-detail"
            :class="{ 'trip-error': puntoPartidaError.state }"
        >
            <AppInput
                :label="$t('puntoDePartida')"
                :id="puntoPartidaId"
                :placeholder="$t('barrioOPuntoEncuentroPublico')"
                :model-value="puntoPartida"
                maxlength="255"
                :error="puntoPartidaError.state ? puntoPartidaError.message : ''"
                @update:modelValue="$emit('update:puntoPartida', $event)"
            />
            <p
                v-if="showPuntoPartidaPersonalAddressWarning"
                class="trip_point-detail-warning"
            >
                {{ $t('puntoDetalleAdvertenciaDireccionPersonal') }}
            </p>
        </div>
        <div
            v-if="showPuntoLlegada"
            class="trip_point-detail"
            :class="{ 'trip-error': puntoLlegadaError.state }"
        >
            <AppInput
                :label="$t('puntoDeLlegada')"
                :id="puntoLlegadaId"
                :placeholder="$t('barrioOPuntoEncuentroPublico')"
                :model-value="puntoLlegada"
                maxlength="255"
                :error="puntoLlegadaError.state ? puntoLlegadaError.message : ''"
                @update:modelValue="$emit('update:puntoLlegada', $event)"
            />
            <p
                v-if="showPuntoLlegadaPersonalAddressWarning"
                class="trip_point-detail-warning"
            >
                {{ $t('puntoDetalleAdvertenciaDireccionPersonal') }}
            </p>
        </div>
    </div>
</template>

<script>
import AppInput from '../ui/AppInput.vue';
import {
    shouldShowTripPointDetailInputs,
    shouldShowPuntoPartidaInput,
    shouldShowPuntoLlegadaInput,
    tripPointDetailContainsNumber
} from '../../utils/tripPointDetailValidation.js';

export default {
    name: 'TripPointDetailFields',
    components: {
        AppInput
    },
    props: {
        points: {
            type: Array,
            required: true
        },
        fields: {
            type: String,
            default: 'both',
            validator: (value) => ['both', 'partida', 'llegada'].includes(value)
        },
        puntoPartida: {
            type: String,
            default: ''
        },
        puntoLlegada: {
            type: String,
            default: ''
        },
        puntoPartidaError: {
            type: Object,
            required: true
        },
        puntoLlegadaError: {
            type: Object,
            required: true
        },
        idPrefix: {
            type: String,
            default: 'trip-point-detail'
        }
    },
    emits: ['update:puntoPartida', 'update:puntoLlegada'],
    computed: {
        showPuntoPartida() {
            if (this.fields === 'llegada') {
                return false;
            }
            return shouldShowPuntoPartidaInput(this.points);
        },
        showPuntoLlegada() {
            if (this.fields === 'partida') {
                return false;
            }
            return shouldShowPuntoLlegadaInput(this.points);
        },
        visible() {
            if (this.fields === 'partida') {
                return this.showPuntoPartida;
            }
            if (this.fields === 'llegada') {
                return this.showPuntoLlegada;
            }
            return shouldShowTripPointDetailInputs(this.points);
        },
        puntoPartidaId() {
            return `${this.idPrefix}-partida`;
        },
        puntoLlegadaId() {
            return `${this.idPrefix}-llegada`;
        },
        showPuntoPartidaPersonalAddressWarning() {
            return tripPointDetailContainsNumber(this.puntoPartida);
        },
        showPuntoLlegadaPersonalAddressWarning() {
            return tripPointDetailContainsNumber(this.puntoLlegada);
        }
    }
};
</script>

<style scoped>
.trip-point-details {
    margin-top: 0.75rem;
}

.trip_point-detail + .trip_point-detail {
    margin-top: 0.5rem;
}

.trip_point-detail .error {
    display: block;
    margin-top: 0.35rem;
    margin-bottom: 0.4em;
    color: var(--main-error, #d72521);
    font-size: 0.875rem;
    font-weight: bold;
}

.trip_point-detail-warning {
    margin: 0.35rem 0 0;
    color: #856404;
    font-size: 0.875rem;
}
</style>
