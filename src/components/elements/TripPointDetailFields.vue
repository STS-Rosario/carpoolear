<template>
    <div v-if="visible" class="trip-point-details">
        <div
            v-if="showPuntoPartida"
            class="form-group trip_point-detail"
            :class="{ 'trip-error': puntoPartidaError.state }"
        >
            <label :for="puntoPartidaId" class="control-label">{{
                $t('puntoDePartida')
            }}</label>
            <input
                :id="puntoPartidaId"
                type="text"
                class="form-control"
                :class="{ 'has-error': puntoPartidaError.state }"
                :placeholder="$t('barrioOPuntoEncuentroPublico')"
                :value="puntoPartida"
                maxlength="255"
                @input="$emit('update:puntoPartida', $event.target.value)"
            />
            <span class="error" v-if="puntoPartidaError.state">{{
                puntoPartidaError.message
            }}</span>
            <p
                v-if="showPuntoPartidaPersonalAddressWarning"
                class="trip_point-detail-warning"
            >
                {{ $t('puntoDetalleAdvertenciaDireccionPersonal') }}
            </p>
        </div>
        <div
            v-if="showPuntoLlegada"
            class="form-group trip_point-detail"
            :class="{ 'trip-error': puntoLlegadaError.state }"
        >
            <label :for="puntoLlegadaId" class="control-label">{{
                $t('puntoDeLlegada')
            }}</label>
            <input
                :id="puntoLlegadaId"
                type="text"
                class="form-control"
                :class="{ 'has-error': puntoLlegadaError.state }"
                :placeholder="$t('barrioOPuntoEncuentroPublico')"
                :value="puntoLlegada"
                maxlength="255"
                @input="$emit('update:puntoLlegada', $event.target.value)"
            />
            <span class="error" v-if="puntoLlegadaError.state">{{
                puntoLlegadaError.message
            }}</span>
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
import {
    shouldShowTripPointDetailInputs,
    shouldShowPuntoPartidaInput,
    shouldShowPuntoLlegadaInput,
    tripPointDetailContainsNumber
} from '../../utils/tripPointDetailValidation.js';

export default {
    name: 'TripPointDetailFields',
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
