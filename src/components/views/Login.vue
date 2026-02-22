<template>
    <div class="user-form container">
        <router-link v-if="isDesktop" :to="{ name: 'trips' }">
            <img :src="carpoolear_logo" />
        </router-link>
        <div class="login-header">
            <h1 v-if="!(hasScroll && isMobile)">
                {{ t('iniciarSesion') }}
                <!-- <span class='brand' v-if="!loginCustomHeader">{{ t('carpoolear') }}</span> -->
            </h1>
            <div
                class="col-sm-12 col-md-12"
                v-show="isMobile && loginCustomHeader"
            >
                <img class="login-custom-header--logo" :src="app_logo" />
            </div>
        </div>
        <div class="form row">
            <div class="alert alert-warning" role="alert" v-if="!isUnderstood">
                {{ t('recuperarDeFacebook') }}
                <a :href="'mailto:' + config.admin_email">{{
                    t('carpoolearMail')
                }}</a>
                {{ t('recuperarDeFacebook2') }}
                <div class="row form-inline form-warning-login">
                    <div class="col-sm-24 text-right">
                        <div class="checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    v-model="dontShowAgain"
                                />
                                <span>{{ t('noMostrar') }}</span>
                            </label>
                        </div>
                        <button
                            type="button"
                            class="btn btn-default"
                            @click="fbWarningGetIt"
                        >
                            {{ t('entendido') }}
                        </button>
                    </div>
                </div>
            </div>

            <div class="login-box" :class="[righPanelclass]">
                <label v-show="!loginCustomHeader" for="txt_user">{{
                    t('email')
                }}</label>
                <div class="visual-trick">
                    <input
                        :placeholder="t('loginUsuarioPlaceholder')"
                        ref="txt_user"
                        type="email"
                        id="txt_user"
                        v-model="email"
                        v-jump
                    />
                    <label for="txt_password" v-show="isDesktop">{{
                        t('password')
                    }}</label>
                    <input
                        :placeholder="t('loginPasswordPlaceholder')"
                        ref="txt_password"
                        type="password"
                        id="txt_password"
                        v-jump
                        v-model="password"
                    />
                    <div
                        class="alert alert-info"
                        role="alert"
                        v-if="showUserNotActiveInfo"
                    >
                        {{ t('debeActivarCuenta') }}
                    </div>
                    <div
                        class="alert alert-info"
                        role="alert"
                        v-if="showUserBannedInfo"
                    >
                        {{ t('usuarioBanneado') }}
                    </div>
                    <button
                        v-jump
                        ref="btn_login"
                        id="btn_login"
                        class="btn btn-primary btn-shadowed-black"
                        @click="login"
                        :disabled="loading"
                    >
                        <span v-if="!loading">{{ t('ingresar') }}</span>
                        <spinner class="blue" v-if="loading"></spinner>
                    </button>
                </div>
                <div class="pass-options" v-if="isDesktop">
                    <input id="checkbox_remember" type="checkbox" />
                    <label for="checkbox_remember">{{
                        t('recordarme')
                    }}</label>
                    <span v-show="!loginCustomHeader">-</span>
                    <router-link
                        class="login-forget"
                        :to="{ name: 'reset-password' }"
                    >
                        {{ t('olvideContra') }}
                    </router-link>
                </div>
            </div>
            <div style="col-sm-12" v-show="isMobile">
                <router-link
                    class="password-not"
                    :to="{ name: 'reset-password' }"
                >
                    {{ t('olvideContra') }}
                </router-link>
            </div>
            <div class="col-sm-12 col-md-12" v-show="isMobile">
                <span class="register" v-if="isMobile">
                    {{ t('noTenesFace') }}
                    <router-link
                        class="login-register"
                        :to="{ name: 'register' }"
                    >
                        {{ t('registrateAca') }}
                    </router-link>
                </span>
            </div>

            <div
                class="col-sm-12 col-md-12"
                v-show="isMobile"
            >
                <hr />
                <button
                    class="btn btn-primary btn-search btn-apple btn-with-icon"
                    @click="toggleModalLogin('apple')"
                    :disabled="iosLoading"
                    v-if="isApple"
                >
                    <span class="btn-with-icon--icon">
                        <i class="fa fa-apple" aria-hidden="true"></i>
                    </span>
                    <span class="btn-with-icon--label">
                        <span v-if="!iosLoading">{{
                            t('ingresaConApple')
                        }}</span>
                        <spinner class="blue" v-if="iosLoading"></spinner>
                    </span>
                </button>
                <!-- <div class="fb-terms">{{ t('alIngresarFacebook') }} <router-link :to="{name: 'terms'}">{{ t('tyc') }}</router-link>.</div> -->
            </div>
            <div
                class="login-box"
                :class="[righPanelclass]"
                v-show="!isShowLogin && isDesktop"
            >
                <div>
                    <span class="register">
                        {{ t('noTenesFace') }}
                        <router-link
                            class="login-register"
                            :to="{ name: 'register' }"
                        >
                            {{ t('registrateAca') }}
                        </router-link>
                    </span>
                </div>
            </div>

            <div
                class="facebook-box"
                :class="[righPanelclass]"
                v-show="isDesktop"
            >
                <span class="register" v-show="isShowLogin">
                    {{ t('noTenesFace') }}>
                    <router-link
                        class="login-register"
                        :to="{ name: 'register' }"
                    >
                        {{ t('registrateAca') }}
                    </router-link>
                </span>
                <button
                    class="btn-primary btn-search btn-facebook btn-with-icon"
                    @click="facebookLogin"
                    :disabled="fbLoading"
                    v-show="config.enable_facebook"
                >
                    <span class="btn-with-icon--icon">
                        <i class="fa fa-facebook" aria-hidden="true"></i>
                    </span>
                    <span class="btn-with-icon--label">
                        <span v-if="!fbLoading">{{
                            t('ingresaConFace')
                        }}</span>
                        <spinner class="blue" v-if="fbLoading"></spinner>
                    </span>
                </button>
                <div v-show="config.enable_facebook">
                    {{ t('alIngresarFace') }}
                    <router-link :to="{ name: 'terms' }">{{
                        t('tyc')
                    }}</router-link>
                    .
                </div>

                <button
                    class="btn btn-primary btn-search btn-apple btn-with-icon"
                    @click="toggleModalLogin('apple')"
                    :disabled="iosLoading"
                    v-if="isApple"
                >
                    <span class="btn-with-icon--icon">
                        <i class="fa fa-apple" aria-hidden="true"></i>
                    </span>
                    <span class="btn-with-icon--label">
                        <span v-if="!iosLoading">{{
                            t('ingresaConApple')
                        }}</span>
                        <spinner class="blue" v-if="iosLoading"></spinner>
                    </span>
                </button>
                <div v-show="isApple">
                    {{ t('alIngresarApple') }}
                    <router-link :to="{ name: 'terms' }">{{
                        t('tyc')
                    }}</router-link>
                    .
                </div>
            </div>
            <div class="col-sm-12 col-md-12">
                <button
                    class="btn btn-primary btn-search btn-facebook btn-with-icon"
                    @click="toggleModalLogin('facebook')"
                >
                    <span class="btn-with-icon--icon">
                        <i class="fa fa-facebook" aria-hidden="true"></i>
                    </span>
                    <span class="btn-with-icon--label">
                        <span v-if="!fbLoading">{{ t('ingresaConFace') }}</span>
                        <spinner class="blue" v-if="fbLoading"></spinner>
                    </span>
                </button>
            </div>

            <modal
                :name="'modal'"
                v-if="showModalLogin"
                @close="toggleModalLogin"
                :body="'Body'"
            >
                <template #header>
                    <h3>
                        <span>
                            {{ t('teniasCuentaVinculada') }} {{ modalType === 'facebook' ? t('facebook') : t('apple') }}?
                        </span>
                        <i
                            v-on:click="toggleModalLogin"
                            class="fa fa-times float-right-close"
                        ></i>
                    </h3>
                </template>
                <template #body>
                    <div class="text-left color-black login-modal">
                        <p>
                            {{ t('ingresoRegistroYaNoFunciona') }} {{ modalType === 'facebook' ? t('facebook') : t('apple') }}.
                        </p>
                        <p>
                            {{ t('escribinosMesaAyuda') }}
                        </p>
                        <p>
                            {{ t('mesaAyudaFuncionaDesde') }}
                            <a :href="'mailto:' + config.admin_email">
                                {{ config.admin_email }}</a>,
                                {{ t('mensajePrivadoDe') }} <a href="https://instagram.com/carpoolear">Instagram</a> {{ t('y') }}
                            <a href="https://facebook.com/carpoolear">Facebook</a>.
                        </p>

                        <p>{{ t('buenasRutas') }}</p>
                    </div>
                </template>
            </modal>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { useDeviceStore } from '@/stores/device';
import { useCordovaStore } from '@/stores/cordova';
import { useTripsStore } from '@/stores/trips';
import { useMyTripsStore } from '@/stores/myTrips';
import { useRatesStore } from '@/stores/rates';
import { useCarsStore } from '@/stores/cars';
import { usePassengerStore } from '@/stores/passenger';
import { onLoggin } from '@/stores/index';
import modal from '../Modal';
import dialogs from '../../services/dialogs.js';
import bus from '../../services/bus-event';
import Spinner from '../Spinner.vue';
import cache from '../../services/cache';

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const deviceStore = useDeviceStore();
const cordovaStore = useCordovaStore();
const tripsStore = useTripsStore();
const myTripsStore = useMyTripsStore();
const ratesStore = useRatesStore();
const carsStore = useCarsStore();
const passengerStore = usePassengerStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const fbLoading = ref(false);
const iosLoading = ref(false);
const error = ref('');
const ROUTE_BASE = import.meta.env.VITE_ROUTE_BASE || '/';
const TARGET_APP = import.meta.env.VITE_TARGET_APP || 'carpoolear';
const carpoolear_logo = ROUTE_BASE + 'static/img/carpoolear_logo.png';
const hasScroll = ref(false);
const isUnderstood = ref(true);
const dontShowAgain = ref(false);
const isShowLogin = ref(false);
const showUserNotActiveInfo = ref(false);
const showModalLogin = ref(false);
const modalType = ref('facebook');
const showUserBannedInfo = ref(false);
const app_logo = ROUTE_BASE + 'static/img/' + TARGET_APP + '_logo_full.png';

const txt_user = ref(null);

const checkLogin = computed(() => authStore.checkLogin);
const isMobile = computed(() => deviceStore.isMobile);
const config = computed(() => authStore.appConfig);
const deviceData = computed(() => cordovaStore.device);

const isDesktop = computed(() => !isMobile.value);

const isApple = computed(() => {
    return true;
});

const loginCustomHeader = computed(() => {
    return config.value ? config.value.login_custom_header : '';
});

const righPanelclass = computed(() => {
    if (config.value) {
        if (config.value.trip_card_design === 'light') {
            return 'col-sm-24 col-md-24';
        } else {
            return 'col-sm-12 col-md-12';
        }
    } else {
        return 'col-sm-12 col-md-12';
    }
});

const fbWarningGetIt = () => {
    isUnderstood.value = true;
    if (dontShowAgain.value) {
        cache.setItem('fbLoginWarningDontShow', true);
    }
};

const toggleModalLogin = (type) => {
    if (type) {
        modalType.value = type;
    }
    showModalLogin.value = !showModalLogin.value;
};

const login = () => {
    if (!fbLoading.value) {
        showUserNotActiveInfo.value = false;
        showUserBannedInfo.value = false;
        loading.value = true;
        authStore.login({ email: email.value, password: password.value }).then(
            (token) => {
                loading.value = false;
                onLoggin(token, authStore, tripsStore, myTripsStore, ratesStore, carsStore, passengerStore, cordovaStore, deviceStore, router);
            },
            (err) => {
                const userNotActive =
                    err && err.message === 'user_not_active';
                const userBanned =
                    err && err.message === 'user_banned';
                const message = userNotActive
                    ? t('paraIngresarCuenta')
                    : userBanned
                    ? t('usuarioBanneado')
                    : t('emailOContra');
                showUserNotActiveInfo.value = userNotActive;
                showUserBannedInfo.value = userBanned;
                dialogs.message(message, {
                    duration: 10,
                    estado: 'error'
                });
                if (err) {
                    error.value = err.error;
                }
                loading.value = false;
            }
        );
    } else {
        dialogs.message(t('solicitudEnviada'), {
            duration: 10,
            estado: 'error'
        });
    }
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

const iosLogin = () => {
    if (!loading.value) {
        iosLoading.value = true;
        cordovaStore.appleLogin().catch((response) => {
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

const onClearClick = () => {
    router.back();
};

onMounted(() => {
    bus.on('clear-click', onClearClick);
    let viewPort = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
    );

    if (!isMobile.value && txt_user.value) {
        txt_user.value.focus();
    }

    if (config.value && config.value.login_custom_header) {
        isShowLogin.value = true;
    }

    hasScroll.value = document.body.scrollHeight > viewPort;
    cache.getItem('fbLoginWarningDontShow').then((value) => {
        console.log('fbLoginWarningDontShow', value);
        if (value) {
            isUnderstood.value = true;
        }
    });
});

onBeforeUnmount(() => {
    bus.off('clear-click', onClearClick);
});
</script>

<style>
.app-container {
    min-height: 100vh;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fb-terms {
    color: #eee;
}

.facebook-box {
    margin-top: 0.5em !important;
}

.password-not {
    text-align: center;
    margin-top: 16px;
    display: block;
    text-align: center;
    color: #ddd;
    font-weight: bold;
    text-decoration: underline;
    padding-left: 10px;
}

label {
    margin-top: 0.3em;
    font-weight: bold;
}

.login-forget {
    font-weight: bold;
    padding-left: 12px;
    color: var(--secondary-background);
}

/* .user-form .btn-primary.btn-facebook {
  width: 90%;
  margin: 1em auto;
} */

.description {
    font-size: 11px;
    text-transform: none;
    color: #fff;
    display: block;
}

.btn-facebook.btn-with-icon--icon {
    background-color: var(--button-facebook-blue-left);
}

.register {
    font-weight: 300;
    font-size: 16px;
    padding: 1.4em 0;
    position: relative;
    display: inline-block;
    margin-top: 1em;
}

.register::before {
    position: absolute;
    /* border-top: solid 1px #2793ff; */
    width: 90%;
    margin-left: 5%;
    content: ' ';
    top: 0;
    left: 0;
}

.alert-warning a {
    color: #337ab7;
}

.register {
    color: #ccc;
}

.alert-warning {
    position: fixed;
    top: 0;
    left: 0;
    width: 94%;
    margin: 10vh 3%;
    height: 80vh;
    z-index: 100;
}

@media only screen and (min-width: 768px) {
    .login-box {
        margin-right: 0;
    }
    .alert-warning {
        position: static;
        width: auto;
        height: auto;
        margin: auto;
        margin-bottom: 1em;
    }
    .register {
        color: #555;
        margin-bottom: 1em;
        padding: 0;
        font-weight: 400;
    }
    .description {
        display: inline;
        padding-left: 0.4em;
        color: rgb(1, 101, 135);
    }
    .visual-trick {
        border-right: solid 1px #ccc;
        padding-right: 4rem;
    }
    .user-form .btn-primary.btn-facebook {
        width: 100%;
        max-width: 280px;
        margin: 0.5em 0 0.6em 0;
    }
    .user-form .btn-primary.btn-apple {
        width: 100%;
        max-width: 280px;
        margin: 0.5em 0 0.6em 0;
        text-transform: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
            Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        font-size: 20px;
        padding: 0.7em 2em;
        border-color: black;
    }
    .register::before {
        display: none;
    }
    .register::after {
        display: none;
    }
}

.form-warning-login label {
    color: black;
}

.form-warning-login .checkbox {
    display: inline-block;
    margin-right: 1em;
}

.form-warning-login .checkbox span {
    text-transform: none;
}

.form-warning-login * {
    vertical-align: middle;
}

.form-warning-login button {
    margin-top: 0em;
}

#btn_show_login {
    border: 2px solid #333;
    color: #fff;
    background: #444;
    width: 100%;
}

@media only screen and (min-width: 768px) {
    .form-warning-login button {
        margin-top: 0.5em;
    }
    [type='checkbox'] {
        margin-top: 0;
    }
    #btn_show_login {
        max-width: 280px;
    }
}
</style>
