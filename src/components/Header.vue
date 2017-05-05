<template>
    <header class="header-component">
        <h1>Carpoolear</h1>
        <button @click="share" type="button">Invitar amigos</button>
        <router-link :to=" {name: 'trips'}">Viajes</router-link>

        <router-link v-if="!logged" :to=" {name: 'login'}">Login</router-link>
        <router-link v-if="!logged" :to=" {name: 'register'}">Register</router-link>

        <button v-if="logged" @click="logout" >Logout</button>

        <span v-if="user">
            {{user.name}}
            <img :src=" user.image | profile-image " alt="">
        </span>
         
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