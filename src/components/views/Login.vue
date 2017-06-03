<template>
  <div class="login" >
    <div class='form'>
      <label for="txt_user">Usuario</label>
      <input type="text" id="txt_user" v-model='email'/>
      <label for="txt_password">Password</label>
      <input  type="password" id="txt_password" v-model='password' />
      <button @click="login"> Login </button> <router-link :to="{name:'reset-password'}"> ¿Olvidó su contraseña? </router-link>
      <span v-if="loading"> Loading... </span>
      <div>
        <button @click="facebookLogin"> Loggin with facebook </button>
      </div>
      
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
  h1, h2 {
    font-weight: normal;
  }
  .form {
    margin-top:20px;
    border: 1px solid gray;
    padding: 15px;
  }
  input {
    display:block;
    padding: 3px;
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
  a {
    color: #42b983;
  }
</style>
