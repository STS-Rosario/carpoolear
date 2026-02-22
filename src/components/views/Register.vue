<template>
    <div class="register-component user-form container">
        <router-link v-if="!isMobile" :to="{ name: 'trips' }">
            <img :src="carpoolear_logo" />
        </router-link>
        <!-- <img v-if="isMobile" :src="carpoolear_logo" /> -->
        <h1 v-if="tripCardTheme !== 'light' && !(success && isMobile)">
            {{ t('RegistrarNuevoUsuario') }}
        </h1>
        <div class="form row" v-if="!success">
            <div v-if="settings.enable_facebook" v-show="!showRegisterForm">
                <div class="col-md-12">
                    <div class="text text-with">con</div>

                    <button
                        ref="btn_show_register"
                        id="btn_show_register"
                        class="btn btn-primary btn-shadowed-black btn-with-icon btn-email"
                        @click="onShowRegister"
                    >
                        <span class="btn-with-icon--icon">
                            <i class="fa fa-envelope" aria-hidden="true"></i>
                        </span>
                        <span class="btn-with-icon--label">
                            <span>{{ t('ingresaEmail') }}</span>
                        </span>
                    </button>
                </div>
                <div class="col-md-12">
                    <div class="text text-creating-with-fb">
                        {{ t('creandoUnaCuenta') }}
                    </div>
                    <button
                        class="btn btn-primary btn-search btn-facebook btn-with-icon"
                        @click="facebookLogin"
                        :disabled="fbLoading"
                    >
                        <span class="btn-with-icon--icon">
                            <i class="fa fa-facebook" aria-hidden="true"></i>
                        </span>
                        <span class="btn-with-icon--label">
                            <span v-if="!fbLoading">Facebook</span>
                            <spinner class="blue" v-if="fbLoading"></spinner>
                        </span>
                    </button>
                    <div class="fb-terms">
                        {{ t('alIngresarFacebook') }}
                        <router-link :to="{ name: 'terms' }">{{
                            t('tyc')
                        }}</router-link>
                        .
                    </div>
                </div>
            </div>
            <h1 v-if="tripCardTheme === 'light' && !(success && isMobile)">
                {{ t('RegistrarNuevoUsuario') }}
            </h1>
            <div v-if="showRegisterForm">
                <div class="campos-obligatorios">
                    {{ t('camposObligatorios') }}
                </div>
                <br />
                <label for="txt_name">
                    {{ t('nombre') }}
                    <span
                        :aria-label="t('campoObligatorio')"
                        class="campo-obligatorio"
                        >*</span>

                </label>
                <input
                    :placeholder="t('nombre')"
                    autofocus
                    v-jump
                    ref="txt_name"
                    name="txt_name"
                    maxlength="25"
                    type="text"
                    id="txt_name"
                    v-model="name"
                    :class="{ 'has-error': nombreError.state }"
                />
                <span class="error" v-if="nombreError.state">
                    {{ nombreError.message }}
                </span>
                <label for="txt_surename">
                    {{ t('apellido') }}
                    <span
                        :aria-label="t('campoObligatorio')"
                        class="campo-obligatorio"
                        >*</span
                    >
                </label>
                <input
                    :placeholder="t('apellido')"
                    v-jump
                    ref="txt_surename"
                    name="txt_surename"
                    maxlength="25"
                    type="text"
                    id="txt_surename"
                    v-model="sureName"
                    :class="{ 'has-error': apellidoError.state }"
                />
                <span class="error" v-if="apellidoError.state">
                    {{ apellidoError.message }}
                </span>
                <label for="txt_email">
                    {{ t('email') }}
                    <span
                        :aria-label="t('campoObligatorio')"
                        class="campo-obligatorio"
                        >*</span
                    >
                </label>
                <input
                    :placeholder="t('email')"
                    v-jump
                    ref="txt_email"
                    name="txt_email"
                    maxlength="40"
                    type="text"
                    id="txt_email"
                    v-model="email"
                    :class="{ 'has-error': emailError.state }"
                />
                <span class="error" v-if="emailError.state">
                    {{ emailError.message }}
                </span>

                <label for="txt_email_verification">
                    {{ t('emailVerification') }}
                    <span
                        :aria-label="t('campoObligatorio')"
                        class="campo-obligatorio"
                        >*</span
                    >
                </label>
                <input
                    :placeholder="t('emailVerification')"
                    v-jump
                    ref="txt_email_verification"
                    name="txt_email_verification"
                    maxlength="40"
                    type="text"
                    id="txt_email_verification"
                    v-model="emailVerification"
                    :class="{ 'has-error': emailVerificationError.state }"
                />
                <span class="error" v-if="emailVerificationError.state">
                    {{ emailVerificationError.message }}
                </span>

                <span class="error" v-if="birthdayError.state">
                    {{ birthdayError.message }}
                </span>
                <label for="txt_password">
                    {{ t('password') }}
                    <span
                        :aria-label="t('campoObligatorio')"
                        class="campo-obligatorio"
                        >*</span
                    >
                </label>
                <input
                    :placeholder="t('password')"
                    v-jump
                    ref="txt_password"
                    name="txt_password"
                    maxlength="40"
                    type="password"
                    id="txt_password"
                    v-model="password"
                    :class="{ 'has-error': passwordError.state }"
                />
                <span class="error" v-if="passwordError.state">
                    {{ passwordError.message }}
                </span>
                <label for="txt_password_confirmation">
                    {{ t('ingresePassword') }}
                    <span
                        :aria-label="t('campoObligatorio')"
                        class="campo-obligatorio"
                        >*</span
                    >
                </label>
                <input
                    :placeholder="t('ingresePassword')"
                    v-jump
                    ref="txt_password_confirmation"
                    name="txt_password_confirmation"
                    maxlength="40"
                    type="password"
                    id="txt_password_confirmation"
                    v-model="passwordConfirmation"
                    :class="{ 'has-error': passwordError.state }"
                />
                <span class="error" v-if="passwordError.state">
                    {{ passwordError.message }}
                </span>
                <div
                    class="text-left checkbox-container"
                    v-if="settings.module_validated_drivers"
                >
                    <input
                        v-jump
                        type="checkbox"
                        @change="changeBeDriver"
                        id="change_be_driver"
                    />
                    <label for="change_be_driver" class="label-cbx">
                        {{ t('solicitarChofer') }}
                    </label>
                </div>
                <div
                    class="form-group text-left"
                    v-if="settings.module_validated_drivers && showBeDriver"
                >
                    <label for="driver_documentation">{{
                        t('ingresarDocumentacion')
                    }}</label>
                    <input
                        type="file"
                        id="driver_documentation"
                        multiple
                        @change="onDriverDocumentChange"
                    />
                    <p class="help-block">{{ t('requisitosRegister') }}</p>
                    <div class="form-group">
                        <label for="tipoDeCuenta">
                            {{ t('tipoDeCuenta') }}
                            <span
                                class="required-field-flag"
                                :title="t('tituloCampoRequerido')"
                                >(*)</span
                            >
                        </label>
                        <select
                            v-model="account_type"
                            id="tipoDeCuenta"
                            class="form-control"
                            :class="{ 'has-error': accountTypeError.state }"
                        >
                            <option
                                v-for="option in accountTypes"
                                v-bind:value="option.id"
                            >
                                {{ option.name }}
                            </option>
                        </select>
                        <span class="error" v-if="accountTypeError.state">
                            {{ accountTypeError.message }}
                        </span>
                    </div>
                    <div class="form-group">
                        <label for="bancoDeCuenta">
                            {{ t('bancoDeCuenta') }}
                            <span
                                class="required-field-flag"
                                :title="t('tituloCampoRequerido')"
                                >(*)</span
                            >
                        </label>
                        <select
                            v-model="account_bank"
                            id=""
                            class="form-control"
                            :class="{ 'has-error': accountBankError.state }"
                        >
                            <option
                                v-for="option in banks"
                                v-bind:value="option.id"
                            >
                                {{ option.name }}
                            </option>
                        </select>
                        <span class="error" v-if="accountBankError.state">
                            {{ accountBankError.message }}
                        </span>
                    </div>
                    <div class="form-group">
                        <label for="accountNumber">
                            {{ t('numeroDeCuenta') }}
                            <span
                                class="required-field-flag"
                                :title="t('tituloCampoRequerido')"
                                >(*)</span
                            >
                        </label>
                        <input
                            v-model="account_number"
                            type="text"
                            id="accountNumber"
                            :placeholder="t('numeroDeCuenta')"
                            :class="{ 'has-error': accountNumberError.state }"
                        />
                        <span class="error" v-if="accountNumberError.state">
                            {{ accountNumberError.message }}
                        </span>
                    </div>
                </div>
                <div class="terms text-left">
                    <input
                        v-jump
                        ref="ipt_terms"
                        name="ipt_terms"
                        type="checkbox"
                        id="cbx_terms"
                        v-model="termsAndConditions"
                    />
                    <label for="cbx_terms" class="label-cbx">
                        {{ t('leidoTerminos1') }}
                        <router-link :to="{ name: 'terms' }">
                            {{ t('leidoTerminos2') }}
                        </router-link>
                        .
                    </label>
                    <button
                        v-jump
                        ref="ipt_submit"
                        name="ipt_submit"
                        @click="register"
                        class="btn-primary btn-outline g-recaptcha"
                        :disabled="progress || !termsAndConditions"
                        v-bind:data-sitekey="RECAPTCHA_SITE_KEY"
                    >
                        <span v-if="!progress">{{ t('registrarme') }}</span>
                        <spinner class="blue" v-if="progress"></spinner>
                    </button>
                </div>
            </div>

            <modal
                name="emailTakenModal"
                v-if="showEmailTakenModal"
                @close="toggleEmailTakenModal"
            >
                <template #header>
                    <h3>
                        <span>{{ t('emailYaTomado') }}</span>
                        <i
                            v-on:click="toggleEmailTakenModal"
                            class="fa fa-times float-right-close"
                        ></i>
                    </h3>
                </template>
                <template #body>
                    <div class="text-left color-black login-modal">
                        <p>
                            {{ t('emailYaTomadoDescripcion') }}
                        </p>
                        <p>
                            {{ t('mesaAyudaFuncionaDesde') }}
                            <a :href="'mailto:' + settings.admin_email">
                                {{ settings.admin_email }}</a>,
                            {{ t('mensajePrivadoDe') }}
                            <a href="https://instagram.com/carpoolear"
                                >Instagram</a
                            >
                            {{ t('y') }}
                            <a href="https://facebook.com/carpoolear"
                                >Facebook</a
                            >.
                        </p>
                    </div>
                </template>
            </modal>
        </div>
        <div class="form row register-success" v-else>
            <h2>{{ t('registroExitoso') }}</h2>
            <p>
                {{
                    active
                        ? t('usuarioRegistrado')
                        : t('enviadoCodigoVerificacion')
                }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { useDeviceStore } from '@/stores/device';
import { useProfileStore } from '@/stores/profile';
import { useCordovaStore } from '@/stores/cordova';
import dialogs from '../../services/dialogs.js';
import bus from '../../services/bus-event';
import DatePicker from '../DatePicker';
import modal from '../Modal';
import moment from 'moment';
import Spinner from '../Spinner.vue';

let emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

class FieldError {
    constructor(state = false, message = '') {
        this.state = false;
        this.message = '';
    }
}

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const deviceStore = useDeviceStore();
const profileStore = useProfileStore();
const cordovaStore = useCordovaStore();

const active = ref(false);
const email = ref('');
const emailVerification = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const name = ref('');
const sureName = ref('');
const birthday = ref('');
const account_number = ref('');
const account_type = ref('');
const account_bank = ref('');
const termsAndConditions = ref(false);
const ROUTE_BASE = import.meta.env.VITE_ROUTE_BASE || '/';
const TARGET_APP = import.meta.env.VITE_TARGET_APP || 'carpoolear';
const carpoolear_logo = ROUTE_BASE + 'static/img/' + TARGET_APP + '_logo.png';
const progress = ref(false);
const success = ref(false);
const emailError = reactive(new FieldError());
const emailVerificationError = reactive(new FieldError());
const passwordError = reactive(new FieldError());
const nombreError = reactive(new FieldError());
const apellidoError = reactive(new FieldError());
const birthdayError = reactive(new FieldError());
const accountNumberError = reactive(new FieldError());
const accountTypeError = reactive(new FieldError());
const accountBankError = reactive(new FieldError());
const maxDate = moment().toDate();
const minDate = moment('1900-01-01').toDate();
const showBeDriver = ref(false);
const driverFiles = ref(null);
const banks = ref([]);
const accountTypes = ref([]);
const loading = ref(false);
const fbLoading = ref(false);
const showRegister = ref(false);
const showEmailTakenModal = ref(false);

const checkLogin = computed(() => authStore.checkLogin);
const isMobile = computed(() => deviceStore.isMobile);
const settings = computed(() => authStore.appConfig);
const registerData = computed(() => profileStore.registerData);

const tripCardTheme = computed(() => {
    return settings.value ? settings.value.trip_card_design : '';
});

const showRegisterForm = computed(() => {
    return !settings.value.enable_facebook || showRegister.value;
});

watch(email, () => { emailError.state = false; });
watch(emailVerification, () => { emailVerificationError.state = false; });
watch(name, () => { nombreError.state = false; });
watch(sureName, () => { apellidoError.state = false; });
watch(password, () => { passwordError.state = false; });

const onShowRegister = () => {
    showRegister.value = true;
};

const toggleEmailTakenModal = () => {
    showEmailTakenModal.value = !showEmailTakenModal.value;
};

const facebookLogin = () => {
    if (!loading.value) {
        fbLoading.value = true;
        cordovaStore.facebookLogin().catch((response) => {
            if (response.errors && response.errors.email) {
                dialogs.message(t('correoUsado'), {
                    duration: 10,
                    estado: 'error'
                });
            }
        });
    } else {
        dialogs.message(t('solicitudEnviada'), {
            duration: 10,
            estado: 'error'
        });
    }
};

const validate = () => {
    let globalError = false;
    if (email.value.length < 1) {
        emailError.state = true;
        emailError.message = t('olvidoEmail');
        globalError = true;
    } else if (!emailRegex.test(email.value)) {
        emailError.state = true;
        emailError.message = t('ingreseEmailValido');
        globalError = true;
    }

    if (emailVerification.value.length < 1) {
        emailVerificationError.state = true;
        emailVerificationError.message = t('olvidoEmail');
        globalError = true;
    } else if (!emailRegex.test(emailVerification.value)) {
        emailVerificationError.state = true;
        emailVerificationError.message = t('ingreseEmailValido');
        globalError = true;
    } else if (email.value !== emailVerification.value) {
        emailVerificationError.state = true;
        emailVerificationError.message = t('emailsNoCoinciden');
        globalError = true;
    }

    if (password.value.length < 1) {
        passwordError.state = true;
        passwordError.message = t('olvidoContrasena');
        globalError = true;
    } else if (password.value.length < 8) {
        passwordError.state = true;
        passwordError.message = t('contraCorta');
        globalError = true;
    } else if (passwordConfirmation.value < 1) {
        passwordError.state = true;
        passwordError.message = t('olvidoConfirmarContra');
        globalError = true;
    } else if (password.value !== passwordConfirmation.value) {
        passwordError.state = true;
        passwordError.message = t('contraNoCoinciden');
        globalError = true;
    }

    if (name.value.length < 1) {
        nombreError.state = true;
        nombreError.message = t('olvidoNombre');
        globalError = true;
    }

    if (sureName.value.length < 1) {
        apellidoError.state = true;
        apellidoError.message = t('olvidoApellido');
        globalError = true;
    }

    if (settings.value.module_validated_drivers && showBeDriver.value) {
        if (!account_number.value) {
            accountNumberError.state = true;
            accountNumberError.message = t('campoObligatorio');
            globalError = true;
        }
        if (!account_type.value) {
            accountTypeError.state = true;
            accountTypeError.message = t('campoObligatorio');
            globalError = true;
        }
        if (!account_bank.value) {
            accountBankError.state = true;
            accountBankError.message = t('campoObligatorio');
            globalError = true;
        }
    }
    return globalError;
};

const onDriverDocumentChange = (event) => {
    console.log('file input ', event);
    if (event.target.files) {
        driverFiles.value = event.target.files;
    }
};

const changeBeDriver = () => {
    showBeDriver.value = !showBeDriver.value;
};

const dateChange = (value) => {
    birthday.value = value;
};

const jumpToError = () => {
    let hasError = document.getElementsByClassName('has-error');
    if (hasError.length) {
        let element = hasError[0];
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

const register = (event) => {
    grecaptcha.ready(function () {
        grecaptcha
            .execute(RECAPTCHA_SITE_KEY, {
                action: 'submit'
            })
            .then(function (token) {
                if (validate()) {
                    nextTick(() => {
                        jumpToError();
                        dialogs.message(t('debeCorregirCampos'), {
                            duration: 10,
                            estado: 'error'
                        });
                    });
                    return;
                }
                progress.value = true;
                let data = {
                    email: email.value,
                    password: password.value,
                    password_confirmation: passwordConfirmation.value,
                    name: name.value + ' ' + sureName.value,
                    terms_and_conditions: termsAndConditions.value,
                    birthday: birthday.value,
                    account_number: account_number.value,
                    account_type: account_type.value,
                    account_bank: account_bank.value,
                    token
                };
                let bodyFormData = new FormData();
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        bodyFormData.append(key, data[key]);
                    }
                }
                if (driverFiles.value) {
                    bodyFormData.append('user_be_driver', true);
                    for (let index = 0; index < driverFiles.value.length; index++) {
                        const file = driverFiles.value[index];
                        bodyFormData.append('driver_data_docs[]', file);
                    }
                }
                authStore.register(bodyFormData)
                    .then((registerDataResult) => {
                        if (
                            registerDataResult &&
                            registerDataResult.data &&
                            registerDataResult.data.active
                        ) {
                            active.value = true;
                        }
                        progress.value = false;
                        success.value = true;
                    })
                    .catch((err) => {
                        console.log('catch', err);
                        if (err) {
                            if (err.status === 422) {
                                const emailErrorMsg =
                                    err.data.errors.email[0] || '';
                                const isEmailTaken =
                                    emailErrorMsg.indexOf('been taken') >= 0 ||
                                    emailErrorMsg.indexOf('ya ha sido tomado') >= 0;
                                if (
                                    err.data &&
                                    err.data.errors &&
                                    err.data.errors.email &&
                                    Array.isArray(err.data.errors.email) &&
                                    err.data.errors.email.length > 0 &&
                                    isEmailTaken
                                ) {
                                    showEmailTakenModal.value = true;
                                    emailError.state = true;
                                    emailError.message = t('emailYaTomado');
                                    jumpToError();
                                } else {
                                    dialogs.message(t('debeCorregirCampos'), {
                                        estado: 'error'
                                    });
                                }
                            } else {
                                dialogs.message(t('errorRegistro'), {
                                    estado: 'error'
                                });
                            }
                        }
                        progress.value = false;
                    });
            });
    });
};

const onBackClick = () => {
    router.back();
};

onMounted(() => {
    bus.on('back-click', onBackClick);
    bus.on('date-change', dateChange);
    if (registerData.value) {
        // Restore saved register data
        const rd = registerData.value;
        if (rd.email) email.value = rd.email;
        if (rd.emailVerification) emailVerification.value = rd.emailVerification;
        if (rd.name) name.value = rd.name;
        if (rd.sureName) sureName.value = rd.sureName;
        if (rd.password) password.value = rd.password;
        if (rd.passwordConfirmation) passwordConfirmation.value = rd.passwordConfirmation;
        if (rd.termsAndConditions) termsAndConditions.value = rd.termsAndConditions;
    }
    profileStore.getBankData().then((data) => {
        console.log('get bank data', data);
        banks.value = data.banks;
        accountTypes.value = data.cc;
    });

    if (!document.querySelector(`script[src*="recaptcha/api.js"]`)) {
        let recaptchaScript = document.createElement('script');
        recaptchaScript.setAttribute(
            'src',
            `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
        );
        document.head.appendChild(recaptchaScript);
    }
});

onBeforeUnmount(() => {
    if (route.name === 'terms') {
        profileStore.saveRegisterData({
            email: email.value,
            emailVerification: emailVerification.value,
            name: name.value,
            sureName: sureName.value,
            password: password.value,
            passwordConfirmation: passwordConfirmation.value,
            termsAndConditions: termsAndConditions.value
        });
    } else {
        profileStore.cleanRegisterData();
    }
    bus.off('back-click', onBackClick);
    bus.off('date-change', dateChange);
});
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
input[type='checkbox'] {
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
input[type='checkbox'] {
    margin-top: -2px;
    vertical-align: middle;
}
.checkbox-container {
    margin-top: 1.5rem;
}
input[type='file'] {
    color: white;
}
#btn_show_register {
    border-color: #222;
    background: #444;
}
.fb-terms {
    font-size: 0.9em;
}
.text-creating-with-fb {
    margin: 1em 0;
}
@media (min-width: 768px) {
    .text-with,
    .text-creating-with-fb {
        margin: 0.5em 0;
    }
    .text-with::first-letter,
    .text-creating-with-fb::first-letter {
        text-transform: capitalize;
    }
}
</style>
