<template>
  
  <div class="register" >
    <h1> Registrar nuevo usuario </h1>
    <div class='form'>
      <label for="txt_name">Nombre</label>
      <input  type="text" id="txt_name" v-model='name' />
      <label for="txt_surename">Apellido</label>
      <input  type="text" id="txt_surename" v-model='sureName' />
      <label for="txt_email">Email</label>
      <input type="text" id="txt_email" v-model='email'/>
      <label for="txt_password">Contraseña</label>
      <input type="password" id="txt_password" v-model='password'/>
      <label for="txt_password_confirmation">Ingrese nuevamente su contraseña</label>
      <input  type="password" id="txt_password_confirmation" v-model='passwordConfirmation' />
      <label for="cbx_terms">He leído y acepto términos y condiciones</label>
      <input  type="checkbox" id="cbx_terms" v-model='termsAndConditions' />

      <button @click="register"> Registrarme </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'register',
    data () {
        return {
            email: '',
            password: '',
            passwordConfirmation: '',
            name: '',
            sureName: '',
            termsAndConditions: false
        };
    },
    computed: {
        ...mapGetters({
            checkLogin: 'auth/checkLogin'
        })
    },
    methods: {
        ...mapActions({
            doRegister: 'auth/register'
        }),
        register () {
            let email = this.email;
            let password = this.password;
            let passwordConfirmation = this.passwordConfirmation;
            let name = this.name + ' ' + this.sureName;
            let termsAndConditions = this.termsAndConditions;
            this.doRegister({email, password, passwordConfirmation, name, termsAndConditions}).then(() => {

            }).catch(() => {

            });
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .register {
    padding-left: 10px;
    padding-right: 10px;
  }
  h1, h2 {
    font-weight: normal;
  }
  label {
    margin-top: .3em;
    font-weight: bold;
  }
  .form {
    margin-top:20px;
    border: 1px solid gray;
    padding: 2em;
    margin-bottom: 2rem;
  }
  input {
    width: 100%;
    display:block;
    padding: 3px;
    margin-bottom: 0.4em;
  }
  input[type="checkbox"] {
    width: auto;
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
