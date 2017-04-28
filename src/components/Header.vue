<template>
    <header class="header-component">
        <div class="header-panel-left">
            <h1 class="header-title"> Carpoolear </h1>
        </div>
        <div class="header-panel-right">
            <!-- Mover al dropdonw despues -->
            <button v-if="logged" @click="logout" >Logout</button>

            <button @click="share" type="button">Invitar amigos</button>

            <router-link :to="{name: 'trips'}">Viajes</router-link>
            
            <router-link v-if="!logged" :to="{name: 'login'}">Login</router-link>
            <router-link v-if="!logged" :to="{name: 'register'}">Register</router-link>
            
            <div class="header-profile" v-if="user">
                <span > {{user.name}} </span>
                <img class="header-profile-image"  :src=" user.image | profile-image " alt="">
            </div>

            <router-link v-if="logged" :to="{name: 'new-trip'}">Crear Viaje</router-link>

        </div>
        <div class="cf"></div>
    </header>
</template>

<script>
import socialShare from '../services/socialShare.js';
import dialogs from '../services/dialogs.js';
import {mapGetters} from 'vuex';
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
    }
};
</script>