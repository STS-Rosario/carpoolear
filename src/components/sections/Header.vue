<template>
    <header class="header header-component">
        <div class="actionbar actionbar-top visible-xs">
            <div class="actionbar_section actionbar_icon">
                <span v-if="showLogo">
                    <i class="fa fa-car" aria-hidden="true"></i>
                </span>
                <template v-else v-for="item in leftHeaderButton" v-if="item.show">
                    <span @click="onClick(item)">
                        <i :class="'fa ' + item.icon" aria-hidden="true"></i>
                    </span>
                </template>
            </div>
            <div class="actionbar_section actionbar_title">
                {{title}}
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
                <div class="header_panel-left">
                    
                        <img :src="process.env.ROUTE_BASE + 'static/img/background_desktop.png'" />
                        <img :src="process.env.ROUTE_BASE +'static/img/carpoolear_logo.png'" />
                    <!--<router-link tag="h1" :to="{name: 'trips'}" class="header_title"> Carpoolear </router-link>-->
                </div>
            </router-link>
            <div class="header_panel-right">
                
                <button @click="share" type="button" class="btn btn-link">Invitar amigos</button>
                <router-link class="btn btn-link" v-if="!logged" :to="{name: 'trips'}">Viajes</router-link>
                <router-link class="btn btn-link" v-if="!logged" :to="{name: 'trips'}">Información</router-link>
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
                            <img class="header_profile_image"  :src=" user.image | profile-image " alt=""> 
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
                            <router-link :to="{name: 'profile_update'}">Configuración</router-link>
                        </li>
                        <li><a @click="logout">Logout</a></li>
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
import dialogs from '../../services/dialogs.js';
import {mapGetters} from 'vuex';
import {dropdown} from 'vue-strap';
import router from '../../router';
import bus from '../../services/bus-event.js';

export default {
    name: 'header',

    data () {
        return {
        };
    },

    computed: {
        ...mapGetters({
            logged: 'auth/checkLogin',
            user: 'auth/user',
            notificationsCount: 'notifications/count',
            title: 'actionbars/title',
            leftHeaderButton: 'actionbars/leftHeaderButton',
            rightHeaderButton: 'actionbars/rightHeaderButton'
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
            dialogs.message('Message example');
            socialShare.share();
        },

        logout () {
            this.$store.dispatch('auth/logout');
        },

        toNotifications () {
            router.push({name: 'notifications'});
        },

        onClick (item) {
            bus.emit(item.id + '-click');
        }
    },

    components: {
        dropdown
    }
};
</script>