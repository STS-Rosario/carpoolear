<template>
    <div class="user-form container " >
        <router-link v-if="!isMobile"  :to="{name: 'trips'}">
            <img :src="carpoolear_logo" />
        </router-link>
        <h1> Recuperar contraseña </h1>
        <div class="form row" v-if="send">
            <h3> Se ha enviado un email a su casilla de correo con las indicaciones para restablecer su contraseña. </h3>
        </div>
        <div class="form row message" v-else-if="!token">
            <label for="txt_email">E-mail</label>
            <input type="text" id="txt_email" v-model='email'/>

            <button class="btn btn-primary btn-shadowed-black" @click="reset"> Recuperar contraseña </button>
            <span v-if="loading" class='loading'> Espere... </span>
            <span v-if="error"> {{error}} </span>
        </div>
        <div class='form row' v-else-if="token">
            <label for="txt_password">Password</label>
            <input  type="password" id="txt_password" v-model='password' />

            <label for="txt_password">Repetir Password </label>
            <input  type="password" id="txt_password" v-model='password_confirmation' />

            <button class="btn btn-primary" @click="change"> Cambiar contraseña </button>
            <span v-if="loading" class='loading'> Espere... </span>
            <span v-if="error"> {{error}} </span>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import bus from '../../services/bus-event';
import router from '../../router';

let emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

export default {
    name: 'reset-password',
    props: {
        'token': {
            type: String,
            required: false
        }
    },

    data () {
        return {
            email: '',
            loading: false,
            error: null,
            send: false,
            password_confirmation: '',
            password: '',
            carpoolear_logo: process.env.ROUTE_BASE + 'static/img/carpoolear_logo.png'
        };
    },
    computed: {
        ...mapGetters({
            isMobile: 'device/isMobile'
        })
    },

    methods: {
        ...mapActions({
            'resetPassword': 'auth/resetPassword',
            'changePassword': 'auth/changePassword'
        }),

        reset () {
            this.error = null;
            if (emailRegex.test(this.email)) {
                this.loading = true;
                this.resetPassword(this.email).then(() => {
                    this.loading = false;
                    this.send = true;
                }, () => {
                    this.loading = false;
                    this.error = 'El e-mail ingresado no pertenece a ningún usuario.';
                });
            } else {
                this.error = 'Ingrese un e-mail valido.';
            }
        },

        change () {
            this.error = null;
            if (this.password === this.password_confirmation) {
                this.loading = true;
                let data = {};
                data.password = this.password;
                data.password_confirmation = this.password_confirmation;
                let token = this.token;
                this.changePassword({token, data}).then(() => {
                    this.$router.replace({name: 'login'});
                }, () => {
                    this.loading = false;
                    this.error = 'Token invalido';
                });
            } else {
                this.error = 'No coicide los campos';
            }
        },
        onBackClick () {
            router.back();
        }
    },

    mounted () {
        bus.on('back-click', this.onBackClick);
    },

    beforeDestroy () {
        bus.off('back-click', this.onBackClick);
    }
};
</script>

<style>
  .app-container {
    min-height: 100vh;
  }
</style>

<style scoped>
    h3 {
        margin-bottom: 2em;
        font-size: 18px;
    }
    label {
        display: block;
        margin-top: .3em;
        margin-bottom: .6em;
    }
    input {
        margin-bottom: 0.8em;
    }
    loading {
        margin-left: 1em;
    }
    .message > span {
        vertical-align: -.6em;
        color: red;
        margin-left: 2em;
    }
</style>
