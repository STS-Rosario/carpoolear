<template>
    <header class="header header-component">
        <IdentityValidationCountdownBanner />
        <PendingRatingsBanner />
        <div
            class="mobile-header-bar visible-xs"
            v-if="$route.name !== 'mobile-menu'"
            :class="{
                'mobile-header-bar--with-ratings': headerRatings,
                'mobile-header-bar--branded': showBrandedMobileHeader
            }"
        >
            <template v-if="showBrandedMobileHeader">
                <div class="mobile-header-bar__brand">
                    <router-link
                        :to="{ name: 'trips', query: { clearSearch: 'true' } }"
                        v-on:click.native="tripsClick"
                        class="mobile-header-bar__logo-link"
                    >
                        <img
                            :src="header_logo"
                            alt=""
                            class="mobile-header-bar__logo"
                        />
                    </router-link>
                </div>
                <div class="mobile-header-bar__trailing">
                    <div
                        class="mobile-header-bar__actions"
                        v-if="logged"
                    >
                        <span
                            class="mobile-header-bar__action"
                            @click="toNotifications"
                            aria-label="Notificaciones"
                        >
                            <svgItem size="22" icon="bell"></svgItem>
                            <span
                                class="mobile-header-bar__badge"
                                v-if="notificationsCount > 0"
                            ></span>
                        </span>
                    </div>
                    <AppButton
                        v-if="!logged"
                        class="mobile-header-bar__donate"
                        variant="header-create"
                        size="sm"
                        :to="{ name: 'login' }"
                    >
                        {{ $t('iniciarSesion') }}
                    </AppButton>
                    <AppButton
                        v-else-if="!shouldHideDonationOnIOSCapacitor(user)"
                        class="mobile-header-bar__donate"
                        variant="header-donate"
                        size="sm"
                        href="/aportar"
                    >
                        {{ $t('donar') }}
                        <template #iconRight>
                            <img
                                :src="gift_icon"
                                alt=""
                                class="app-button__gift-icon"
                            />
                        </template>
                    </AppButton>
                </div>
            </template>
            <template v-else>
            <div class="mobile-header-bar__section mobile-header-bar__icon">
                <span v-if="showLogo">
                    <router-link
                        :to="{ name: 'trips', query: { clearSearch: 'true' } }"
                        v-on:click.native="tripsClick"
                    >
                        <img :src="app_logo" />
                    </router-link>
                </span>
                <template
                    v-else
                    v-for="item in leftHeaderButton"
                    :key="item.id"
                >
                    <span v-if="item.show" @click="onClick(item)">
                        <i :class="'fa ' + item.icon" aria-hidden="true"></i>
                    </span>
                </template>
            </div>
            <div
                class="mobile-header-bar__section mobile-header-bar__title"
                :class="[
                    subTitle !== '' ? 'header--with-subtitle' : '',
                    headerRatings ? 'header--with-ratings' : '',
                    actionbarTitleWidthClass
                ]"
            >
                <div
                    class="header--image circle-box"
                    v-imgSrc="imgTitle"
                    v-show="imgTitle"
                ></div>
                <span v-if="!titleLink.name" class="header--title">{{
                    title
                }}</span>
                <router-link
                    v-if="titleLink.name"
                    :to="{ name: titleLink.name, params: titleLink.params }"
                    class="header--title"
                >
                    <span>{{ title }}</span>
                </router-link>
                <span class="header--subtitle">{{ subTitle }}</span>
                <UserRatingsCounts
                    v-if="headerRatings"
                    :ratings="headerRatings"
                    class="header--ratings"
                />
            </div>
            <div class="mobile-header-bar__section mobile-header-bar__icon mobile-header-bar__icon--right">
                <template v-for="item in mobileUtilityHeaderButtons" :key="item.id">
                    <span v-if="item.show" @click="onClick(item)">
                        <i :class="'fa ' + item.icon" aria-hidden="true"></i>
                    </span>
                </template>
                <div
                    class="mobile-header-bar__actions"
                    v-if="isMobile && logged"
                >
                    <span
                        class="mobile-header-bar__action"
                        @click="toNotifications"
                        aria-label="Notificaciones"
                    >
                        <svgItem size="22" icon="bell"></svgItem>
                        <span
                            class="mobile-header-bar__badge"
                            v-if="notificationsCount > 0"
                        ></span>
                    </span>
                </div>
                <div class="dropdown-right" v-if="showMenu && !isMobile">
                    <dropdown type="icon">
                        <template #button>
                            <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
                        </template>
                        <li>
                            <router-link tag="a" :to="{ name: 'acerca_de' }">
                                {{ $t('acercaDe') }}
                            </router-link>
                        </li>
                        <li>
                            <router-link :to="{ name: 'terms' }" tag="a">
                                {{ $t('tyc') }}
                            </router-link>
                        </li>
                        <li role="separator" class="divider"></li>
                        <li>
                            <a @click="setLocale('arg')">Español</a>
                        </li>
                        <li>
                            <a @click="setLocale('en')">English</a>
                        </li>
                        <li v-if="user">
                            <router-link
                                :to="{ name: 'profile', params: { id: 'me' } }"
                            >
                                {{ $t('perfil') }}
                            </router-link>
                        </li>
                        <!-- /soporte (mesa de ayuda), mobile -->
                        <li v-if="user">
                            <router-link :to="{ name: 'tickets' }">{{
                                $t('soporte')
                            }}</router-link>
                        </li>
                        <li v-if="showChangelogNav">
                            <a @click="openChangelog">{{ $t('ultimosCambios') }}</a>
                        </li>
                        <li
                            v-if="user"
                            role="separator"
                            class="divider"
                        ></li>
                        <li v-if="user">
                            <a @click="logout" v-if="!isFacebokApp">{{
                                $t('cerrarSesion')
                            }}</a>
                        </li>
                    </dropdown>
                </div>
                </div>
            </template>
        </div>
        <div class="header_content hidden-xs">
            <div class="header_panel-left" v-if="logoHeaderVisibility">
                <router-link
                    :to="{ name: 'trips', query: { clearSearch: 'true' } }"
                    v-on:click.native="tripsClick"
                    class="header_logo-link"
                >
                    <img
                        :src="header_logo"
                        alt=""
                        class="header_logo-image"
                    />
                </router-link>
                <AppButton
                    v-if="!shouldHideDonationOnIOSCapacitor(user)"
                    class="header_donate-btn"
                    variant="header-donate"
                    size="sm"
                    href="/aportar"
                >
                    {{ $t('donar') }}
                    <template #iconRight>
                        <img
                            :src="gift_icon"
                            alt=""
                            class="app-button__gift-icon"
                        />
                    </template>
                </AppButton>
            </div>
            <nav class="header_panel-center" v-if="logged" aria-label="main">
                <router-link
                    class="header_nav-link"
                    :class="{
                        'header_nav-link--active': isDesktopNavActive('trips')
                    }"
                    :to="{ name: 'trips', query: { clearSearch: 'true' } }"
                    v-on:click.native="tripsClick"
                >
                    {{ $t('inicio') }}
                </router-link>
                <router-link
                    class="header_nav-link header_nav-my-trips"
                    :class="{
                        'header_nav-link--active': isDesktopNavActive('my-trips')
                    }"
                    :to="{ name: 'my-trips' }"
                >
                    {{ $t('misViajes') }}
                    <span class="badge" v-if="myTripsCount > 0">
                        {{ myTripsCount }}
                    </span>
                </router-link>
                <router-link
                    class="header_nav-link header_nav-messages"
                    :class="{
                        'header_nav-link--active':
                            isDesktopNavActive('conversations')
                    }"
                    :to="{ name: 'conversations-list' }"
                >
                    {{ $t('mensajes') }}
                    <span class="badge" v-if="messagesCount > 0">
                        {{ messagesCount }}
                    </span>
                </router-link>
            </nav>
            <div class="header_panel-right">
                <dropdown type="link" v-if="!logged">
                    <template #button>
                        {{ currentLocaleShortLabel }}
                    </template>
                    <li>
                        <a @click="setLocale('arg')">Español</a>
                    </li>
                    <li>
                        <a @click="setLocale('en')">English</a>
                    </li>
                </dropdown>
                <template v-if="!logged">
                    <AppButton
                        class="header_auth-btn"
                        variant="header-create"
                        size="sm"
                        :to="{ name: 'login' }"
                    >
                        {{ $t('iniciarSesion') }}
                    </AppButton>
                    <AppButton
                        class="header_auth-btn"
                        variant="header-outline"
                        size="sm"
                        :to="{ name: 'register' }"
                    >
                        {{ $t('RegistrarNuevoUsuario') }}
                    </AppButton>
                </template>

                <AppButton
                    v-if="logged"
                    id="btn-create-trip"
                    class="header_create-trip-btn"
                    variant="header-create"
                    size="sm"
                    icon-left="fa fa-plus"
                    :to="{ name: 'new-trip' }"
                >
                    {{ $t('crearViaje') }}
                </AppButton>
                <span
                    class="header_notifications"
                    @click="toNotifications"
                    v-if="logged"
                    aria-label="Notificaciones"
                >
                    <svgItem size="22" icon="bell"></svgItem>
                    <span class="badge" v-if="notificationsCount > 0">
                        {{ notificationsCount }}
                    </span>
                </span>
                <header-menu-dropdown v-if="logged" />
            </div>
        </div>
    </header>
</template>

<script>
import { mapState } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { useNotificationsStore } from '../../stores/notifications';
import { useActionbarsStore } from '../../stores/actionbars';
import { useDeviceStore } from '../../stores/device';
import { useTripsStore } from '../../stores/trips';
import { useChangelogStore } from '../../stores/changelog';
import dropdown from '../Dropdown';
import router from '../../router';
import bus from '../../services/bus-event.js';
import IdentityValidationCountdownBanner from '../IdentityValidationCountdownBanner.vue';
import UserRatingsCounts from '../elements/UserRatingsCounts.vue';
import PendingRatingsBanner from '../PendingRatingsBanner.vue';
import HeaderMenuDropdown from './HeaderMenuDropdown.vue';
import svgItem from '../SvgItem';
import AppButton from '../ui/AppButton.vue';
import { shouldHideDonationOnIOSCapacitor } from '../../services/capacitor.js';
import { UserApi } from '../../services/api';
import {
    persistLocaleChoice,
    syncLocaleToBackend,
} from '../../utils/userLocale.js';
import { installAppHeaderOffsetObserver } from '../../utils/appHeaderOffset.js';

const userApi = new UserApi();

export default {
    name: 'headerApp',

    data() {
        return {
            header_logo: process.env.ROUTE_BASE + 'img/logo2.svg',
            gift_icon: process.env.ROUTE_BASE + 'img/gift.svg',
            app_logo:
                process.env.ROUTE_BASE +
                'img/' +
                process.env.TARGET_APP +
                '_logo.png'
        };
    },

    mounted() {
        bus.on('header-title-change', this.onHeaderChange);
        this.stopHeaderOffsetObserver = installAppHeaderOffsetObserver(
            this.$el
        );
    },

    beforeUnmount() {
        bus.off('header-title-change', this.onHeaderChange);
        if (this.stopHeaderOffsetObserver) {
            this.stopHeaderOffsetObserver();
        }
    },

    computed: {
        ...mapState(useAuthStore, {
            logged: 'checkLogin',
            user: 'user',
            config: 'appConfig'
        }),
        ...mapState(useNotificationsStore, {
            notificationsCount: 'count',
            messagesCount: 'messagesCount',
            myTripsCount: 'myTripsCount'
        }),
        ...mapState(useActionbarsStore, {
            title: 'title',
            titleLink: 'titleLink',
            subTitle: 'subTitle',
            headerRatings: 'headerRatings',
            imgTitle: 'imgTitle',
            showMenu: 'showMenu',
            leftHeaderButton: 'leftHeaderButton',
            rightHeaderButton: 'rightHeaderButton',
            logoHeaderVisibility: 'headerLogoVisibility'
        }),
        ...mapState(useDeviceStore, {
            isNotLargeDesktop: 'isNotLargeDesktop',
            isFacebokApp: 'isFacebokApp',
            isMobile: 'isMobile'
        }),
        ...mapState(useChangelogStore, {
            hasAnyChangelog: 'hasAnyChangelog'
        }),
        showChangelogNav() {
            return this.logged && this.hasAnyChangelog;
        },

        showLogo() {
            for (let i = 0; i < this.leftHeaderButton.length; i++) {
                if (this.leftHeaderButton[i].show) {
                    return false;
                }
            }
            return true;
        },
        showBrandedMobileHeader() {
            const authShellRoutes = [
                'login',
                'register',
                'reset-password',
                'reset-password-confirm'
            ];
            if (this.isMobile && authShellRoutes.includes(this.$route.name)) {
                return true;
            }
            return this.isMobile && this.showLogo;
        },
        currentLocaleShortLabel() {
            const short = { arg: 'ES', en: 'EN' };
            return short[this.$i18n.locale] || 'ES';
        },
        actionbarTitleWidthClass() {
            const n = this.$route && this.$route.name;
            return n === 'identity_validation' || n === 'identity_validation_manual'
                ? 'mobile-header-bar__title--settings-wide'
                : '';
        },
        mobileUtilityHeaderButtons() {
            if (!this.isMobile) {
                return this.rightHeaderButton;
            }
            return this.rightHeaderButton.filter((item) => item.id !== 'search');
        }
    },

    methods: {
        openChangelog() {
            bus.emit('changelog:open');
        },
        shouldHideDonationOnIOSCapacitor(user) {
            return shouldHideDonationOnIOSCapacitor(user);
        },
        logout() {
            useAuthStore().logout();
        },

        toNotifications() {
            router.push({ name: 'notifications' });
        },

        onClick(item) {
            bus.emit(item.id + '-click');
        },

        tripsClick() {
            useTripsStore().refreshListAction(true);
            useTripsStore().tripsSearch({ is_passenger: false });
        },

        isDesktopNavActive(section) {
            const name = this.$route && this.$route.name;
            if (section === 'trips') {
                return name === 'trips';
            }
            if (section === 'my-trips') {
                return name === 'my-trips';
            }
            if (section === 'conversations') {
                return (
                    name === 'conversations-list' || name === 'conversation-chat'
                );
            }
            return false;
        },

        onHeaderChange() {
            // console.log('header-change', this.title);
        },

        setLocale(locale) {
            this.$root.$i18n.locale = locale;
            persistLocaleChoice(locale);
            syncLocaleToBackend(userApi, locale, this.logged).catch(() => {});
        }
    },
    watch: {
        title(_old, _new) {
        }
    },
    components: {
        dropdown,
        IdentityValidationCountdownBanner,
        UserRatingsCounts,
        PendingRatingsBanner,
        HeaderMenuDropdown,
        svgItem,
        AppButton
    }
};
</script>

<style scoped>
.header_content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-top: var(--ds-header-desktop-padding-y);
    padding-bottom: var(--ds-header-desktop-padding-y);
}
.header_panel-left {
    display: flex !important;
    align-items: center;
    gap: 0.75rem;
    flex-shrink: 0;
    float: none;
    line-height: normal;
}
.header_logo-link {
    display: inline-flex;
    align-items: center;
}
.header_panel-center {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    flex: 1;
    min-width: 0;
}
.header_nav-link {
    position: relative;
    color: #fff;
    text-decoration: none;
    font-weight: 600;
    white-space: nowrap;
    text-transform: none;
    padding-bottom: 0.2rem;
    border-bottom: 2px solid transparent;
}
.header_nav-link:hover,
.header_nav-link:focus {
    color: #fff;
    text-decoration: none;
    opacity: 0.9;
    outline: none;
    box-shadow: none;
    border-bottom: 2px solid #fff;
}
.header_nav-link:focus-visible {
    outline: none;
    box-shadow: none;
}
.header_nav-link--active {
    border-bottom: 2px solid #fff;
}
.header_nav-messages .badge,
.header_nav-my-trips .badge {
    position: absolute;
    top: calc(-0.55rem + 3px);
    right: -0.85rem;
    min-width: 1.15rem;
    height: 1.15rem;
    padding: 0 0.3rem;
    border-radius: 999px;
    background: #e53935;
    color: #fff;
    font-size: 0.7rem;
    font-weight: 700;
    line-height: 1.15rem;
    text-align: center;
}
.header_notifications .badge {
    position: absolute;
    top: calc(-0.55rem + 3px);
    right: calc(-0.85rem + 9px);
    min-width: 1.15rem;
    height: 1.15rem;
    padding: 0 0.3rem;
    border-radius: 999px;
    background: #e53935;
    color: #fff;
    font-size: 0.7rem;
    font-weight: 700;
    line-height: 1.15rem;
    text-align: center;
}
.header_panel-right {
    display: flex !important;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    flex-shrink: 0;
    float: none;
    min-width: auto;
    text-align: right;
    line-height: normal;
}
.header_notifications {
    display: inline-flex;
    align-items: center;
    position: relative;
    padding-left: 10px;
    padding-right: 6px;
    cursor: pointer;
    vertical-align: middle;
    line-height: 0;
}
.header_notifications :deep(svg) {
    fill: #fff;
    display: block;
}
.mobile-header-bar__actions {
    display: inline-flex;
    align-items: center;
    gap: 2.5rem;
    margin-left: 0.5rem;
    padding-right: 1.3rem;
    vertical-align: middle;
}
.mobile-header-bar__action {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    line-height: 0;
    vertical-align: middle;
}
.mobile-header-bar__action :deep(svg) {
    fill: #fff;
    display: block;
}
.mobile-header-bar__badge {
    position: absolute;
    top: -2px;
    right: -4px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #e53935;
}
.mobile-header-bar__icon img {
    margin-bottom: 2px;
    width: 26px;
    margin-left: 0.3em;
}
.header_logo-image {
    display: block;
    height: 2rem;
    width: auto;
}
.header_donate-btn {
    flex-shrink: 0;
}
.header_create-trip-btn {
    flex-shrink: 0;
}
.header_auth-btn {
    flex-shrink: 0;
}
</style>
