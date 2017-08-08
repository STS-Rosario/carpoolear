<template>
  <div class="register-component user-form container" >
    <router-link v-if="!isMobile"  :to="{name: 'trips'}">
        <img :src="carpoolear_logo" />
    </router-link>
    <img v-if="isMobile" :src="carpoolear_logo" />
    <h1> Registrar nuevo usuario </h1>
    <div class='form row' v-if="!success">
      <label for="txt_name">Nombre</label>
      <input autofocus v-jump:focus="'txt_surename'" ref="txt_name" name="txt_name" maxlength="25" type="text" id="txt_name" v-model='name' :class="{'has-error': nombreError.state }"/>
      <span class="error" v-if="nombreError.state"> {{nombreError.message}} </span>
      <label for="txt_surename">Apellido</label>
      <input v-jump:focus="'txt_email'" ref="txt_surename" name="txt_surename" maxlength="25" type="text" id="txt_surename" v-model='sureName' :class="{'has-error': apellidoError.state }"/>
      <span class="error" v-if="apellidoError.state"> {{apellidoError.message}} </span>
      <label for="txt_email">Email</label>
      <input v-jump:focus="'txt_password'" ref="txt_email" name="txt_email" maxlength="40" type="text" id="txt_email" v-model='email' :class="{'has-error': emailError.state }"/>
      <span class="error" v-if="emailError.state"> {{emailError.message}} </span>
      <label for="">Fecha de nacimiento</label>
      <Calendar ref="ipt_calendar" name="ipt_calendar" class="form-control form-control-with-icon form-control-date" :class="{'has-error': birthdayError.state}" @change="(date) => this.birthday = date"></Calendar>
      <span class="error" v-if="birthdayError.state"> {{birthdayError.message}} </span>
      <label for="txt_password">Contraseña</label>
      <input v-jump:focus="'txt_password_confirmation'" ref="txt_password" name="txt_password" maxlength="40" type="password" id="txt_password" v-model='password' :class="{'has-error': passwordError.state }"/>
      <span class="error" v-if="passwordError.state"> {{passwordError.message}} </span>
      <label for="txt_password_confirmation">Ingrese nuevamente su contraseña</label>
      <input v-jump:focus="'ipt_terms'" ref="txt_password_confirmation" name="txt_password_confirmation" maxlength="40" type="password" id="txt_password_confirmation" v-model='passwordConfirmation' :class="{'has-error': passwordError.state }" />
      <span class="error" v-if="passwordError.state"> {{passwordError.message}} </span>
      <div class="terms">
        <input v-jump:click="'ipt_submit'" ref="ipt_terms" name="ipt_terms" type="checkbox" id="cbx_terms" v-model='termsAndConditions' />
        <label for="cbx_terms"><router-link :to="{name: 'terms'}">He leído y acepto los términos y condiciones</router-link></label>
        <button ref="ipt_submit" name="ipt_submit" @click="register" class="btn-primary" :disabled="progress || !termsAndConditions"> Registrarme </button>
      </div>
    </div>
    <div class='form row register-success' v-else>
        <h2>Registro Exitoso! </h2>
        <p>Te hemos enviado un código de verificación a tu e-mail para que puedas activar tu cuenta y comenzar a compartir viajes. </p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import dialogs from '../../services/dialogs.js';
import bus from '../../services/bus-event';
import router from '../../router';
import Calendar from '../Calendar';
import moment from 'moment';
let emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
class Error {
    constructor (state = false, message = '') {
        this.state = false;
        this.message = '';
    }
}

export default {
    name: 'register',
    data () {
        return {
            email: '',
            password: '',
            passwordConfirmation: '',
            name: '',
            sureName: '',
            birthday: '',
            termsAndConditions: false,
            carpoolear_logo: process.env.ROUTE_BASE + 'static/img/carpoolear_logo.png',
            progress: false,
            success: false,
            emailError: new Error(),
            passwordError: new Error(),
            nombreError: new Error(),
            apellidoError: new Error(),
            birthdayError: new Error()
        };
    },
    computed: {
        ...mapGetters({
            checkLogin: 'auth/checkLogin',
            isMobile: 'device/isMobile'
        })
    },
    watch: {
        email: function () { this.emailError.state = false; },
        name: function () { this.nombreError.state = false; },
        sureName: function () { this.apellidoError.state = false; },
        password: function () { this.passwordError.state = false; },
        birthday: function () { this.birthdayError.state = false; }
    },
    components: {
        Calendar
    },
    methods: {
        ...mapActions({
            doRegister: 'auth/register'
        }),
        validate () {
            let globalError = false;
            console.log(this.emailError);
            if (this.email.length < 1) {
                this.emailError.state = true;
                this.emailError.message = 'Olvido ingresar su email.';
                globalError = true;
            } else if (!emailRegex.test(this.email)) {
                this.emailError.state = true;
                this.emailError.message = 'Ingrese un email válido.';
                globalError = true;
            }

            if (this.password.length < 1) {
                this.passwordError.state = true;
                this.passwordError.message = 'Olvido ingresar su contraseña.';
                globalError = true;
            } else if (this.password.length < 8) {
                this.passwordError.state = true;
                this.passwordError.message = 'Las contraseña debe tener al menos 8 caracteres.';
                globalError = true;
            } else if (this.passwordConfirmation < 1) {
                this.passwordError.state = true;
                this.passwordError.message = 'Olvido confirmar su contraseña.';
                globalError = true;
            } else if (this.password !== this.passwordConfirmation) {
                this.passwordError.state = true;
                this.passwordError.message = 'Las contraseñas no coinciden.';
                globalError = true;
            }

            if (this.name.length < 1) {
                this.nombreError.state = true;
                this.nombreError.message = 'Olvido ingresar su nombre.';
                globalError = true;
            }

            if (this.sureName.length < 1) {
                this.apellidoError.state = true;
                this.apellidoError.message = 'Olvido ingresar su apellido.';
                globalError = true;
            }

            if (this.birthday.length < 1) {
                this.birthdayError.state = true;
                this.birthdayError.message = 'Olvido ingresar su fecha de nacimiento.';
                globalError = true;
            } else {
                let birthday = moment(this.birthday);
                if (moment().diff(birthday, 'years') < 18) {
                    this.birthdayError.state = true;
                    this.birthdayError.message = 'Lo sentimos, debes ser mayor de edad para usar el servicio. Para más información te recomendamos leer los términos y condiciones.';
                    globalError = true;
                }
            }
            return globalError;
        },

        register (event) {
            if (this.validate()) {
                dialogs.message('Debe corregir o completar algunos campos para finalizar su registro.', { duration: 10, estado: 'error' });
                return;
            }
            let email = this.email;
            let password = this.password;
            let passwordConfirmation = this.passwordConfirmation;
            let name = this.name + ' ' + this.sureName;
            let termsAndConditions = this.termsAndConditions;
            let birthday = this.birthday;
            this.progress = true;
            this.doRegister({email, password, passwordConfirmation, name, birthday, termsAndConditions}).then(() => {
                this.progress = false;
                this.success = true;
            }).catch(() => {
                dialogs.message('La cuenta de email ingresada se encuentra en uso.', {estado: 'error'});
                this.emailError.state = true;
                this.emailError.message = 'La cuenta de email ingresada se encuentra en uso.';
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
        font-weight: bold;
    }
    span.error {
        display: block;
        font-size: 12px;
        margin-top: -5px;
        font-weight: bold;
        color: #24007c;
    }
    .cbx_terms {
        display: inline;
    }
    .register-success * {
        color: #333333;
    }


    @media only screen and (min-width: 768px) {
        .terms button {
            margin-left: 2rem;
            text-align: right;
        }
        span.error {
            color: red;
            font-weight: 300;
        }
    }
</style>
