<template>
    <p v-if="formattedUpdatedAt" class="live-location-updated">
        {{ $t('liveLocationLastUpdated', { datetime: formattedUpdatedAt }) }}
    </p>
</template>

<script>
import { formatLiveLocationUpdatedAt } from '../../utils/liveLocationFormat.js';

export default {
    name: 'LiveLocationLastUpdated',
    props: {
        recordedAt: {
            type: String,
            default: null
        }
    },
    computed: {
        formattedUpdatedAt() {
            return formatLiveLocationUpdatedAt(this.recordedAt);
        }
    }
};
</script>

<style scoped>
.live-location-updated {
    margin: 0.5rem 0 0.75rem;
    font-size: 0.9em;
    color: #666;
}
</style>
