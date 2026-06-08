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

            <p class="changelog-modal-intro">{{ $t('changelogModalIntro') }}</p>

            <h3 class="changelog-modal-version">{{ versionHeading }}</h3>

            <MarkdownPreview class="changelog-modal-body" :source="entryBody" />

            <div class="changelog-modal-footer">
                <button type="button" class="btn btn-primary changelog-modal-ok" @click="close">
                    {{ $t('changelogModalOk') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { useAuthStore } from '../stores/auth';
import { useRootStore } from '../stores/root';
import { useChangelogStore } from '../stores/changelog';
import MarkdownPreview from './elements/MarkdownPreview.vue';
import {
    shouldShowChangelogModal,
    markChangelogSeenForVersion
} from '../utils/changelogPrompt';
import { formatChangelogVersionHeading, getChangelogAppVersion } from '../utils/changelogAppVersion';

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
        versionHeading() {
            return formatChangelogVersionHeading(this.appVersion);
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
        entryBody() {
            return (this.entry && this.entry.body_markdown) || '';
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
    },
    components: {
        MarkdownPreview
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
    left: 16px;
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
    font-size: 1.75rem;
    font-weight: 700;
    color: #333;
}

.changelog-modal-intro {
    margin: 0 0 12px;
    color: #333;
    font-size: 0.95rem;
    line-height: 1.45;
}

.changelog-modal-version {
    margin: 0 0 12px;
    font-size: 1.15rem;
    font-weight: 600;
    color: #036686;
}

.changelog-modal-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    margin: 0 0 12px;
    color: #333;
}

.changelog-modal-footer {
    flex-shrink: 0;
    text-align: right;
}

.changelog-modal-ok {
    min-width: 88px;
}
</style>
