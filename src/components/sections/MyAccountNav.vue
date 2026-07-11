<template>
    <aside class="my-account-nav" aria-label="my-account">
        <h1 class="my-account-nav__title">{{ $t('miCuenta') }}</h1>

        <section
            class="my-account-nav__section"
            v-for="section in desktopSections"
            :key="section.id"
        >
            <button
                type="button"
                class="my-account-nav__section-toggle"
                :aria-expanded="isSectionExpanded(section.id)"
                @click="toggleSection(section.id)"
            >
                <span>{{ $t(section.labelKey) }}</span>
                <i
                    :class="[
                        'fa',
                        isSectionExpanded(section.id)
                            ? 'fa-chevron-down'
                            : 'fa-chevron-right'
                    ]"
                    aria-hidden="true"
                ></i>
            </button>
            <div
                class="my-account-nav__section-items"
                v-show="isSectionExpanded(section.id)"
            >
                <template v-for="item in section.items" :key="item.id">
                    <div
                        v-if="item.localeSwitcher"
                        class="my-account-nav__item my-account-nav__locale"
                    >
                        <i :class="['fa', item.icon]" aria-hidden="true"></i>
                        <span class="my-account-nav__item-label">{{
                            $t(item.labelKey)
                        }}</span>
                        <span class="my-account-nav__item-value">{{
                            item.value
                        }}</span>
                        <span class="my-account-nav__locale-switch">
                            <a
                                href="#"
                                :class="{ active: $i18n.locale === 'arg' }"
                                @click.prevent="setLocale('arg')"
                                >Español</a
                            >
                            <span class="my-account-nav__locale-sep">·</span>
                            <a
                                href="#"
                                :class="{ active: $i18n.locale === 'en' }"
                                @click.prevent="setLocale('en')"
                                >English</a
                            >
                        </span>
                    </div>
                    <component
                        v-else
                        :is="itemTag(item)"
                        class="my-account-nav__item"
                        :class="{
                            'my-account-nav__item--active': isItemActive(item),
                            'my-account-nav__item--placeholder': item.placeholder
                        }"
                        v-bind="itemProps(item)"
                    >
                        <i :class="['fa', item.icon]" aria-hidden="true"></i>
                        <span class="my-account-nav__item-label">{{
                            $t(item.labelKey)
                        }}</span>
                    </component>
                </template>
            </div>
        </section>

        <div class="my-account-nav__actions">
            <button
                type="button"
                class="my-account-nav__item my-account-nav__item--logout"
                v-if="!isFacebokApp"
                @click="logout"
            >
                <i class="fa fa-sign-out" aria-hidden="true"></i>
                <span class="my-account-nav__item-label">{{
                    $t('cerrarSesion')
                }}</span>
            </button>
            <router-link
                class="my-account-nav__delete"
                :to="deleteAccountRoute"
                v-if="!isFacebokApp"
            >
                <i class="fa fa-trash-o" aria-hidden="true"></i>
                {{ $t('eliminarCuenta') }}
            </router-link>
        </div>
    </aside>
</template>

<script>
import { mapState } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { useDeviceStore } from '../../stores/device';
import {
    DESKTOP_DELETE_ACCOUNT_ROUTE,
    getMyAccountDesktopExpandedSection,
    getMyAccountDesktopSections,
    isMyAccountDesktopItemActive
} from '../../utils/myAccountDesktopSections';
import { UserApi } from '../../services/api';
import {
    persistLocaleChoice,
    syncLocaleToBackend
} from '../../utils/userLocale.js';

const userApi = new UserApi();

export default {
    name: 'myAccountNav',
    data() {
        return {
            manualExpandedSection: null
        };
    },
    computed: {
        ...mapState(useAuthStore, {
            config: 'appConfig',
            logged: 'checkLogin'
        }),
        ...mapState(useDeviceStore, {
            isFacebokApp: 'isFacebokApp'
        }),
        desktopSections() {
            return getMyAccountDesktopSections(
                this.config,
                this.$i18n.locale
            );
        },
        routeExpandedSection() {
            return getMyAccountDesktopExpandedSection(this.$route.name);
        },
        deleteAccountRoute() {
            return DESKTOP_DELETE_ACCOUNT_ROUTE;
        }
    },
    watch: {
        '$route.name'() {
            this.manualExpandedSection = null;
        }
    },
    methods: {
        isSectionExpanded(sectionId) {
            const expanded =
                this.manualExpandedSection || this.routeExpandedSection;
            return expanded === sectionId;
        },
        toggleSection(sectionId) {
            this.manualExpandedSection = sectionId;
        },
        isItemActive(item) {
            return isMyAccountDesktopItemActive(item, this.$route.name);
        },
        logout() {
            useAuthStore().logout();
        },
        setLocale(locale) {
            this.$root.$i18n.locale = locale;
            persistLocaleChoice(locale);
            syncLocaleToBackend(userApi, locale, this.logged).catch(() => {});
        },
        itemTag(item) {
            if (item.href) {
                return 'a';
            }
            if (item.route) {
                return 'router-link';
            }
            return 'span';
        },
        itemProps(item) {
            if (item.href) {
                return { href: item.href, target: '_blank', rel: 'noopener' };
            }
            if (item.route) {
                return { to: item.route };
            }
            return { 'aria-disabled': 'true' };
        }
    }
};
</script>

<style scoped>
.my-account-nav {
    color: #333;
    background: #fff;
    border-radius: 12px;
    padding: 1.25rem 1rem 1rem;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}
.my-account-nav__title {
    margin: 0 0 1rem;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.2;
    color: #333;
}
.my-account-nav__section {
    border-top: 1px solid #ececec;
}
.my-account-nav__section-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.85rem 0.25rem;
    border: 0;
    background: transparent;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #888;
    cursor: pointer;
    text-align: left;
}
.my-account-nav__section-toggle > .fa {
    font-size: 0.7rem;
    color: #aaa;
}
.my-account-nav__section-items {
    padding-bottom: 0.35rem;
}
.my-account-nav__item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 0.75rem;
    margin: 0.1rem 0;
    border-radius: 8px;
    color: #333;
    text-decoration: none;
}
.my-account-nav__item:hover,
.my-account-nav__item:focus {
    color: #111;
    text-decoration: none;
    background: #f7f7f7;
}
.my-account-nav__item--active {
    background: #f0f0f0;
    font-weight: 600;
    color: #111;
}
.my-account-nav__item--placeholder {
    color: #999;
    pointer-events: none;
}
.my-account-nav__item > .fa:first-child {
    width: 18px;
    text-align: center;
    color: #666;
    font-size: 1rem;
    flex-shrink: 0;
}
.my-account-nav__item-label {
    flex: 1;
    font-size: 0.95rem;
    line-height: 1.3;
}
.my-account-nav__item-value {
    color: #999;
    font-size: 0.85rem;
    margin-right: 0.25rem;
}
.my-account-nav__locale {
    flex-wrap: wrap;
}
.my-account-nav__locale-switch {
    width: 100%;
    padding-left: calc(18px + 0.75rem);
    font-size: 0.85rem;
}
.my-account-nav__locale-switch a {
    color: #666;
    text-decoration: none;
}
.my-account-nav__locale-switch a.active {
    color: #333;
    font-weight: 700;
}
.my-account-nav__locale-sep {
    margin: 0 0.35rem;
    color: #999;
}
.my-account-nav__actions {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid #ececec;
}
.my-account-nav__item--logout {
    width: 100%;
    border: 0;
    background: transparent;
    cursor: pointer;
    font: inherit;
    text-align: left;
    color: #666;
}
.my-account-nav__item--logout:hover,
.my-account-nav__item--logout:focus {
    color: #333;
    background: #f7f7f7;
}
.my-account-nav__item--logout > .fa:first-child {
    color: #666;
}
.my-account-nav__delete {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.35rem;
    padding: 0.65rem 0.75rem;
    color: #e53935;
    font-size: 0.9rem;
    text-decoration: none;
}
.my-account-nav__delete:hover,
.my-account-nav__delete:focus {
    text-decoration: underline;
}
</style>
