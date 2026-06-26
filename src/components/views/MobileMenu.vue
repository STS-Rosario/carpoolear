<template>
    <div class="mobile-menu visible-xs">
        <div class="mobile-menu_header">
            <h1 class="mobile-menu_title">{{ $t('menu') }}</h1>
            <button
                type="button"
                class="mobile-menu_close"
                @click="closeMenu"
                :aria-label="$t('cerrar')"
            >
                <i class="fa fa-times-circle" aria-hidden="true"></i>
            </button>
        </div>

        <nav class="mobile-menu_list">
            <router-link
                class="mobile-menu_item"
                :to="{ name: 'notifications' }"
            >
                <svgItem size="22" icon="bell"></svgItem>
                <span class="mobile-menu_item_label">{{ $t('notificaciones') }}</span>
                <span class="mobile-menu_badge" v-if="notificationsCount > 0">
                    {{ notificationsCount }}
                </span>
            </router-link>
            <router-link
                class="mobile-menu_item"
                :to="{ name: 'conversations-list' }"
            >
                <svgItem size="22" icon="message"></svgItem>
                <span class="mobile-menu_item_label">{{ $t('mensajes') }}</span>
                <span class="mobile-menu_badge" v-if="unreadMessagesCount > 0">
                    {{ unreadMessagesCount }}
                </span>
            </router-link>
            <router-link class="mobile-menu_item" :to="{ name: 'my-trips' }">
                <svgItem size="22" icon="seat"></svgItem>
                <span class="mobile-menu_item_label">{{ $t('misViajes') }}</span>
                <span class="mobile-menu_badge" v-if="myTripsBadgeCount > 0">
                    {{ myTripsBadgeCount }}
                </span>
            </router-link>
            <router-link
                class="mobile-menu_item"
                :to="{ name: 'profile', params: { id: 'me' } }"
            >
                <svgItem size="22" icon="contact"></svgItem>
                <span class="mobile-menu_item_label">{{ $t('miCuenta') }}</span>
            </router-link>

            <hr class="mobile-menu_divider" />

            <a
                class="mobile-menu_item"
                href="https://carpoolear.com.ar/plataforma-preguntas-frecuentes"
                target="_blank"
                rel="noopener noreferrer"
            >
                <i class="fa fa-question-circle" aria-hidden="true"></i>
                <span class="mobile-menu_item_label">{{
                    $t('footerPreguntasFrecuentes')
                }}</span>
            </a>
            <router-link class="mobile-menu_item" :to="{ name: 'tickets' }">
                <i class="fa fa-life-ring" aria-hidden="true"></i>
                <span class="mobile-menu_item_label">{{ $t('soporte') }}</span>
            </router-link>
            <router-link
                class="mobile-menu_item"
                :to="{ name: 'debug_setting' }"
            >
                <i class="fa fa-bug" aria-hidden="true"></i>
                <span class="mobile-menu_item_label">{{ $t('modoDebug') }}</span>
            </router-link>

            <hr class="mobile-menu_divider" />

            <router-link class="mobile-menu_item" :to="{ name: 'acerca_de' }">
                <i class="fa fa-info-circle" aria-hidden="true"></i>
                <span class="mobile-menu_item_label">{{ $t('acercaDe') }}</span>
            </router-link>
            <router-link class="mobile-menu_item" :to="{ name: 'terms' }">
                <i class="fa fa-file-text-o" aria-hidden="true"></i>
                <span class="mobile-menu_item_label">{{ $t('legales') }}</span>
            </router-link>

            <hr class="mobile-menu_divider" />

            <div class="mobile-menu_item mobile-menu_locale">
                <i class="fa fa-globe" aria-hidden="true"></i>
                <span class="mobile-menu_item_label">
                    <a
                        href="#"
                        :class="{ active: $i18n.locale === 'arg' }"
                        @click.prevent="setLocale('arg')"
                        >Español</a
                    >
                    <span class="mobile-menu_locale_sep">·</span>
                    <a
                        href="#"
                        :class="{ active: $i18n.locale === 'en' }"
                        @click.prevent="setLocale('en')"
                        >English</a
                    >
                </span>
            </div>
        </nav>

        <button
            type="button"
            class="mobile-menu_logout"
            v-if="!isFacebokApp"
            @click="logout"
        >
            {{ $t('cerrarSesion') }}
        </button>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { useNotificationsStore } from '../../stores/notifications';
import { useConversationsStore } from '../../stores/conversations';
import { usePassengerStore } from '../../stores/passenger';
import { useDeviceStore } from '../../stores/device';
import svgItem from '../SvgItem';
import router from '../../router';
import { UserApi } from '../../services/api';
import {
    persistLocaleChoice,
    syncLocaleToBackend
} from '../../utils/userLocale.js';

const userApi = new UserApi();

export default {
    name: 'mobileMenu',
    computed: {
        ...mapState(useNotificationsStore, {
            notificationsCount: 'count'
        }),
        ...mapState(useConversationsStore, {
            unreadMessagesCount: 'unreadCount'
        }),
        ...mapState(usePassengerStore, {
            myTripsBadgeCount: 'pendingRequestCount'
        }),
        ...mapState(useAuthStore, {
            logged: 'checkLogin'
        }),
        ...mapState(useDeviceStore, {
            isFacebokApp: 'isFacebokApp'
        })
    },
    methods: {
        closeMenu() {
            router.push({ name: 'trips', query: { clearSearch: 'true' } });
        },
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
        svgItem
    }
};
</script>

<style scoped>
.mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
    background: #fff;
    display: flex;
    flex-direction: column;
    padding: calc(12px + env(safe-area-inset-top)) 16px
        calc(72px + env(safe-area-inset-bottom));
    overflow-y: auto;
}
.mobile-menu_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}
.mobile-menu_title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #333;
}
.mobile-menu_close {
    border: 0;
    background: transparent;
    color: #666;
    font-size: 1.6rem;
    line-height: 1;
    padding: 0;
}
.mobile-menu_list {
    flex: 1;
}
.mobile-menu_item {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.85rem 0;
    color: #333;
    text-decoration: none;
    font-size: 1rem;
}
.mobile-menu_item i.fa {
    width: 22px;
    text-align: center;
    color: #666;
    font-size: 1.2rem;
}
.mobile-menu_item .svgItem svg {
    fill: #666;
}
.mobile-menu_item_label {
    flex: 1;
}
.mobile-menu_badge {
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    border-radius: 11px;
    background: #e53935;
    color: #fff;
    font-size: 12px;
    line-height: 22px;
    text-align: center;
}
.mobile-menu_divider {
    margin: 0.25rem 0;
    border: 0;
    border-top: 1px solid #e0e0e0;
}
.mobile-menu_locale a {
    color: #666;
    text-decoration: none;
}
.mobile-menu_locale a.active {
    color: #333;
    font-weight: 700;
}
.mobile-menu_locale_sep {
    margin: 0 0.35rem;
    color: #999;
}
.mobile-menu_logout {
    margin-top: 1rem;
    width: 100%;
    border: 0;
    border-radius: 8px;
    background: #f0f0f0;
    color: #e53935;
    font-size: 1rem;
    font-weight: 600;
    padding: 0.9rem 1rem;
}
</style>
