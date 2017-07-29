<template>
  <div class="user-form container" >
    <router-link v-if="!isMobile"  :to="{name: 'trips'}">
        <img :src="carpoolear_logo" />
    </router-link>
    <img v-if="isMobile" :src="carpoolear_logo" />
    <h1> Registrar nuevo usuario </h1>
    <div class='form row' v-if="!success">
      <label for="txt_name">Nombre</label>
      <input  type="text" id="txt_name" v-model='name' :class="{'has-error': nombreError }"/>
      <label for="txt_surename">Apellido</label>
      <input  type="text" id="txt_surename" v-model='sureName' :class="{'has-error': apellidoError }"/>
      <label for="txt_email">Email</label>
      <input type="text" id="txt_email" v-model='email' :class="{'has-error': emailError }"/>
      <label for="txt_password">Contraseña</label>
      <input type="password" id="txt_password" v-model='password' :class="{'has-error': passwordError }"/>
      <label for="txt_password_confirmation">Ingrese nuevamente su contraseña</label>
      <input  type="password" id="txt_password_confirmation" v-model='passwordConfirmation' :class="{'has-error': passwordError }" />
      <div class="terms">
        <input  type="checkbox" id="cbx_terms" v-model='termsAndConditions' />
        <label for="cbx_terms"><router-link :to="{name: 'terms'}">He leído y acepto los términos y condiciones</router-link></label>
        <button @click="register" class="btn-primary" :disabled="progress || !termsAndConditions"> Registrarme </button>
      </div>
    </div>
    <div class='form row' v-else>
        <h2> Registro Exitoso! </h2>
        <p>Te hemos enviado un código de verificación a tu e-mail para que puedas activar tu cuenta y comenzar a compartir viajes. </p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import dialogs from '../../services/dialogs.js';
import bus from '../../services/bus-event';
import router from '../../router';
let emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

export default {
    name: 'register',
    data () {
        return {
            email: '',
            password: '',
            passwordConfirmation: '',
            name: '',
            sureName: '',
            termsAndConditions: false,
            carpoolear_logo: process.env.ROUTE_BASE + 'static/img/carpoolear_logo.png',
            progress: false,
            success: false,
            emailError: false,
            passwordError: false,
            nombreError: false,
            apellidoError: false
        };
    },
    computed: {
        ...mapGetters({
            checkLogin: 'auth/checkLogin',
            isMobile: 'device/isMobile'
        })
    },
    watch: {
        email: function () { this.emailError = false; },
        name: function () { this.nombreError = false; },
        sureName: function () { this.apellidoError = false; },
        password: function () { this.passwordError = false; },
        passwordConfirmation: function () { this.passwordErrorError = false; }
    },
    methods: {
        ...mapActions({
            doRegister: 'auth/register'
        }),

        validate () {
            let globalError = false;
            if (!emailRegex.test(this.email)) {
                this.emailError = true;
                globalError = true;
            }

            if (this.password !== this.passwordConfirmation || this.password.length < 6) {
                this.passwordError = true;
                globalError = true;
            }

            if (this.name.length < 1) {
                this.nombreError = true;
                globalError = true;
            }

            if (this.sureName.length < 1) {
                this.apellidoError = true;
                globalError = true;
            }

            return globalError;
        },

        register () {
            if (this.validate()) return;

            let email = this.email;
            let password = this.password;
            let passwordConfirmation = this.passwordConfirmation;
            let name = this.name + ' ' + this.sureName;
            let termsAndConditions = this.termsAndConditions;
            this.progress = true;
            this.doRegister({email, password, passwordConfirmation, name, termsAndConditions}).then(() => {
                this.progress = false;
                this.success = true;
            }).catch(() => {
                dialogs.message('La cuenta de email ingresada se encuentra en uso.', {estado: 'error'});
                this.emailError = true;
                this.progress = false;
            });
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
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    input[type="checkbox"] {
        width: auto;
    }
    a {
        color: #42b983;
    }
    .terms {
        margin-top: 1.8rem;
    }
    .user-form a {
        font-weight: 400;
    }

    @media only screen and (min-width: 768px) {
        .terms button {
            margin-left: 2rem;
            text-align: right;
        }
    }
</style>
