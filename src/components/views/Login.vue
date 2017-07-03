<template>
  <div class="login" >
    <h1> Login </h1>
    <div class='form'>
      <label for="txt_user">Usuario</label>
      <input ref="txt_user" type="text" id="txt_user" v-model="email" v-jump:focus="txt_password" v-focus />
      <label for="txt_password">Contraseña</label>
      <input  ref="txt_password" type="password" id="txt_password" v-jump:click="btn_login" v-model='password' />
      <button ref="btn_login" id="btn_login" class="btn-primary btn-search" @click="login"> Login </button> <router-link class='login-forget' :to="{name:'reset-password'}"> ¿Olvidó su contraseña? </router-link>
      <span v-if="loading"> Loading... </span>
      <button class="btn-primary btn-search btn-facebook" @click="facebookLogin"> Login con facebook </button>
      <router-link class='login-register' :to="{name:'register'}"> Aún no cuenta con un usuario. Registrese aquí. </router-link>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import focus from '../../directives/autofocus.js';
import jump from '../../directives/jump.js';

export default {
    name: 'login',
    directives: {
        focus,
        jump
    },
    data () {
        return {
            email: '',
            password: '',
            loading: false,
            error: '',
            txt_password: 'txt_password',
            btn_login: 'btn_login'
        };
    },
    computed: {
        ...mapGetters({
            checkLogin: 'auth/checkLogin'
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
  .login {
    padding-left: 10px;
    padding-right: 10px;
  }
  label {
    margin-top: .3em;
    font-weight: bold;
  }
  h2 {
    font-weight: normal;
  }
  .form {
    margin-top:20px;
    border: 1px solid gray;
    padding: 2em;
    margin-bottom: 2rem;
  }
  input {
    display:block;
    padding: 3px;
    margin-bottom: 0.4em;
    width: 100%;
  }
  button {
    margin-top: 10px;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  .login-forget {
    font-weight: bold;
    padding-left: 12px;
    color: #016587;
  }
  .login-register {
    color: red;
  }
  .btn-facebook {
    display: block;
    margin-bottom: 0.6em;
  }
</style>
