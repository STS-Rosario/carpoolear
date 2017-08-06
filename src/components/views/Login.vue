<template>
  <div class="user-form container" >
    <router-link v-if="!isMobile"  :to="{name: 'trips'}">
        <img :src="carpoolear_logo" />
    </router-link>
    <h1> Ingresá con tu cuenta de <span class='brand'>Carpoolear</span> </h1>
    <div class='form row'>
      <div class="col-sm-12 col-md-12">
        <label for="txt_user">Usuario</label>
        <div class='visual-trick'>
            <input placeholder="Usuario" ref="txt_user" type="text" id="txt_user" v-model="email" v-jump:focus="'txt_password'" v-focus />
            <label for="txt_password">Contraseña</label>
            <input  placeholder="Password" ref="txt_password" type="password" id="txt_password" v-jump:click.blur="'btn_login'" v-model='password' />
            <button ref="btn_login" id="btn_login" class="btn btn-primary btn-shadowed-black" @click="login" :disabled="loading"> Ingresar </button>
        </div>
        <div class='pass-options' v-if="!isMobile">
            <input id="checkbox_remember" type="checkbox" /><label for="checkbox_remember">Recordarme</label><span> - </span><router-link class='login-forget' :to="{name:'reset-password'}">Olvidé mi contraseña </router-link>
        </div>
      </div>
        <router-link v-show="isMobile" class='password-not' :to="{name:'reset-password'}">Olvidé mi contraseña </router-link>
      <div class="col-sm-12 col-md-12">
        <span class="register">No tenés cuenta? <router-link class='login-register' :to="{name:'register'}"> Registrate aquí. </router-link></span>
        <button class="btn-primary btn-search btn-facebook btn-with-icon" @click="facebookLogin"><span class="btn-with-icon--icon"><i class="fa fa-facebook" aria-hidden="true"></i></span><span class='btn-with-icon--label'> Ingresá con Facebook </span></button>
      </div>
      <!--<span v-if="loading"> Loading... </span>-->
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import dialogs from '../../services/dialogs.js';
import router from '../../router';
import bus from '../../services/bus-event';

export default {
    name: 'login',
    data () {
        return {
            email: '',
            password: '',
            loading: false,
            error: '',
            carpoolear_logo: process.env.ROUTE_BASE + 'static/img/carpoolear_logo.png'
        };
    },
    computed: {
        ...mapGetters({
            checkLogin: 'auth/checkLogin',
            isMobile: 'device/isMobile'
        })
    },
    methods: {
        ...mapActions({
            doLogin: 'auth/login', // map this.add() to this.$store.dispatch('increment')
            fbLogin: 'cordova/facebookLogin'
        }),
        login () {
            this.loading = true;
            let email = this.email;
            let password = this.password;
            this.doLogin({email, password}).then(data => {
                this.loading = false;
                // router.push({ name: 'trips' });
                // router.rememberBack();
            }, error => {
                dialogs.message('Email o password incorrecto', { duration: 10, estado: 'error' });
                if (error) {
                    this.error = error.error;
                }
                this.loading = false;
            });
        },

        facebookLogin () {
            this.fbLogin();
        },

        onClearClick () {
            router.back();
        }
    },

    mounted () {
        bus.on('clear-click', this.onClearClick);
    },

    beforeDestroy () {
        bus.off('clear-click', this.onClearClick);
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
    .password-not {
        text-align: center;
        margin-top: 16px;
        display: block;
        text-align: center;
        color: #ddd;
        font-weight: bold;
        text-decoration: underline;
        padding-left: 10px;
    }
  label {
    margin-top: .3em;
    font-weight: bold;
  }
  .login-forget {
    font-weight: bold;
    padding-left: 12px;
    color: #016587;
  }
  .user-form .btn-primary.btn-facebook {
    width: 90%;
    margin: 1em auto;
  }

  .btn-facebook.btn-with-icon--icon {
    background-color: var(--button-facebook-blue-left);
  }
  .register {
    font-weight: 300;
    font-size: 16px;
    display: block;
    padding: 1.4em 0;
    position: relative;
    display: inline-block;
  }

  .register::before {
    position: absolute;
    border-top: solid 1px #2793ff;
    width: 90%;
    margin-left: 5%;
    content: " ";
    top: 0;
    left: 0;
  }
  .register::after {
    position: absolute;
    border-bottom: solid 1px #2793ff;
    width: 90%;
    margin-left: 5%;
    content: " ";
    bottom: 0;
    left: 0;
  }

  @media only screen and (min-width: 768px) {
    .visual-trick {
        border-right: solid 1px #ccc;
        padding-right: 4em;
    }
    .form > div:last-child {
        padding-left: 4em;
    }
    .user-form .btn-primary.btn-facebook {
        max-width: 280px;
        margin: 1.6em 0 .6em 0;
        width: initial;
    }
    .register {
        display: inline;
        margin-bottom: 2em;
        font-weight: 400;
    }
    .register::before {
        display: none;
    }
    .register::after {
        display: none;
    }
  }
</style>
