<template>
    <div class="server-down-fullscreen">
        <div class="server-down-fullscreen__inner">
            <h1 class="server-down-fullscreen__title">
                {{ $t('serverDownTitle') }}
            </h1>
            <p class="server-down-fullscreen__lead">
                {{ $t('serverDownLead') }}
            </p>
            <p
                v-if="checking"
                class="server-down-fullscreen__checking"
                role="status"
                aria-live="polite"
            >
                {{ $t('serverDownRetrying') }}
            </p>
            <button
                type="button"
                class="btn btn-primary server-down-fullscreen__retry"
                :disabled="checking"
                @click="onRetry"
            >
                {{ $t('serverDownRetryButton') }}
            </button>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { useServerStatusStore } from '../stores/serverStatus';

export default {
    name: 'server-down-fullscreen',
    computed: {
        ...mapState(useServerStatusStore, {
            checking: 'checking'
        })
    },
    methods: {
        ...mapActions(useServerStatusStore, {
            tryRecover: 'tryRecover'
        }),
        onRetry() {
            this.tryRecover();
        }
    }
};
</script>

<style scoped>
.server-down-fullscreen {
    position: fixed;
    inset: 0;
    z-index: 10001;
    overflow: auto;
    background: #f4f6f8;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    text-align: center;
}

.server-down-fullscreen__inner {
    max-width: 36rem;
}

.server-down-fullscreen__title {
    font-size: 1.75rem;
    font-weight: 600;
    margin: 0 0 1rem;
    color: #1a2b3c;
}

.server-down-fullscreen__lead {
    font-size: 1.05rem;
    margin: 0 0 1.25rem;
    color: #333;
    line-height: 1.5;
}

.server-down-fullscreen__checking {
    margin: 0 0 1rem;
    color: #666;
    font-size: 0.95rem;
}

.server-down-fullscreen__retry {
    min-width: 10rem;
}
</style>
