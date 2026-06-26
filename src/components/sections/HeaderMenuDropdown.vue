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
            <router-link tag="a" :to="{ name: 'notifications' }">
                {{ $t('notificaciones') }}
                <span class="badge" v-if="notificationsCount > 0">{{
                    notificationsCount
                }}</span>
            </router-link>
        </li>
        <li>
            <router-link tag="a" :to="{ name: 'conversations-list' }">
                {{ $t('mensajes') }}
                <span class="badge" v-if="messagesCount > 0">{{
                    messagesCount
                }}</span>
            </router-link>
        </li>
        <li>
            <router-link tag="a" :to="{ name: 'my-trips' }">
                {{ $t('misViajes') }}
                <span class="badge" v-if="myTripsBadgeCount > 0">{{
                    myTripsBadgeCount
                }}</span>
            </router-link>
        </li>
        <li>
            <router-link tag="a" :to="{ name: 'profile', params: { id: 'me' } }">
                {{ $t('miCuenta') }}
            </router-link>
        </li>
        <li role="separator" class="divider"></li>
        <li>
            <a
                href="https://carpoolear.com.ar/plataforma-preguntas-frecuentes"
                target="_blank"
                rel="noopener noreferrer"
            >
                {{ $t('footerPreguntasFrecuentes') }}
            </a>
        </li>
        <li>
            <router-link tag="a" :to="{ name: 'tickets' }">{{
                $t('soporte')
            }}</router-link>
        </li>
        <li>
            <router-link tag="a" :to="{ name: 'debug_setting' }">{{
                $t('modoDebug')
            }}</router-link>
        </li>
        <li role="separator" class="divider"></li>
        <li>
            <router-link tag="a" :to="{ name: 'acerca_de' }">{{
                $t('acercaDe')
            }}</router-link>
        </li>
        <li>
            <router-link tag="a" :to="{ name: 'terms' }">{{
                $t('legales')
            }}</router-link>
        </li>
        <li role="separator" class="divider"></li>
        <li class="header-menu-dropdown__locale">
            <span class="header-menu-dropdown__locale-inner">
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
        </li>
        <li v-if="!isFacebokApp" role="separator" class="divider"></li>
        <li v-if="!isFacebokApp">
            <a @click="logout">{{ $t('cerrarSesion') }}</a>
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
}
.header-menu-dropdown__locale-inner {
    display: block;
    padding: 3px 20px;
    clear: both;
    font-weight: normal;
    line-height: 1.42857143;
    color: #333;
    white-space: nowrap;
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
