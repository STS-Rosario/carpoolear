<template>
    <div
        v-if="open"
        class="changelog-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="$t('ultimosCambios')"
    >
        <div class="changelog-modal-backdrop" @click="close" />
        <div class="changelog-modal-dialog">
            <button
                type="button"
                class="changelog-modal-close"
                :aria-label="$t('cerrar')"
                @click.stop="close"
            >
                <i class="fa fa-times" aria-hidden="true"></i>
            </button>

            <h2 class="changelog-modal-title">{{ $t('ultimosCambios') }}</h2>

            <div
                class="changelog-modal-body message_text message_text--markdown"
                v-html="bodyHtml"
            />
        </div>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { useAuthStore } from '../stores/auth';
import { useRootStore } from '../stores/root';
import { useChangelogStore } from '../stores/changelog';
import { markdownToHtml } from '../services/markdown';
import {
    shouldShowChangelogModal,
    markChangelogSeenForVersion
} from '../utils/changelogPrompt';
import { getChangelogAppVersion } from '../utils/changelogAppVersion';

export default {
    name: 'ChangelogModal',
    props: {
        suppress: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            entry: null,
            loading: false,
            dismissed: false,
            fetchAttempted: false
        };
    },
    computed: {
        ...mapState(useAuthStore, {
            logged: 'checkLogin'
        }),
        appVersion() {
            const fallback =
                typeof window !== 'undefined' && window.appVersion
                    ? window.appVersion
                    : '';
            return getChangelogAppVersion(useRootStore().appVersionInfo, fallback);
        },
        eligible() {
            return (
                this.logged &&
                !this.suppress &&
                !this.dismissed &&
                this.appVersion &&
                shouldShowChangelogModal(this.appVersion)
            );
        },
        open() {
            return this.eligible && !!this.entry;
        },
        bodyHtml() {
            return markdownToHtml((this.entry && this.entry.body_markdown) || '');
        }
    },
    watch: {
        eligible: {
            immediate: true,
            handler(shouldLoad) {
                if (shouldLoad && !this.fetchAttempted) {
                    this.loadChangelog();
                }
            }
        },
        appVersion() {
            this.resetForVersionChange();
        }
    },
    methods: {
        resetForVersionChange() {
            this.entry = null;
            this.fetchAttempted = false;
            this.dismissed = false;
        },
        loadChangelog() {
            if (!this.appVersion || this.fetchAttempted) return;
            this.fetchAttempted = true;
            this.loading = true;
            useChangelogStore()
                .fetchForVersion(this.appVersion)
                .then((data) => {
                    this.entry = data;
                })
                .catch(() => {
                    this.entry = null;
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        close() {
            if (this.appVersion) {
                markChangelogSeenForVersion(this.appVersion);
            }
            this.dismissed = true;
            this.entry = null;
        }
    }
};
</script>

<style scoped>
.changelog-modal {
    position: fixed;
    inset: 0;
    z-index: 9985;
    pointer-events: none;
}

.changelog-modal-backdrop {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.45);
    pointer-events: auto;
}

.changelog-modal-dialog {
    position: absolute;
    right: 16px;
    bottom: 16px;
    width: min(420px, calc(100vw - 32px));
    max-height: min(70vh, 520px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    padding: 20px 20px 16px;
    pointer-events: auto;
}

.changelog-modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    border: 0;
    background: transparent;
    font-size: 1.25rem;
    line-height: 1;
    color: #333;
    padding: 4px;
}

.changelog-modal-title {
    margin: 0 2rem 12px 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
}

.changelog-modal-body {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    margin: 0;
    color: #333;
}
</style>
