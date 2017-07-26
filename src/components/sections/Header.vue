<template>
    <header class="header header-component">
        <div class="actionbar actionbar-top visible-xs">
            <div class="actionbar_section actionbar_icon">
                <span v-if="showLogo">
                    <img :src="carpoolear_logo" />
                </span>
                <template v-else v-for="item in leftHeaderButton" v-if="item.show">
                    <span @click="onClick(item)">
                        <i :class="'fa ' + item.icon" aria-hidden="true"></i>
                    </span>
                </template>
            </div>
            <div class="actionbar_section actionbar_title" :class="subTitle !== '' ? 'header--with-subtitle' : ''">
                <span class='header--title'>{{title}}</span>
                <span class='header--subtitle'>{{subTitle}}</span>
            </div>
            <div class="actionbar_section actionbar_icon pull-right">
                <template v-for="item in rightHeaderButton" v-if="item.show">
                    <span @click="onClick(item)">
                        <i :class="'fa ' + item.icon" aria-hidden="true"></i>
                    </span>
                </template>
            </div>
        </div>
        <div class="header_content hidden-xs">
            <router-link :to="{name: 'trips'}">
                <div class="header_panel-left" v-if="logoHeaderVisibility" >
                    <img :src="background_desktop_mini" v-if="isNotLargeDesktop" />
                    <img :src="background_desktop" v-if="!isNotLargeDesktop" />
                    <img :src="carpoolear_logo"/>
                    <!--<router-link tag="h1" :to="{name: 'trips'}" class="header_title"> Carpoolear </router-link>-->
                </div>
            </router-link>
            <div class="header_panel-right">
                <modal :name="'modal'" v-if="showModal" @close="showModal = false" :title="'Test'" :body="'Body'">
                    <h3 slot="header">Invitar a amigos</h3>
                    <div slot="body" class="social-share">
                        <a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fcarpoolear.com%2F" target="_blank" aria-label="Compartir en Facebook" class="lnk lnk-social-network lnk-facebook">
                            <i class="fa fa-facebook" aria-hidden="true"></i>
                        </a>
                        <a href="https://plus.google.com/share?url=https%3A%2F%2carpoolear.com%2F" target="_blank" aria-label="Compartir en Google+"  class="lnk lnk-social-network lnk-google-plus">
                            <i class="fa fa-google-plus" aria-hidden="true"></i>
                        </a>
                        <a href="https://twitter.com/intent/tweet/?text=Carpoolear%3A%20plataforma%20para%20compartir%20viajes%20en%20autos&url=https%3A%2F%2Fcarpoolear.com&via=carpoolear&hashtags=carpooling" target="_blank" aria-label="Compartir en Twitter"   class="lnk lnk-social-network lnk-twitter">
                            <i class="fa fa-twitter" aria-hidden="true"></i>
                        </a>
                        <a href="whatsapp://send?text=Carpoolear%3A%20plataforma%20para%20compartir%20viajes%20en%20autos%20https%3A%2F%2carpoolear.com%2F" target="_blank" aria-label="Compartir en Whats App"   class="lnk lnk-social-network lnk-whatsapp"  v-if="isMobile">
                            <i class="fa fa-whatsapp" aria-hidden="true"></i>
                        </a>
                    </div>
                </modal>
                <button @click="share" type="button" class="btn btn-link">Invitar amigos</button>
                <router-link class="btn btn-link" v-if="!logged" :to="{name: 'trips'}">Viajes</router-link>
                <!--<router-link class="btn btn-link" v-if="!logged" :to="{name: 'trips'}">Información</router-link>-->
                <router-link class="btn btn-link" v-if="!logged" :to="{name: 'register'}">Registrarme</router-link>
                <router-link class="btn btn-primary" btn-lg v-if="!logged" :to="{name: 'login'}">Login</router-link>


                <span class="header_notifications" @click="toNotifications" v-if="logged">
                    <i class="fa fa-bell" aria-hidden="true"></i>
                    <span class="badge" v-if="notificationsCount > 0">{{notificationsCount}}</span>
                </span>

                <div class="header_profile" v-if="user">
                    <span > {{user.name}} </span>
                    <dropdown type="info" v-if="logged" >
                        <template slot="button">
                            <div class="circle-box header_profile_image" v-imgSrc:profile="user.image"></div>
                        </template>
                        <li>
                            <router-link :to="{name: 'my-trips'}">Mis Viajes</router-link>
                        </li>
                        <li>
                            <router-link :to="{name: 'conversations-list'}">Mensajes</router-link>
                        </li>
                        <li>
                            <router-link :to="{name: 'profile', params: {id: 'me'}}">Perfil</router-link>
                        </li>
                        <li role="separator" class="divider"></li>
                        <li>
                            <router-link :to="{name: 'acerca_de'}">Acerca</router-link>
                        </li>
                        <li role="separator" class="divider"></li>
                        <li>
                            <router-link :to="{name: 'profile_update'}">Configuración</router-link>
                        </li>
                        <li><a @click="logout" v-if="!isFacebokApp">Cerrar sesión</a></li>
                    </dropdown>
                </div>


                <router-link v-if="logged" :to="{name: 'new-trip'}" class="btn btn-primary btn-lg">Crear Viaje</router-link>

            </div>
            <div class="cf"></div>
        </div>
    </header>
</template>

<script>
import socialShare from '../../services/socialShare.js';
import {mapGetters} from 'vuex';
import {dropdown} from 'vue-strap';
import router from '../../router';
import bus from '../../services/bus-event.js';
import modal from '../Modal';

export default {
    name: 'header',

    data () {
        return {
            background_desktop_mini: process.env.ROUTE_BASE + 'static/img/background_desktop_mini.png',
            background_desktop: process.env.ROUTE_BASE + 'static/img/background_desktop.png',
            carpoolear_logo: process.env.ROUTE_BASE + 'static/img/carpoolear_logo.png',
            showModal: false
        };
    },

    mounted () {

    },

    computed: {
        ...mapGetters({
            logged: 'auth/checkLogin',
            user: 'auth/user',
            notificationsCount: 'notifications/count',
            title: 'actionbars/title',
            subTitle: 'actionbars/subTitle',
            leftHeaderButton: 'actionbars/leftHeaderButton',
            rightHeaderButton: 'actionbars/rightHeaderButton',
            logoHeaderVisibility: 'actionbars/headerLogoVisibility',
            isNotLargeDesktop: 'device/isNotLargeDesktop',
            isFacebokApp: 'device/isFacebokApp'
        }),

        showLogo () {
            for (let i = 0; i < this.leftHeaderButton.length; i++) {
                if (this.leftHeaderButton[i].show) {
                    return false;
                }
            }
            return true;
        }
    },

    methods: {
        share () {
            // dialogs.message('Message example');
            if (window && window.plugins && window.plugins.socialsharing && window.plugins.socialsharing.shareWithOptions) {
                socialShare.share();
            } else {
                this.showModal = true;
            }
        },

        logout () {
            this.$store.dispatch('auth/logout');
        },

        toNotifications () {
            router.push({name: 'notifications'});
        },

        onClick (item) {
            let b = bus.emit(item.id + '-click');
            console.log(b);
        }
    },

    components: {
        dropdown,
        modal
    }
};
</script>

<style scoped>
    .actionbar_icon img {
        margin-bottom: 2px;
        width: 26px;
        margin-left: .3em;
    }
</style>
