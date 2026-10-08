<template>
    <div class="trips container">
        <div class="col-xs-24">
            <h2>
                {{ $t('calificacionesPendientes') }}
            </h2>
            <div class="request-list">
                <RatePending
                    ref="pending"
                    :rate="sampleRate"
                />
            </div>
        </div>
    </div>
</template>
<script>
import RatePending from './RatePending';
import { RATE_PENDING_PASSENGER_PREVIEW_RATE } from '../utils/ratePendingPassengerPreview.js';

export default {
    name: 'preview-rate-pending-passenger',

    components: {
        RatePending
    },

    data() {
        return {
            sampleRate: RATE_PENDING_PASSENGER_PREVIEW_RATE
        };
    },

    mounted() {
        this.$nextTick(() => {
            if (this.$refs.pending) {
                this.$refs.pending.setRate(1);
            }
        });
    }
};
</script>
