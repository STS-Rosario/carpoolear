<template>
    <header class="header header-component">
        <div class="container header_content">
            <div class="header_panel-left">
                <h1 class="header_title"> Carpoolear </h1>
            </div>
            <div class="header_panel-right">
                <!-- Mover al dropdonw despues -->
                
                <button @click="share" type="button" class="btn btn-link">Invitar amigos</button>

                <router-link :to="{name: 'trips'}" class="btn btn-link">Viajes</router-link> 
                
                <router-link v-if="!logged" :to="{name: 'login'}">Login</router-link>
                <router-link v-if="!logged" :to="{name: 'register'}">Register</router-link>
                
                <div class="header_profile" v-if="user">
                    <span > {{user.name}} </span>
                    <img class="header_profile_image"  :src=" user.image | profile-image " alt="">
                </div>

                <dropdown type="info" v-if="logged" >
                    <div slot="before" type="button"></div>
                    <li>
                        <router-link :to="{name: 'my-trips'}">Mis Viajes</router-link>
                    </li>
                    <li>
                        <router-link :to="{name: 'my-trips'}">Mensajes</router-link>
                    </li>
                    <li>
                        <router-link :to="{name: 'my-trips'}">Perfil</router-link>
                    </li>
                    <li role="separator" class="divider"></li>
                    <li><a @click="logout">Logout</a></li>
                </dropdown>

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

export default {
    name: 'header',
    data () {
        return {
        };
    },
    computed: {
        ...mapGetters({
            logged: 'auth/checkLogin',
            user: 'auth/user'
        })
    },
    methods: {
        share () {
            dialogs.message('Message example');
            socialShare.share();
        },
        logout () {
            this.$store.dispatch('auth/logout');
        }
    },
    components: {
        dropdown
    }
};
</script>