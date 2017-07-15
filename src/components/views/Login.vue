<template>
  <div class="user-form container" >
    <img src="/static/img/carpoolear_logo.png" />
    <h1> Ingresá con tu cuenta de <span class='brand'>Carpoolear</span> </h1>
    <div class='form row'>
      <div class="col-md-12">
        <label for="txt_user">Usuario</label>
        <input placeholder="Usuario" ref="txt_user" type="text" id="txt_user" v-model="email" v-jump:focus="'txt_password'" v-focus />
        <label for="txt_password">Contraseña</label>
        <input  placeholder="Password" ref="txt_password" type="password" id="txt_password" v-jump:click.blur="'btn_login'" v-model='password' />
        <button ref="btn_login" id="btn_login" class="btn btn-primary btn-shadowed-black" @click="login"> Ingresar </button>
        <div class='pass-options'>
          <input id="checkbox_remember" type="checkbox" /><label for="checkbox_remember">Recordame</label><span> - </span><router-link class='login-forget' :to="{name:'reset-password'}">Olvidé mi contraseña </router-link>
        </div>
      </div>
      <div class="col-md-12">
        <router-link class='login-register' :to="{name:'register'}"> Aún no cuenta con un usuario. Registrese aquí. </router-link>
        <button class="btn-primary btn-search btn-facebook" @click="facebookLogin"> Login con facebook </button>
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
  label {
    margin-top: .3em;
    font-weight: bold;
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