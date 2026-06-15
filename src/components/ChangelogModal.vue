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

            <div class="changelog-modal-scroll">
                <h2 class="changelog-modal-title">{{ $t('ultimosCambios') }}</h2>

                <p class="changelog-modal-intro">{{ $t('changelogModalIntro') }}</p>

                <template v-if="navigationMode">
                    <section
                        v-for="entry in navigationEntries"
                        :key="entry.id"
                        class="changelog-modal-entry"
                    >
                        <h3 class="changelog-modal-version">
                            {{ formatEntryVersionHeading(entry.version) }}
                        </h3>
                        <MarkdownPreview
                            class="changelog-modal-body"
                            :source="entry.body_markdown"
                        />
                    </section>
                </template>
                <template v-else>
                    <h3 class="changelog-modal-version">{{ versionHeading }}</h3>

                    <MarkdownPreview class="changelog-modal-body" :source="entryBody" />
                </template>
            </div>

            <div class="changelog-modal-footer">
                <a
                    v-if="!navigationMode"
                    href="#"
                    class="changelog-modal-view-previous"
                    @click.prevent="openFromNavigation"
                >
                    {{ $t('changelogModalViewPrevious') }}
                </a>
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
import bus from '../services/bus-event';
import {
    shouldShowChangelogModal,
    markChangelogSeenForVersion
} from '../utils/changelogPrompt';
import { formatChangelogVersionHeading, getChangelogAppVersion } from '../utils/changelogAppVersion';
import { sortChangelogsBySemverDesc } from '../utils/changelogSort';

const CHANGELOG_OPEN_EVENT = 'changelog:open';

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
            forcedOpen: false,
            navigationMode: false,
            navigationEntries: [],
            dismissed: false
        };
    },
    computed: {
        ...mapState(useAuthStore, {
            logged: 'checkLogin'
        }),
        ...mapState(useChangelogStore, {
            entry: 'currentEntry'
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
        autoEligible() {
            return (
                this.logged &&
                !this.suppress &&
                !this.dismissed &&
                this.appVersion &&
                shouldShowChangelogModal(this.appVersion)
            );
        },
        open() {
            if (this.suppress) {
                return false;
            }
            if (this.navigationMode && this.forcedOpen) {
                return this.logged && this.navigationEntries.length > 0;
            }
            if (!this.entry) {
                return false;
            }
            return this.autoEligible;
        },
        entryBody() {
            return (this.entry && this.entry.body_markdown) || '';
        },
        availabilityProbeKey() {
            return `${this.logged}-${this.appVersion}`;
        }
    },
    watch: {
        autoEligible: {
            immediate: true,
            handler(shouldLoad) {
                if (shouldLoad) {
                    this.loadChangelog();
                }
            }
        },
        availabilityProbeKey: {
            immediate: true,
            handler() {
                this.probeAvailability();
            }
        },
        appVersion() {
            this.resetForVersionChange();
        }
    },
    mounted() {
        bus.on(CHANGELOG_OPEN_EVENT, this.openFromNavigation);
    },
    beforeUnmount() {
        bus.off(CHANGELOG_OPEN_EVENT, this.openFromNavigation);
    },
    methods: {
        resetForVersionChange() {
            this.forcedOpen = false;
            this.navigationMode = false;
            this.navigationEntries = [];
            this.dismissed = false;
            const store = useChangelogStore();
            store.currentEntry = null;
            store.probedVersion = null;
        },
        probeAvailability() {
            if (!this.logged) return;
            const store = useChangelogStore();
            store.probePublicList();
            if (this.appVersion) {
                store.probeForVersion(this.appVersion);
            }
        },
        loadChangelog() {
            if (!this.appVersion) return;
            return useChangelogStore().fetchForVersion(this.appVersion);
        },
        openFromNavigation() {
            if (!this.logged) return;
            this.navigationMode = true;
            this.forcedOpen = true;
            this.dismissed = false;
            useChangelogStore()
                .fetchAll()
                .then((entries) => {
                    this.navigationEntries = sortChangelogsBySemverDesc(entries);
                    if (!this.navigationEntries.length) {
                        this.forcedOpen = false;
                        this.navigationMode = false;
                    }
                })
                .catch(() => {
                    this.forcedOpen = false;
                    this.navigationMode = false;
                    this.navigationEntries = [];
                });
        },
        formatEntryVersionHeading(version) {
            return formatChangelogVersionHeading(version);
        },
        close() {
            if (this.appVersion) {
                markChangelogSeenForVersion(this.appVersion);
            }
            this.forcedOpen = false;
            this.navigationMode = false;
            this.navigationEntries = [];
            this.dismissed = true;
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
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    padding: 20px 20px 16px;
    pointer-events: auto;
}

.changelog-modal-scroll {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-right: 4px;
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

.changelog-modal-entry + .changelog-modal-entry {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid #e8e8e8;
}

.changelog-modal-version {
    margin: 0 0 12px;
    font-size: 1.15rem;
    font-weight: 600;
    color: #036686;
}

.changelog-modal-body {
    margin: 0 0 4px;
    color: #333;
}

.changelog-modal-footer {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 12px;
}

.changelog-modal-view-previous {
    font-size: 1.1rem;
    font-weight: 600;
    color: #036686;
    text-decoration: none;
}

.changelog-modal-view-previous:hover,
.changelog-modal-view-previous:focus {
    text-decoration: underline;
}

.changelog-modal-ok {
    min-width: 88px;
    margin-left: auto;
}
</style>
