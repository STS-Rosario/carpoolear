<template>
  <div class="user-form container" >
    <router-link v-if="!isMobile"  :to="{name: 'trips'}">
        <img :src="carpoolear_logo" />
    </router-link>
    <h1 v-if="!(hasScroll && isMobile)"> Ingresá con tu cuenta de <span class='brand'>Carpoolear</span> </h1>
    <div class='form row'>
      <div class="alert alert-warning" role="alert" v-if="!isUnderstood">
        Si carpooleabas antes del 5/8/17, tenés que entrar al sistema mediante el botón "ingresar con facebook" para seguir usando el mismo usuario y recuperar tus calificaciones. Si no podés entrar, escribinos a <a href="mailto:carpoolear@stsrosario.org.ar">carpoolear@stsrosario.org.ar</a> o a nuestro facebook así te ayudamos :)
        <div class="row form-inline form-warning-login">
            <div class="col-sm-24 text-right">
                <div class="checkbox">
                    <label>
                        <input type="checkbox" v-model="dontShowAgain">
                        <span>No volver a mostrar</span>
                    </label>
                </div>
                <button type="button" class="btn btn-default" @click="fbWarningGetIt">ENTENDIDO!</button>
            </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-12" v-show="isMobile">
        <button class="btn-primary btn-search btn-facebook btn-with-icon" @click="facebookLogin" :disabled="fbLoading"><span class="btn-with-icon--icon"><i class="fa fa-facebook" aria-hidden="true"></i></span><span class='btn-with-icon--label'> <span v-if="!fbLoading">Ingresá con Facebook</span><spinner class="blue" v-if="fbLoading"></spinner></span></button>
        <div class="fb-terms">Al ingresar con Facebook estas aceptando nuestros <router-link :to="{name: 'terms'}">términos y condiciones</router-link>.</div>
        <hr />
        <button ref="btn_show_login" id="btn_show_login" class="btn btn-primary btn-shadowed-black" @click="showLogin" v-show="!isShowLogin"> <span>Ingresá con tu cuenta</span></button>
      </div>

      <div class="col-sm-12 col-md-12 login-box" v-show="isShowLogin || !isMobile">
        <label for="txt_user">Email</label>
        <div class='visual-trick'>
            <input placeholder="El email con el que te registraste" ref="txt_user" type="email" id="txt_user" v-model="email" v-jump:focus="'txt_password'" />
            <label for="txt_password" v-show="!isMobile">Contraseña</label>
            <input  placeholder="Contraseña" ref="txt_password" type="password" id="txt_password" v-jump:click.blur="'btn_login'" v-model='password' />
            <div class="alert alert-info" role="alert" v-if="showUserNotActiveInfo">
                 Para ingresar debe activar su cuenta, te hemos enviado un código de verificación a tu e-mail para que puedas activar tu cuenta.
            </div>
            <button ref="btn_login" id="btn_login" class="btn btn-primary btn-shadowed-black" @click="login" :disabled="loading"> <span v-if="!loading">Ingresar</span> <spinner class="blue" v-if="loading"></spinner></button>
        </div>
        <div class='pass-options' v-if="!isMobile">
            <input id="checkbox_remember" type="checkbox" /><label for="checkbox_remember">Recordarme</label><span> - </span><router-link class='login-forget' :to="{name:'reset-password'}">Olvidé mi contraseña </router-link>
        </div>

      </div>
      <div style="margin: 1em 0"  v-show="isShowLogin && isMobile" >
        <router-link class='password-not' :to="{name:'reset-password'}">Olvidé mi contraseña </router-link>
      </div>
      <div  class="col-sm-12 col-md-12"  v-show="isMobile">
        <span class="register" v-if="isMobile">¿No tenés cuenta? Ingresá con Facebook o <router-link class='login-register' :to="{name:'register'}"> Registrate acá. </router-link></span>

      </div>
      <div class="col-sm-12 col-md-12 facebook-box"  v-show="!isMobile" >
        <span class="register">¿No tenés cuenta?  Ingresá con Facebook o <router-link class='login-register' :to="{name:'register'}"> Registrate acá. </router-link></span>
        <button class="btn-primary btn-search btn-facebook btn-with-icon" @click="facebookLogin" :disabled="fbLoading"><span class="btn-with-icon--icon"><i class="fa fa-facebook" aria-hidden="true"></i></span><span class='btn-with-icon--label'> <span v-if="!fbLoading">Ingresá con Facebook</span><spinner class="blue" v-if="fbLoading"></spinner></span></button>
        <div>Al ingresar con Facebook estas aceptando nuestros <router-link :to="{name: 'terms'}">términos y condiciones</router-link>.</div>
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
import spinner from '../Spinner.vue';
import cache from '../../services/cache';

export default {
    name: 'login',
    data () {
        return {
            email: '',
            password: '',
            loading: false,
            fbLoading: false,
            error: '',
            carpoolear_logo: process.env.ROUTE_BASE + 'static/img/carpoolear_logo.png',
            hasScroll: false,
            isUnderstood: true,
            dontShowAgain: false,
            isShowLogin: false,
            showUserNotActiveInfo: false
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
        fbWarningGetIt () {
            this.isUnderstood = true;
            if (this.dontShowAgain) {
                cache.setItem('fbLoginWarningDontShow', true);
            }
        },
        login () {
            if (!this.fbLoading) {
                this.showUserNotActiveInfo = false;
                this.loading = true;
                let email = this.email;
                let password = this.password;
                this.doLogin({ email, password }).then(data => {
                    this.loading = false;
                    // router.push({ name: 'trips' });
                    // router.rememberBack();
                }, error => {
                    const userNotActive = error && error.message === 'user_not_active';
                    const message = userNotActive ? 'Para ingresar debe activar su cuenta primero.' : 'Email o password incorrecto.';
                    this.showUserNotActiveInfo = userNotActive;

                    dialogs.message(message, { duration: 10, estado: 'error' });
                    if (error) {
                        this.error = error.error;
                    }
                    this.loading = false;
                });
            } else {
                dialogs.message('Su solicitud ya fue enviada, aguarde un momento por favor.', { duration: 10, estado: 'error' });
            }
        },
        showLogin () {
            this.isShowLogin = true;
        },

        facebookLogin () {
            if (!this.loading) {
                this.fbLoading = true;
                this.fbLogin().catch((response) => {
                    if (response.errors && response.errors.email) {
                        dialogs.message('El correo asociado a su cuenta de facebook, ya tiene asociada una cuenta en Carpoolear. Por favor, ingresé utilizando el login por email. Si no recuerda su clave, cliqueé en olvidé mi contraseña.', { duration: 10, estado: 'error' });
                    }
                });
            } else {
                dialogs.message('Su solicitud ya fue enviada, aguarde un momento por favor.', { duration: 10, estado: 'error' });
            }
        },

        onClearClick () {
            router.back();
        }
    },

    mounted () {
        bus.on('clear-click', this.onClearClick);
        let viewPort = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        if (!this.isMobile) {
            this.$refs.txt_user.focus();
        }

        this.hasScroll = document.body.scrollHeight > viewPort;
        cache.getItem('fbLoginWarningDontShow').then((value) => {
            console.log('fbLoginWarningDontShow', value);
            if (value) {
                this.isUnderstood = true;
            }
        });
    },

    beforeDestroy () {
        bus.off('clear-click', this.onClearClick);
    },

    components: {
        spinner
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
.fb-terms {
  color: #EEE;
}

.facebook-box {
  margin-top: 0.5em !important;
}

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
  margin-top: 0.3em;
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

.description {
  font-size: 11px;
  text-transform: none;
  color: #fff;
  display: block;
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
  /* border-top: solid 1px #2793ff; */
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

.alert-warning a {
  color: #337ab7;
}

.register {
  color: #CCC;
}

.alert-warning {
  position: fixed;
  top: 0;
  left: 0;
  width: 94%;
  margin: 10vh 3%;
  height: 80vh;
  z-index: 100;
}

@media only screen and (min-width: 768px) {
  .login-box {
    margin-right: 0;
  }
  .alert-warning {
    position: static;
    width: auto;
    height: auto;
    margin: auto;
    margin-bottom: 1em;
  }
  .register {
    color: #555;
  }
  .description {
    display: inline;
    padding-left: 0.4em;
    color: rgb(1, 101, 135);
  }
  .visual-trick {
    border-right: solid 1px #ccc;
    padding-right: 4rem;
  }
  .form > div:last-child {
    padding-left: 4em;
  }
  .user-form .btn-primary.btn-facebook {
    width: 100%;
    max-width: 280px;
    margin: 1.6em 0 0.6em 0;
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

.form-warning-login label {
  color: black;
}

.form-warning-login .checkbox {
  display: inline-block;
  margin-right: 1em;
}

.form-warning-login .checkbox span {
  text-transform: none;
}

.form-warning-login * {
  vertical-align: middle;
}

.form-warning-login button {
  margin-top: 0em;
}

@media only screen and (min-width: 768px) {
  .form-warning-login button {
    margin-top: 0.5em;
  }
  [type="checkbox"] {
    margin-top: 0;
  }
}

#btn_show_login {
  border: 2px solid rgba(215, 37, 33, 0.8);
  color: #FFF;
  background: rgba(215, 37, 33, 0.8);
}
</style>
