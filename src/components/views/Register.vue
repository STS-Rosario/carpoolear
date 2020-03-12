<template>
  <div class="register-component user-form container" >
    <router-link v-if="!isMobile"  :to="{name: 'trips'}">
        <img :src="carpoolear_logo" />
    </router-link>
    <!-- <img v-if="isMobile" :src="carpoolear_logo" /> -->
    <h1 v-if="tripCardTheme !== 'light' && !(success && isMobile)"> {{ $t('RegistrarNuevoUsuario') }} </h1>
    <div class='form row' v-if="!success">
      <div v-if="settings.enable_facebook" v-show="!showRegisterForm">
        <div class="col-md-12">
            <div class="text">Con</div>
            <button ref="btn_show_register" id="btn_show_register" class="btn btn-primary btn-shadowed-black" @click="onShowRegister"> <span>{{ $t('ingresaConCuenta') }}</span></button>
        </div>
        <div class="col-md-12">
            <div class="text">O creando una cuenta con</div>
            <button class="btn btn-primary btn-search btn-facebook btn-with-icon" @click="facebookLogin" :disabled="fbLoading"><span class="btn-with-icon--icon"><i class="fa fa-facebook" aria-hidden="true"></i></span><span class='btn-with-icon--label'> <span v-if="!fbLoading">Facebook</span><spinner class="blue" v-if="fbLoading"></spinner></span></button>
            <div class="fb-terms">{{ $t('alIngresarFacebook') }} <router-link :to="{name: 'terms'}">{{ $t('tyc') }}</router-link>.</div>
        </div>
      </div>
      <h1 v-if="tripCardTheme === 'light' && !(success && isMobile)"> {{ $t('RegistrarNuevoUsuario') }} </h1>
      <div v-if="showRegisterForm">
        <div class="campos-obligatorios">{{ $t('camposObligatorios') }}</div>
        <br />
        <label for="txt_name">{{ $t('nombre') }} <span aria-label="Campo obligatorio" class="campo-obligatorio">*</span></label>
        <input :placeholder="$t('nombre')" autofocus v-jump ref="txt_name" name="txt_name" maxlength="25" type="text" id="txt_name" v-model='name' :class="{'has-error': nombreError.state }"/>
        <span class="error" v-if="nombreError.state"> {{nombreError.message}} </span>
        <label for="txt_surename">{{ $t('apellido') }} <span aria-label="Campo obligatorio" class="campo-obligatorio">*</span></label>
        <input :placeholder="$t('apellido')" v-jump ref="txt_surename" name="txt_surename" maxlength="25" type="text" id="txt_surename" v-model='sureName' :class="{'has-error': apellidoError.state }"/>
        <span class="error" v-if="apellidoError.state"> {{apellidoError.message}} </span>
        <label for="txt_email">{{ $t('email') }} <span aria-label="Campo obligatorio" class="campo-obligatorio">*</span></label>
        <input :placeholder="$t('email')" v-jump ref="txt_email" name="txt_email" maxlength="40" type="text" id="txt_email" v-model='email' :class="{'has-error': emailError.state }"/>
        <span class="error" v-if="emailError.state"> {{emailError.message}} </span>
        <!--<label for="">Fecha de nacimiento <span aria-label="Campo obligatorio" class="campo-obligatorio">*</span></label>
        <DatePicker :value="birthday" ref="ipt_calendar" name="ipt_calendar" :maxDate="maxDate" :minDate="minDate" :class="{'has-error': birthdayError.state}" ></DatePicker>-->
        <span class="error" v-if="birthdayError.state"> {{birthdayError.message}} </span>
        <label for="txt_password">{{ $t('password') }} <span aria-label="Campo obligatorio" class="campo-obligatorio">*</span></label>
        <input :placeholder="$t('password')" v-jump ref="txt_password" name="txt_password" maxlength="40" type="password" id="txt_password" v-model='password' :class="{'has-error': passwordError.state }"/>
        <span class="error" v-if="passwordError.state"> {{passwordError.message}} </span>
        <label for="txt_password_confirmation">{{ $t('ingresePassword') }} <span aria-label="Campo obligatorio" class="campo-obligatorio">*</span></label>
        <input :placeholder="$t('ingresePassword')" v-jump ref="txt_password_confirmation" name="txt_password_confirmation" maxlength="40" type="password" id="txt_password_confirmation" v-model='passwordConfirmation' :class="{'has-error': passwordError.state }" />
        <span class="error" v-if="passwordError.state"> {{passwordError.message}} </span>
        <div class="text-left checkbox-container" v-if="settings.module_validated_drivers">
            <input v-jump type="checkbox" @change="changeBeDriver" id="change_be_driver">
            <label for="change_be_driver" class="label-cbx">
                {{ $t('solicitarChofer') }}
            </label>
        </div>
        <div class="form-group text-left" v-if="settings.module_validated_drivers && showBeDriver">
            <label for="driver_documentation">{{ $t('ingresarDocumentacion') }}</label>
            <input type="file" id="driver_documentation" multiple @change="onDriverDocumentChange" />
            <p class="help-block">{{ $t('requisitosRegister') }}</p>
            <div class="form-group">
                <label for="tipoDeCuenta">
                    {{ $t('tipoDeCuenta') }}
                    <span class="required-field-flag" title="Campo requerido">(*)</span>
                </label>
                <select v-model="account_type" id="tipoDeCuenta" class="form-control" :class="{'has-error': accountTypeError.state }">
                    <option v-for="option in accountTypes" v-bind:value="option.id">
                        {{ option.name }}
                    </option>
                </select>
                <span class="error" v-if="accountTypeError.state"> {{accountTypeError.message}} </span>
            </div>
            <div class="form-group">
                <label for="bancoDeCuenta">
                    {{ $t('bancoDeCuenta') }}
                    <span class="required-field-flag" title="Campo requerido">(*)</span>
                </label>
                <select v-model="account_bank" id="" class="form-control" :class="{'has-error': accountBankError.state }">
                    <option v-for="option in banks" v-bind:value="option.id">
                        {{ option.name }}
                    </option>
                </select>
                <span class="error" v-if="accountBankError.state"> {{accountBankError.message}} </span>
            </div>
            <div class="form-group">
                <label for="accountNumber">
                    {{ $t('numeroDeCuenta') }}
                    <span class="required-field-flag" title="Campo requerido">(*)</span>
                </label>
                <input v-model="account_number" type="text" id="accountNumber" :placeholder="$t('numeroDeCuenta')" :class="{'has-error': accountNumberError.state }" />
                <span class="error" v-if="accountNumberError.state"> {{accountNumberError.message}} </span>
            </div>
        </div>
        <div class="terms text-left">
            <input v-jump ref="ipt_terms" name="ipt_terms" type="checkbox" id="cbx_terms" v-model='termsAndConditions' />
            <label for="cbx_terms" class="label-cbx">
                {{ $t('leidoTerminos1') }} <router-link :to="{name: 'terms'}">{{ $t('leidoTerminos2') }}</router-link>.
            </label>
            <button v-jump ref="ipt_submit" name="ipt_submit" @click="register" class="btn-primary btn-outline" :disabled="progress || !termsAndConditions">
                <span v-if="!progress">{{ $t('registrarme') }}</span><spinner class="blue" v-if="progress"></spinner>
            </button>
        </div>
      </div>
    </div>
    <div class='form row register-success' v-else>
        <h2> {{ $t('registroExitoso') }} </h2>
        <p>{{ $t('enviadoCodigoVerificacion') }} </p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import dialogs from '../../services/dialogs.js';
import bus from '../../services/bus-event';
import router from '../../router';
import DatePicker from '../DatePicker';
import moment from 'moment';
import Spinner from '../Spinner.vue';
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
            account_number: '',
            account_type: '',
            account_bank: '',
            termsAndConditions: false,
            carpoolear_logo: process.env.ROUTE_BASE + 'static/img/' + process.env.TARGET_APP + '_logo.png',
            progress: false,
            success: false,
            emailError: new Error(),
            passwordError: new Error(),
            nombreError: new Error(),
            apellidoError: new Error(),
            birthdayError: new Error(),
            accountNumberError: new Error(),
            accountTypeError: new Error(),
            accountBankError: new Error(),
            maxDate: moment().toDate(),
            minDate: moment('1900-01-01').toDate(),
            showBeDriver: false,
            driverFiles: null,
            banks: [],
            accountTypes: [],
            loading: false,
            fbLoading: false,
            showRegister: false
        };
    },
    computed: {
        ...mapGetters({
            checkLogin: 'auth/checkLogin',
            isMobile: 'device/isMobile',
            settings: 'auth/appConfig',
            registerData: 'profile/registerData'
        }),
        tripCardTheme () {
            return this.settings ? this.settings.trip_card_design : '';
        },
        showRegisterForm () {
            return !this.settings.enable_facebook || this.showRegister;
        }
    },
    watch: {
        email: function () { this.emailError.state = false; },
        name: function () { this.nombreError.state = false; },
        sureName: function () { this.apellidoError.state = false; },
        password: function () { this.passwordError.state = false; },
        birthdayAnswer: function () { this.birthdayError.state = false; }
    },
    components: {
        DatePicker,
        Spinner
    },
    methods: {
        ...mapActions({
            doRegister: 'auth/register',
            getBankData: 'profile/getBankData',
            saveRegisterData: 'profile/saveRegisterData',
            cleanRegisterData: 'profile/cleanRegisterData',
            fbLogin: 'cordova/facebookLogin'
        }),
        onShowRegister () {
            this.showRegister = true;
        },
        facebookLogin () {
            if (!this.loading) {
                this.fbLoading = true;
                this.fbLogin().catch((response) => {
                    if (response.errors && response.errors.email) {
                        dialogs.message(this.$t('correoUsado'), { duration: 10, estado: 'error' });
                    }
                });
            } else {
                dialogs.message(this.$t('solicitudEnviada'), { duration: 10, estado: 'error' });
            }
        },
        validate () {
            let globalError = false;
            if (this.email.length < 1) {
                this.emailError.state = true;
                this.emailError.message = this.$t('olvidoEmail');
                globalError = true;
            } else if (!emailRegex.test(this.email)) {
                this.emailError.state = true;
                this.emailError.message = this.$t('ingreseEmailValido');
                globalError = true;
            }

            if (this.password.length < 1) {
                this.passwordError.state = true;
                this.passwordError.message = this.$t('olvidoContrasena');
                globalError = true;
            } else if (this.password.length < 8) {
                this.passwordError.state = true;
                this.passwordError.message = this.$t('contraCorta');
                globalError = true;
            } else if (this.passwordConfirmation < 1) {
                this.passwordError.state = true;
                this.passwordError.message = this.$t('olvidoConfirmarContra');
                globalError = true;
            } else if (this.password !== this.passwordConfirmation) {
                this.passwordError.state = true;
                this.passwordError.message = this.$t('contraNoCoinciden');
                globalError = true;
            }

            if (this.name.length < 1) {
                this.nombreError.state = true;
                this.nombreError.message = this.$t('olvidoNombre');
                globalError = true;
            }

            if (this.sureName.length < 1) {
                this.apellidoError.state = true;
                this.apellidoError.message = this.$t('olvidoApellido');
                globalError = true;
            }

            /* console.log(this.birthdayAnswer);
            if (!this.birthdayAnswer || this.birthdayAnswer.length < 1) {
                this.birthdayError.state = true;
                this.birthdayError.message = 'Olvido ingresar su fecha de nacimiento.';
                globalError = true;
            } else {
                let birthday = moment(this.birthdayAnswer);
                if (moment().diff(birthday, 'years') < 18) {
                    this.birthdayError.state = true;
                    this.birthdayError.message = 'Lo sentimos, debes ser mayor de edad para usar el servicio. Para más información te recomendamos leer los términos y condiciones.';
                    globalError = true;
                }
            } */

            if (this.settings.module_validated_drivers && this.showBeDriver) {
                if (!this.account_number) {
                    this.accountNumberError.state = true;
                    this.accountNumberError.message = this.$t('campoObligatorio');
                    globalError = true;
                }
                if (!this.account_type) {
                    this.accountTypeError.state = true;
                    this.accountTypeError.message = this.$t('campoObligatorio');
                    globalError = true;
                }
                if (!this.account_bank) {
                    this.accountBankError.state = true;
                    this.accountBankError.message = this.$t('campoObligatorio');
                    globalError = true;
                }
            }
            return globalError;
        },
        onDriverDocumentChange (event) {
            console.log('file input ', event);
            if (event.target.files) {
                this.driverFiles = event.target.files;
            }
        },
        changeBeDriver () {
            this.showBeDriver = !this.showBeDriver;
        },
        dateChange (value) {
            this.birthdayAnswer = value;
        },
        jumpToError () {
            let hasError = document.getElementsByClassName('has-error');
            if (hasError.length) {
                let element = hasError[0];
                this.$scrollToElement(element);
            }
        },
        register (event) {
            if (this.validate()) {
                // Jump To Error
                this.$nextTick(() => {
                    this.jumpToError();
                    dialogs.message(this.$t('debeCorregirCampos'), { duration: 10, estado: 'error' });
                });
                return;
            }
            this.progress = true;
            let data = {
                email: this.email,
                password: this.password,
                password_confirmation: this.passwordConfirmation,
                name: this.name + ' ' + this.sureName,
                terms_and_conditions: this.termsAndConditions,
                birthday: this.birthdayAnswer,
                account_number: this.account_number,
                account_type: this.account_type,
                account_bank: this.account_bank
            };
            /* global FormData */
            let bodyFormData = new FormData();
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    bodyFormData.append(key, data[key]);
                }
            }
            if (this.driverFiles) {
                bodyFormData.append('user_be_driver', true);
                console.log('file', this.driverFiles);
                for (let index = 0; index < this.driverFiles.length; index++) {
                    const file = this.driverFiles[index];
                    console.log('file', file);
                    bodyFormData.append('driver_data_docs[]', file);
                }
            }
            this.doRegister(bodyFormData).then(() => {
                this.progress = false;
                this.success = true;
            }).catch((err) => {
                console.log(err);
                if (err) {
                    console.log(err);
                    if (err.status === 422) {
                        if (err.data && err.data.errors && err.data.errors.email) {
                            dialogs.message(this.$t('mailEnUso'), { estado: 'error' });
                            this.emailError.state = true;
                            this.emailError.message = this.$t('mailEnUso');
                            this.jumpToError();
                        } else {
                            dialogs.message(this.$t('debeCorregirCampos'), { estado: 'error' });
                        }
                    } else {
                        dialogs.message(this.$t('errorRegistro'), { estado: 'error' });
                    }
                }
                this.progress = false;
            });
        },
        onBackClick () {
            router.back();
        }
    },
    mounted () {
        bus.on('back-click', this.onBackClick);
        bus.on('date-change', this.dateChange);
        if (this.registerData) {
            Object.assign(this, this.registerData);
        }
        this.getBankData().then((data) => {
            console.log('get bank data', data);
            this.banks = data.banks;
            this.accountTypes = data.cc;
        });
    },

    beforeDestroy () {
        console.log(this.$route.name);
        if (this.$route.name === 'terms') {
            this.saveRegisterData(this.$data);
        } else {
            this.cleanRegisterData();
        }
        bus.off('back-click', this.onBackClick);
        bus.off('date-change', this.dateChange);
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
    .campo-obligatorio,
    .campos-obligatorios {
        color: red;
    }
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
    h2 {
        color: #fff;
    }

    @media only screen and (min-width: 768px) {
        .user-form .btn-primary {
            text-align: center;
            max-width: 280px;
            padding: 1em;
            margin-bottom: 1em;
        }
        h2 {
            color: #036686;
        }
        .terms button {
            margin-left: 2rem;
            text-align: right;
        }
        span.error {
            color: red;
            font-weight: 300;
        }
    }
    .label-cbx {
        vertical-align: middle;
    }
    input[type=checkbox] {
        margin-top: -2px;
        vertical-align: middle;
    }
    .checkbox-container {
        margin-top: 1.5rem;
    }
    input[type=file] {
        color: white;
    }
    #btn_show_register {
        border-color: #222;
        background: #444;
    }
    .fb-terms {
        font-size: 0.9em;
    }
</style>
