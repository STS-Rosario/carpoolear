<template>
    <div class="debug-component">
        <h2>{{ $t('debug') }}</h2>

        <div class="form-group">
            <label>{{ $t('debugMode') }}</label>
            <div class="debug-toggle">
                <span class="debug-status">{{ debugEnabled ? $t('debugModeOn') : $t('debugModeOff') }}</span>
                <button
                    type="button"
                    class="btn btn-primary"
                    @click="toggleDebugMode"
                    :aria-label="$t('debugMode')"
                >
                    {{ debugEnabled ? $t('debugModeDisable') : $t('debugModeEnable') }}
                </button>
            </div>
        </div>

        <div v-if="debugInfo" class="form-group">
            <label>{{ $t('debugInfo') }}</label>
            <pre class="debug-info-content" id="debug-info-pre">{{ debugInfo }}</pre>
            <button
                type="button"
                class="btn btn-primary"
                @click="copyToClipboard"
                :disabled="copying"
            >
                {{ copyButtonText }}
            </button>
        </div>

        <div v-else class="form-group">
            <p class="alert alert-info">{{ $t('debugInfoUnavailable') }}</p>
        </div>
    </div>
</template>
<script>
/* jshint esversion: 6 */

import { getInstance, init as initDebugLogger } from '../../services/debug';

export default {
    name: 'Debug',
    data() {
        return {
            debugEnabled: false,
            debugInfo: '',
            copying: false,
            copySuccess: false
        };
    },
    computed: {
        copyButtonText() {
            if (this.copySuccess) return this.$t('debugInfoCopied');
            return this.$t('copyDebugInfo');
        }
    },
    mounted() {
        this.refreshState();
    },
    methods: {
        refreshState() {
            let instance = getInstance();
            if (!instance) {
                initDebugLogger().then(() => {
                    this.refreshState();
                }).catch((err) => {
                    console.error('Debug init failed:', err);
                });
                return;
            }
            this.debugEnabled = instance.isEnabled();
            this.debugInfo = instance.getDebugInfo();
        },
        async toggleDebugMode() {
            let instance = getInstance();
            if (!instance) {
                await initDebugLogger();
                instance = getInstance();
            }
            if (!instance) return;
            try {
                await instance.setEnabled(!this.debugEnabled);
                this.debugEnabled = instance.isEnabled();
                this.debugInfo = instance.getDebugInfo();
            } catch (err) {
                console.error('Toggle debug mode failed:', err);
            }
        },
        async copyToClipboard() {
            const instance = getInstance();
            if (!instance) return;
            const text = instance.getDebugInfo();
            if (!text) return;
            this.copying = true;
            this.copySuccess = false;
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(text);
                    this.copySuccess = true;
                } else {
                    const pre = document.getElementById('debug-info-pre');
                    if (pre) {
                        const range = document.createRange();
                        range.selectNodeContents(pre);
                        const selection = window.getSelection();
                        selection.removeAllRanges();
                        selection.addRange(range);
                        document.execCommand('copy');
                        selection.removeAllRanges();
                        this.copySuccess = true;
                    }
                }
            } catch (err) {
                console.error('Copy failed:', err);
            }
            this.copying = false;
            setTimeout(() => {
                this.copySuccess = false;
            }, 2000);
        }
    }
};
</script>
<style scoped>
.debug-component {
    padding: 1em 0;
}
.debug-toggle {
    display: flex;
    align-items: center;
    gap: 0.5em;
}
.debug-toggle .btn.active {
    font-weight: bold;
}
.debug-info-content {
    max-height: 300px;
    overflow: auto;
    white-space: pre-wrap;
    word-break: break-all;
    font-size: 12px;
    padding: 1em;
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 4px;
}
</style>
