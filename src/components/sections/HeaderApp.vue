<template>
    <header class="header header-component">
        <div class="actionbar actionbar-top visible-xs">
            <div class="actionbar_section actionbar_icon">
                <span v-if="showLogo">
                    <router-link
                        :to="{ name: 'trips', params: { clearSearch: true } }"
                        v-on:click.native="tripsClick"
                    >
                        <img :src="app_logo" />
                    </router-link>
                </span>
                <template
                    v-else
                    v-for="item in leftHeaderButton"
                    v-if="item.show"
                >
                    <span @click="onClick(item)">
                        <i :class="'fa ' + item.icon" aria-hidden="true"></i>
                    </span>
                </template>
            </div>
            <div
                class="actionbar_section actionbar_title"
                :class="subTitle !== '' ? 'header--with-subtitle' : ''"
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
            </div>
            <div class="actionbar_section actionbar_icon pull-right">
                <template v-for="item in rightHeaderButton" v-if="item.show">
                    <span @click="onClick(item)">
                        <i :class="'fa ' + item.icon" aria-hidden="true"></i>
                    </span>
                </template>
                <div class="dropdown-right" v-if="showMenu">
                    <dropdown type="icon">
                        <template slot="button">
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
                        <li>
                            <a @click="logout" v-if="!isFacebokApp">{{
                                $t('cerrarSesion')
                            }}</a>
                        </li>
                    </dropdown>
                </div>
            </div>

            <div
                class="actionbar_section actionbar_icon pull-right"
                v-if="isMobile && !isTripsPage"
            >
                <a
                    href="/donar"
                    class="btn btn-primary btn-donar-header btn-header-small btn-lg"
                >
                    Donar
                </a>
            </div>
            <div
                class="actionbar_section actionbar_icon pull-right"
                v-if="isMobile && isTripsPage && !user"
            >
                <router-link
                    tag="a"
                    :to="{ name: 'login' }"
                    class="btn btn-primary btn-login-header btn-header-small btn-lg"
                >
                    Ingresar
                </router-link>
            </div>
        </div>
        <div class="header_content hidden-xs">
            <router-link
                :to="{ name: 'trips', params: { clearSearch: true } }"
                v-on:click.native="tripsClick"
            >
                <div class="header_panel-left" v-if="logoHeaderVisibility">
                    <img
                        :src="background_desktop_mini"
                        v-if="
                            isNotLargeDesktop ||
                            (config && config.trip_card_design === 'light')
                        "
                    />
                    <img
                        :src="background_desktop"
                        v-if="
                            !isNotLargeDesktop &&
                            config &&
                            config.trip_card_design !== 'light'
                        "
                    />
                    <img :src="app_logo" />
                </div>
            </router-link>
            <div class="header_panel-right">
                <modal
                    :name="'modal'"
                    v-if="showModal"
                    @close="showModal = false"
                    :title="'Test'"
                    :body="'Body'"
                >
                    <h3 slot="header">{{ $t('invitarAmigos') }}</h3>
                    <div slot="body" class="social-share">
                        <a
                            href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fcarpoolear.com%2F"
                            target="_blank"
                            aria-label="Compartir en Facebook"
                            class="lnk lnk-social-network lnk-facebook"
                        >
                            <i class="fa fa-facebook" aria-hidden="true"></i>
                        </a>
                        <a
                            href="https://plus.google.com/share?url=https%3A%2F%2carpoolear.com%2F"
                            target="_blank"
                            aria-label="Compartir en Google+"
                            class="lnk lnk-social-network lnk-google-plus"
                        >
                            <i class="fa fa-google-plus" aria-hidden="true"></i>
                        </a>
                        <a
                            href="https://twitter.com/intent/tweet/?text=Carpoolear%3A%20plataforma%20para%20compartir%20viajes%20en%20autos&url=https%3A%2F%2Fcarpoolear.com&via=carpoolear&hashtags=carpooling"
                            target="_blank"
                            aria-label="Compartir en Twitter"
                            class="lnk lnk-social-network lnk-twitter"
                        >
                            <i class="fa fa-twitter" aria-hidden="true"></i>
                        </a>
                        <a
                            href="whatsapp://send?text=Carpoolear%3A%20plataforma%20para%20compartir%20viajes%20en%20autos%20https%3A%2F%2carpoolear.com%2F"
                            target="_blank"
                            aria-label="Compartir en Whats App"
                            class="lnk lnk-social-network lnk-whatsapp"
                            v-if="isMobile"
                        >
                            <i class="fa fa-whatsapp" aria-hidden="true"></i>
                        </a>
                    </div>
                </modal>
                <button
                    v-if="config.trip_card_design !== 'light'"
                    @click="share"
                    type="button"
                    class="btn btn-link"
                >
                    {{ $t('invitarAmigos') }}
                </button>
                <router-link
                    v-if="config.trip_card_design !== 'light'"
                    class="btn btn-link trips-link"
                    :to="{ name: 'trips', params: { clearSearch: true } }"
                >
                    {{ $t('viajes') }}
                </router-link>
                <!--<router-link class="btn btn-link" v-if="!logged" :to="{name: 'trips'}">Información</router-link>-->
                <!--<router-link class="btn btn-link" v-if="!logged" :to="{name: 'register'}">Registrarme</router-link>-->
                <router-link
                    class="btn btn-primary"
                    btn-lg
                    v-if="!logged"
                    :to="{ name: 'login' }"
                >
                    {{ $t('inicio') }}
                </router-link>

                <span
                    class="header_notifications"
                    @click="toNotifications"
                    v-if="logged"
                >
                    <span class="fa-container">
                        <i class="fa fa-bell background" aria-hidden="true"></i>
                        <i
                            :style="
                                notificationsCount > 0 ? 'color: white' : ''
                            "
                            class="fa fa-bell"
                            aria-hidden="true"
                        ></i>
                    </span>
                    <span class="badge" v-if="notificationsCount > 0">
                        {{ notificationsCount }}
                    </span>
                </span>

                <div class="header_profile" v-if="user">
                    <span>{{ user.name }}</span>
                    <dropdown type="info" v-if="logged">
                        <template slot="button">
                            <div
                                class="circle-box header_profile_image"
                                v-imgSrc:profile="user.image"
                            ></div>
                        </template>
                        <li>
                            <router-link :to="{ name: 'my-trips' }">
                                {{ $t('misViajes') }}
                            </router-link>
                        </li>
                        <li>
                            <router-link :to="{ name: 'conversations-list' }">
                                {{ $t('mensajes') }}
                            </router-link>
                        </li>
                        <li>
                            <router-link
                                :to="{ name: 'profile', params: { id: 'me' } }"
                            >
                                {{ $t('perfil') }}
                            </router-link>
                        </li>
                        <li v-if="user.is_admin">
                            <router-link :to="{ name: 'admin-page' }">
                                {{ $t('administracion') }}
                            </router-link>
                        </li>
                        <li role="separator" class="divider"></li>
                        <!--<li>
                            <router-link :to="{name: 'acerca_de'}">Acerca</router-link>
                        </li>
                        <li role="separator" class="divider"></li>
                        <li>
                            <router-link :to="{name: 'profile_update'}">Configuración</router-link>
                        </li>-->
                        <li>
                            <a @click="logout" v-if="!isFacebokApp">{{
                                $t('cerrarSesion')
                            }}</a>
                        </li>
                    </dropdown>
                </div>

                <a href="/donar" class="btn btn-primary btn-donar-header btn-lg"
                    >Donar</a
                >
                <router-link
                    v-if="logged"
                    :to="{ name: 'new-trip' }"
                    id="btn-create-trip"
                    class="btn btn-primary btn-lg"
                >
                    {{ $t('crearViaje') }}
                </router-link>
            </div>
            <div class="cf"></div>
        </div>
    </header>
</template>

<script>
import { mapGetters } from 'vuex';
import { dropdown } from 'vue-strap';
import router from '../../router';
import bus from '../../services/bus-event.js';
import modal from '../Modal';

export default {
    name: 'headerApp',

    data() {
        return {
            background_desktop_mini:
                process.env.ROUTE_BASE +
                'static/img/' +
                process.env.TARGET_APP +
                '_background_desktop_mini.png',
            background_desktop:
                process.env.ROUTE_BASE +
                'static/img/' +
                process.env.TARGET_APP +
                '_background_desktop.png',
            app_logo:
                process.env.ROUTE_BASE +
                'static/img/' +
                process.env.TARGET_APP +
                '_logo.png',
            showModal: false
        };
    },

    mounted() {
        bus.on('header-title-change', this.onHeaderChange);
        console.log('app_logo', this.app_logo);
        console.log('ROUTE_BASE', process.env.ROUTE_BASE);
    },

    computed: {
        ...mapGetters({
            logged: 'auth/checkLogin',
            user: 'auth/user',
            notificationsCount: 'notifications/count',
            title: 'actionbars/title',
            titleLink: 'actionbars/titleLink',
            subTitle: 'actionbars/subTitle',
            imgTitle: 'actionbars/imgTitle',
            showMenu: 'actionbars/showMenu',
            leftHeaderButton: 'actionbars/leftHeaderButton',
            rightHeaderButton: 'actionbars/rightHeaderButton',
            logoHeaderVisibility: 'actionbars/headerLogoVisibility',
            isNotLargeDesktop: 'device/isNotLargeDesktop',
            isFacebokApp: 'device/isFacebokApp',
            isMobile: 'device/isMobile',
            config: 'auth/appConfig'
        }),

        showLogo() {
            for (let i = 0; i < this.leftHeaderButton.length; i++) {
                if (this.leftHeaderButton[i].show) {
                    return false;
                }
            }
            return true;
        },
        isTripsPage() {
            return this.$route.name === 'trips';
        }
    },

    methods: {
        share() {
            // dialogs.message('Message example');
            /* if (window && window.plugins && window.plugins.socialsharing && window.plugins.socialsharing.shareWithOptions) {
                socialShare.share();
            } else {
                this.showModal = true;
            } */
            // Primero necesito ver cuando estoy en App y cuando en Web
            this.showModal = true;
        },

        logout() {
            this.$store.dispatch('auth/logout');
        },

        toNotifications() {
            router.push({ name: 'notifications' });
        },

        onClick(item) {
            bus.emit(item.id + '-click');
        },

        tripsClick() {
            this.$store.dispatch('trips/refreshList', true);
            this.$store.dispatch('trips/tripsSearch', { is_passenger: false });
        },

        onHeaderChange() {
            // console.log('header-change', this.title);
        }
    },
    watch: {
        title(_old, _new) {
            console.log('titlee change', this.title);
        }
    },
    components: {
        dropdown,
        modal
    }
};
</script>

<style scoped>
.trips-link {
    font-weight: bold;
}
.actionbar_icon img {
    margin-bottom: 2px;
    width: 26px;
    margin-left: 0.3em;
}
.header_panel-right {
    min-width: 50%;
    text-align: right;
}
@media (max-width: 1050px) {
    .header_panel-right {
        min-width: 70%;
    }
}
</style>
