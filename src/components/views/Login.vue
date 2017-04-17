<template>
  
  <div class="login" >
    <div class='form'>
      <label for="txt_user">Usuario</label>
      <input type="text" id="txt_user" v-model='username'/>
      <label for="txt_password">Password</label>
      <input  type="password" id="txt_password" v-model='password' />
      <button @click="login"> Login </button>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'login',
    data () {
        return {
            username: '',
            password: ''
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
            facebookLogin: 'cordova/facebookLogin'
        }),
        login () {
            let username = this.username;
            let password = this.password;
            this.doLogin({username, password});
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
