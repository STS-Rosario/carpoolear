<template>
  <div class="user-form container" >
    <img v-if="!isMobile" src="/static/img/carpoolear_logo.png" />
    <h1> Ingresá con tu cuenta de <span class='brand'>Carpoolear</span> </h1>
    <div class='form row'>
      <div class="col-sm-12 col-md-12">
        <label for="txt_user">Usuario</label>
        <div class='visual-trick'>
            <input placeholder="Usuario" ref="txt_user" type="text" id="txt_user" v-model="email" v-jump:focus="'txt_password'" v-focus />
            <label for="txt_password">Contraseña</label>
            <input  placeholder="Password" ref="txt_password" type="password" id="txt_password" v-jump:click.blur="'btn_login'" v-model='password' />
            <button ref="btn_login" id="btn_login" class="btn btn-primary btn-shadowed-black" @click="login"> Ingresar </button>
        </div>
        <div class='pass-options' v-if="!isMobile">
            <input id="checkbox_remember" type="checkbox" /><label for="checkbox_remember">Recordame</label><span> - </span><router-link class='login-forget' :to="{name:'reset-password'}">Olvidé mi contraseña </router-link>
        </div>
      </div>
      <div class="col-sm-12 col-md-12">
        <span class="register">No tenés cuenta? <router-link class='login-register' :to="{name:'register'}"> Registrate aquí. </router-link></span>
        <button class="btn-primary btn-search btn-facebook btn-with-icon" @click="facebookLogin"><span class="btn-with-icon--icon"><i class="fa fa-facebook" aria-hidden="true"></i></span><span class='btn-with-icon--label'> Ingresá con Facebook </span></button>
      </div>
      <span v-if="loading"> Loading... </span>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'login',
    data () {
        return {
            email: '',
            password: '',
            loading: false,
            error: ''
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
            }, error => {
                if (error) {
                    this.error = error.error;
                }
                this.loading = false;
            });
        },

        facebookLogin () {
            this.fbLogin();
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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