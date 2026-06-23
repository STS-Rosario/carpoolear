<template>
    <div v-if="visible" class="trip-point-details">
        <div
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
        </div>
        <div
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
        </div>
    </div>
</template>

<script>
import { shouldShowTripPointDetailInputs } from '../../utils/tripPointDetailValidation.js';

export default {
    name: 'TripPointDetailFields',
    props: {
        points: {
            type: Array,
            required: true
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
        visible() {
            return shouldShowTripPointDetailInputs(this.points);
        },
        puntoPartidaId() {
            return `${this.idPrefix}-partida`;
        },
        puntoLlegadaId() {
            return `${this.idPrefix}-llegada`;
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
</style>
