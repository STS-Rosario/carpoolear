<template>
    <dropdown type="icon" class="header-menu-dropdown">
        <template #button>
            <span class="header-menu-dropdown__trigger">
                <span class="header-menu-dropdown__icon" aria-hidden="true">
                    <svgItem size="26" icon="menu"></svgItem>
                </span>
                <span class="header-menu-dropdown__label">{{ $t('menu') }}</span>
            </span>
        </template>
        <li>
            <router-link
                tag="a"
                class="header-menu-dropdown__item"
                :to="{ name: 'notifications' }"
            >
                <svgItem size="18" icon="bell"></svgItem>
                <span class="header-menu-dropdown__item-label">{{
                    $t('notificaciones')
                }}</span>
                <span class="header-menu-dropdown__badge" v-if="notificationsCount > 0">{{
                    notificationsCount
                }}</span>
            </router-link>
        </li>
        <li>
            <router-link
                tag="a"
                class="header-menu-dropdown__item"
                :to="{ name: 'conversations-list' }"
            >
                <svgItem size="18" icon="message"></svgItem>
                <span class="header-menu-dropdown__item-label">{{
                    $t('mensajes')
                }}</span>
                <span class="header-menu-dropdown__badge" v-if="messagesCount > 0">{{
                    messagesCount
                }}</span>
            </router-link>
        </li>
        <li>
            <router-link
                tag="a"
                class="header-menu-dropdown__item"
                :to="{ name: 'my-trips' }"
            >
                <svgItem size="18" icon="my-trips"></svgItem>
                <span class="header-menu-dropdown__item-label">{{
                    $t('misViajes')
                }}</span>
                <span class="header-menu-dropdown__badge" v-if="myTripsBadgeCount > 0">{{
                    myTripsBadgeCount
                }}</span>
            </router-link>
        </li>
        <li>
            <router-link
                tag="a"
                class="header-menu-dropdown__item"
                :to="{ name: 'my-account' }"
            >
                <svgItem size="18" icon="account"></svgItem>
                <span class="header-menu-dropdown__item-label">{{
                    $t('miCuenta')
                }}</span>
            </router-link>
        </li>
        <li role="separator" class="divider"></li>
        <li>
            <a
                class="header-menu-dropdown__item"
                href="https://carpoolear.com.ar/plataforma-preguntas-frecuentes"
                target="_blank"
                rel="noopener noreferrer"
            >
                <i class="fa fa-question-circle" aria-hidden="true"></i>
                <span class="header-menu-dropdown__item-label">{{
                    $t('footerPreguntasFrecuentes')
                }}</span>
            </a>
        </li>
        <li>
            <router-link
                tag="a"
                class="header-menu-dropdown__item"
                :to="{ name: 'tickets' }"
            >
                <i class="fa fa-life-ring" aria-hidden="true"></i>
                <span class="header-menu-dropdown__item-label">{{
                    $t('soporte')
                }}</span>
            </router-link>
        </li>
        <li>
            <router-link
                tag="a"
                class="header-menu-dropdown__item"
                :to="{ name: 'debug_setting' }"
            >
                <i class="fa fa-bug" aria-hidden="true"></i>
                <span class="header-menu-dropdown__item-label">{{
                    $t('modoDebug')
                }}</span>
            </router-link>
        </li>
        <li role="separator" class="divider"></li>
        <li>
            <router-link
                tag="a"
                class="header-menu-dropdown__item"
                :to="{ name: 'acerca_de' }"
            >
                <i class="fa fa-info-circle" aria-hidden="true"></i>
                <span class="header-menu-dropdown__item-label">{{
                    $t('acercaDe')
                }}</span>
            </router-link>
        </li>
        <li>
            <router-link
                tag="a"
                class="header-menu-dropdown__item"
                :to="{ name: 'terms' }"
            >
                <i class="fa fa-file-text-o" aria-hidden="true"></i>
                <span class="header-menu-dropdown__item-label">{{
                    $t('legales')
                }}</span>
            </router-link>
        </li>
        <li role="separator" class="divider"></li>
        <li class="header-menu-dropdown__locale">
            <span class="header-menu-dropdown__locale-inner">
                <i class="fa fa-globe" aria-hidden="true"></i>
                <span class="header-menu-dropdown__item-label">
                    <a
                        href="#"
                        :class="{ active: $i18n.locale === 'arg' }"
                        @click.prevent="setLocale('arg')"
                        >Español</a
                    >
                    <span class="header-menu-dropdown__locale-sep">·</span>
                    <a
                        href="#"
                        :class="{ active: $i18n.locale === 'en' }"
                        @click.prevent="setLocale('en')"
                        >English</a
                    >
                </span>
            </span>
        </li>
        <li v-if="!isFacebokApp" role="separator" class="divider"></li>
        <li v-if="!isFacebokApp">
            <a class="header-menu-dropdown__item" @click="logout">
                <i class="fa fa-sign-out" aria-hidden="true"></i>
                <span class="header-menu-dropdown__item-label">{{
                    $t('cerrarSesion')
                }}</span>
            </a>
        </li>
    </dropdown>
</template>

<script>
import { mapState } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { useNotificationsStore } from '../../stores/notifications';
import { useDeviceStore } from '../../stores/device';
import dropdown from '../Dropdown';
import svgItem from '../SvgItem';
import { UserApi } from '../../services/api';
import {
    persistLocaleChoice,
    syncLocaleToBackend
} from '../../utils/userLocale.js';

const userApi = new UserApi();

export default {
    name: 'headerMenuDropdown',
    computed: {
        ...mapState(useNotificationsStore, {
            notificationsCount: 'count',
            messagesCount: 'messagesCount',
            myTripsBadgeCount: 'myTripsCount'
        }),
        ...mapState(useAuthStore, {
            logged: 'checkLogin'
        }),
        ...mapState(useDeviceStore, {
            isFacebokApp: 'isFacebokApp'
        })
    },
    methods: {
        logout() {
            useAuthStore().logout();
        },
        setLocale(locale) {
            this.$root.$i18n.locale = locale;
            persistLocaleChoice(locale);
            syncLocaleToBackend(userApi, locale, this.logged).catch(() => {});
        }
    },
    components: {
        dropdown,
        svgItem
    }
};
</script>

<style scoped>
.header-menu-dropdown {
    display: inline-block;
    vertical-align: middle;
    margin-left: 0.5rem;
}
.header-menu-dropdown__trigger {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    vertical-align: middle;
}
.header-menu-dropdown__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
    vertical-align: middle;
}
.header-menu-dropdown__icon :deep(svg) {
    fill: #fff;
    display: block;
}
.header-menu-dropdown__label {
    color: #fff;
    font-size: 1rem;
    line-height: 1;
    vertical-align: middle;
}
.header-menu-dropdown :deep(.btn-icon),
.header-menu-dropdown :deep(.btn-group.open .btn-icon),
.header-menu-dropdown :deep(.btn-icon:hover),
.header-menu-dropdown :deep(.btn-icon:focus),
.header-menu-dropdown :deep(.btn-icon:active) {
    color: #fff;
    background-color: transparent;
    box-shadow: none;
}
.header-menu-dropdown :deep(.btn-group.open .dropdown-toggle) {
    box-shadow: none;
}
.header-menu-dropdown :deep(.dropdown-menu) {
    right: 0;
    left: auto;
    font-size: 1rem;
}
.header-menu-dropdown :deep(.dropdown-menu > li > a.header-menu-dropdown__item) {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    font-size: 1rem;
    padding: 6px 20px;
}
.header-menu-dropdown
    :deep(.dropdown-menu > li > a.header-menu-dropdown__item .svgItem svg) {
    fill: #666;
    display: block;
}
.header-menu-dropdown
    :deep(.dropdown-menu > li > a.header-menu-dropdown__item .svgItem svg[fill='none']) {
    fill: none;
    color: #666;
}
.header-menu-dropdown
    :deep(.dropdown-menu > li > a.header-menu-dropdown__item .svgItem svg[fill='none'] path) {
    stroke: currentColor;
}
.header-menu-dropdown
    :deep(.dropdown-menu > li > a.header-menu-dropdown__item > .fa) {
    width: 18px;
    text-align: center;
    color: #666;
    font-size: 1.1rem;
    flex-shrink: 0;
}
.header-menu-dropdown__item-label {
    flex: 1;
}
.header-menu-dropdown__badge {
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    border-radius: 11px;
    background: #e53935;
    color: #fff;
    font-size: 12px;
    line-height: 22px;
    text-align: center;
    flex-shrink: 0;
}
.header-menu-dropdown__locale-inner {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 6px 20px;
    font-weight: normal;
    font-size: 1rem;
    line-height: 1.42857143;
    color: #333;
    white-space: nowrap;
}
.header-menu-dropdown__locale-inner > .fa {
    width: 18px;
    text-align: center;
    color: #666;
    font-size: 1.1rem;
    flex-shrink: 0;
}
.header-menu-dropdown__locale-inner a {
    display: inline;
    padding: 0;
    color: #666;
    text-decoration: none;
}
.header-menu-dropdown__locale-inner a:hover,
.header-menu-dropdown__locale-inner a:focus {
    color: #262626;
    background: transparent;
}
.header-menu-dropdown__locale-inner a.active {
    color: #333;
    font-weight: 700;
}
.header-menu-dropdown__locale-sep {
    margin: 0 0.25rem;
    color: #999;
}
</style>
