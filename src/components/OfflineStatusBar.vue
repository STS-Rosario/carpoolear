<template>
    <div
        v-if="networkReady && !networkState"
        class="offline-status-bar"
        role="status"
        aria-live="polite"
    >
        {{ $t('offlineStatusBarMessage') }}
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { useCordovaStore } from '../stores/cordova';

export default {
    name: 'offline-status-bar',
    computed: {
        ...mapState(useCordovaStore, {
            networkReady: 'networkReady',
            networkState: 'networkState'
        })
    }
};
</script>

<style scoped>
.offline-status-bar {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10000;
    padding: 12px 16px;
    background: #d9534f;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.3;
    text-align: center;
}
</style>
