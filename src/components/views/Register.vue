<template>

  <div class="user-form container" >
    <img :src="carpoolear_logo" />
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
      <div class="terms">
        <input  type="checkbox" id="cbx_terms" v-model='termsAndConditions' />
        <label for="cbx_terms">He leído y acepto términos y condiciones</label>
        <button @click="register" class="btn-primary" :disabled="progress"> Registrarme </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import dialogs from '../../services/dialogs.js';

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
            progress: false
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
            this.progress = true;
            this.doRegister({email, password, passwordConfirmation, name, termsAndConditions}).then(() => {
                this.progress = false;
            }).catch(() => {
                dialogs.message('La cuenta de email esta en uso', {estado: 'error'});
                this.progress = false;
            });
        }
    }
};
</script>

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
    @media only screen and (min-width: 768px) {
        .terms button {
            margin-left: 2rem;
            text-align: right;
        }
    }

</style>
