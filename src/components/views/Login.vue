<template>
    <div class="user-form container">
        <router-link v-if="isDesktop" :to="{ name: 'trips' }">
            <img :src="carpoolear_logo" />
        </router-link>
        <div class="login-header">
            <h1 v-if="!(hasScroll && isMobile)">
                {{ $t('iniciarSesion') }}
                <!-- <span class='brand' v-if="!loginCustomHeader">{{ $t('carpoolear') }}</span> -->
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
                {{ $t('recuperarDeFacebook') }}
                <a href="mailto:carpoolear@stsrosario.org.ar">{{
                    $t('carpoolearMail')
                }}</a>
                {{ $t('recuperarDeFacebook2') }}
                <div class="row form-inline form-warning-login">
                    <div class="col-sm-24 text-right">
                        <div class="checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    v-model="dontShowAgain"
                                />
                                <span>{{ $t('noMostrar') }}</span>
                            </label>
                        </div>
                        <button
                            type="button"
                            class="btn btn-default"
                            @click="fbWarningGetIt"
                        >
                            {{ $t('entendido') }}
                        </button>
                    </div>
                </div>
            </div>

            <div class="login-box" :class="[righPanelclass]">
                <label v-show="!loginCustomHeader" for="txt_user">{{
                    $t('email')
                }}</label>
                <div class="visual-trick">
                    <input
                        :placeholder="$t('loginUsuarioPlaceholder')"
                        ref="txt_user"
                        type="email"
                        id="txt_user"
                        v-model="email"
                        v-jump
                    />
                    <label for="txt_password" v-show="isDesktop">{{
                        $t('password')
                    }}</label>
                    <input
                        :placeholder="$t('loginPasswordPlaceholder')"
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
                        {{ $t('debeActivarCuenta') }}
                    </div>
                    <div
                        class="alert alert-info"
                        role="alert"
                        v-if="showUserBannedInfo"
                    >
                        {{ $t('usuarioBanneado') }}
                    </div>
                    <button
                        v-jump
                        ref="btn_login"
                        id="btn_login"
                        class="btn btn-primary btn-shadowed-black"
                        @click="login"
                        :disabled="loading"
                    >
                        <span v-if="!loading">{{ $t('ingresar') }}</span>
                        <spinner class="blue" v-if="loading"></spinner>
                    </button>
                </div>
                <div class="pass-options" v-if="isDesktop">
                    <input id="checkbox_remember" type="checkbox" />
                    <label for="checkbox_remember">{{
                        $t('recordarme')
                    }}</label>
                    <span v-show="!loginCustomHeader">-</span>
                    <router-link
                        class="login-forget"
                        :to="{ name: 'reset-password' }"
                    >
                        {{ $t('olvideContra') }}
                    </router-link>
                </div>
            </div>
            <div style="col-sm-12" v-show="isMobile">
                <router-link
                    class="password-not"
                    :to="{ name: 'reset-password' }"
                >
                    {{ $t('olvideContra') }}
                </router-link>
            </div>
            <div class="col-sm-12 col-md-12" v-show="isMobile">
                <span class="register" v-if="isMobile">
                    {{ $t('noTenesFace') }}
                    <router-link
                        class="login-register"
                        :to="{ name: 'register' }"
                    >
                        {{ $t('registrateAca') }}
                    </router-link>
                </span>
            </div>

            <div
                class="col-sm-12 col-md-12"
                v-show="isMobile && !loginCustomHeader"
            >
                <hr />
                <button
                    class="btn btn-primary btn-search btn-apple btn-with-icon"
                    @click="appleLogin"
                    :disabled="iosLoading"
                    v-if="isApple"
                >
                    <span class="btn-with-icon--icon">
                        <i class="fa fa-apple" aria-hidden="true"></i>
                    </span>
                    <span class="btn-with-icon--label">
                        <span v-if="!iosLoading">{{
                            $t('ingresaConApple')
                        }}</span>
                        <spinner class="blue" v-if="iosLoading"></spinner>
                    </span>
                </button>
                <!-- <div class="fb-terms">{{ $t('alIngresarFacebook') }} <router-link :to="{name: 'terms'}">{{ $t('tyc') }}</router-link>.</div> -->
            </div>
            <div
                class="login-box"
                :class="[righPanelclass]"
                v-show="!isShowLogin && isDesktop"
            >
                <div>
                    <span class="register">
                        {{ $t('noTenesFace') }}
                        <router-link
                            class="login-register"
                            :to="{ name: 'register' }"
                        >
                            {{ $t('registrateAca') }}
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
                    {{ $t('noTenesFace') }}>
                    <router-link
                        class="login-register"
                        :to="{ name: 'register' }"
                    >
                        {{ $t('registrateAca') }}
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
                            $t('ingresaConFace')
                        }}</span>
                        <spinner class="blue" v-if="fbLoading"></spinner>
                    </span>
                </button>
                <div v-show="config.enable_facebook">
                    {{ $t('alIngresarFace') }}
                    <router-link :to="{ name: 'terms' }">{{
                        $t('tyc')
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
                            $t('ingresaConApple')
                        }}</span>
                        <spinner class="blue" v-if="iosLoading"></spinner>
                    </span>
                </button>
                <div v-show="isApple">
                    {{ $t('alIngresarApple') }}
                    <router-link :to="{ name: 'terms' }">{{
                        $t('tyc')
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
                        <span v-if="!fbLoading">Ingresá con Facebook</span>
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
                <h3 slot="header">
                    <span>
                        ¿Tenías cuenta de Carpoolear vinculada a tu cuenta de
                        {{ modalType === 'facebook' ? 'Facebook' : 'Apple' }}?
                    </span>
                    <i
                        v-on:click="toggleModalLogin"
                        class="fa fa-times float-right-close"
                    ></i>
                </h3>
                <div slot="body">
                    <div class="text-left color-black login-modal">
                        <p>
                            El ingreso/registro via
                            {{
                                modalType === 'facebook' ? 'Facebook' : 'Apple'
                            }}
                            ya no funciona más.
                        </p>
                        <p>
                            Escribinos a la mesa de ayuda de Carpoolear para
                            poder recuperar tu cuenta y migrarla a una vinculada
                            a mail.
                        </p>
                        <p>
                            La mesa de ayuda de Carpoolear funciona desde
                            <a href="mailto:carpoolear@stsrosario.org.ar">
                                carpoolear@stsrosario.org.ar</a>,  
                                mensaje privado de <a href="https://instagram.com/carpoolear">Instagram</a> y
                            <a href="https://facebook.com/carpoolear">Facebook</a>.
                        </p>

                        <p>¡Buenas rutas!</p>
                    </div>
                </div>
            </modal>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import modal from '../Modal';
import dialogs from '../../services/dialogs.js';
import router from '../../router';
import bus from '../../services/bus-event';
import Spinner from '../Spinner.vue';
import cache from '../../services/cache';

export default {
    name: 'login',
    data() {
        return {
            email: '',
            password: '',
            loading: false,
            fbLoading: false,
            iosLoading: false,
            error: '',
            carpoolear_logo:
                process.env.ROUTE_BASE + 'static/img/carpoolear_logo.png',
            hasScroll: false,
            isUnderstood: true,
            dontShowAgain: false,
            isShowLogin: false,
            showUserNotActiveInfo: false,
            showModalLogin: false,
            modalType: 'facebook',
            showUserBannedInfo: false,
            app_logo:
                process.env.ROUTE_BASE +
                'static/img/' +
                process.env.TARGET_APP +
                '_logo_full.png'
        };
    },
    computed: {
        ...mapGetters({
            checkLogin: 'auth/checkLogin',
            isMobile: 'device/isMobile',
            config: 'auth/appConfig',
            deviceData: 'cordova/device'
        }),
        isDesktop() {
            return !this.isMobile;
        },
        isApple() {
            return true;
            console.log('isApple', window.cordova.platformId);
            return (
                window.cordova &&
                window.cordova.platformId.toLowerCase() === 'ios'
            );
        },
        loginCustomHeader() {
            return this.config ? this.config.login_custom_header : '';
        },
        righPanelclass() {
            if (this.config) {
                if (this.config.trip_card_design === 'light') {
                    return 'col-sm-24 col-md-24';
                } else {
                    return 'col-sm-12 col-md-12';
                }
            } else {
                return 'col-sm-12 col-md-12';
            }
        }
    },
    methods: {
        ...mapActions({
            doLogin: 'auth/login', // map this.add() to this.$store.dispatch('increment')
            fbLogin: 'cordova/facebookLogin',
            appleLogin: 'cordova/appleLogin'
        }),
        fbWarningGetIt() {
            this.isUnderstood = true;
            if (this.dontShowAgain) {
                cache.setItem('fbLoginWarningDontShow', true);
            }
        },
        toggleModalFBLogin() {
            this.modalType = 'facebook';
            this.showModalLogin = !this.showModalLogin;
        },

        toggleModalAppleLogin() {
            this.modalType = 'apple';
            this.showModalLogin = !this.showModalLogin;
        },

        toggleModalLogin(type) {
            if (type) {
                this.modalType = type;
            }
            this.showModalLogin = !this.showModalLogin;
        },
        login() {
            if (!this.fbLoading) {
                this.showUserNotActiveInfo = false;
                this.showUserBannedInfo = false;
                this.loading = true;
                let email = this.email;
                let password = this.password;
                this.doLogin({ email, password }).then(
                    (data) => {
                        this.loading = false;
                        // router.push({ name: 'trips' });
                        // router.rememberBack();
                    },
                    (error) => {
                        const userNotActive =
                            error && error.message === 'user_not_active';
                        const userBanned =
                            error && error.message === 'user_banned';
                        const message = userNotActive
                            ? this.$t('paraIngresarCuenta')
                            : userBanned
                            ? this.$t('usuarioBanneado')
                            : this.$t('emailOContra');
                        this.showUserNotActiveInfo = userNotActive;
                        this.showUserBannedInfo = userBanned;
                        dialogs.message(message, {
                            duration: 10,
                            estado: 'error'
                        });
                        if (error) {
                            this.error = error.error;
                        }
                        this.loading = false;
                    }
                );
            } else {
                dialogs.message(this.$t('solicitudEnviada'), {
                    duration: 10,
                    estado: 'error'
                });
            }
        },
        showLogin() {
            this.isShowLogin = true;
        },

        facebookLogin() {
            if (!this.loading) {
                this.fbLoading = true;
                this.fbLogin().catch((response) => {
                    if (response.errors && response.errors.email) {
                        dialogs.message(this.$t('correoUsado'), {
                            duration: 10,
                            estado: 'error'
                        });
                    }
                });
            } else {
                dialogs.message(this.$t('solicitudEnviada'), {
                    duration: 10,
                    estado: 'error'
                });
            }
        },
        iosLogin() {
            if (!this.loading) {
                this.iosLoading = true;
                this.appleLogin().catch((response) => {
                    if (response.errors && response.errors.email) {
                        dialogs.message(this.$t('correoUsado'), {
                            duration: 10,
                            estado: 'error'
                        });
                    }
                });
            } else {
                dialogs.message(this.$t('solicitudEnviada'), {
                    duration: 10,
                    estado: 'error'
                });
            }
        },
        onClearClick() {
            router.back();
        }
    },

    mounted() {
        bus.on('clear-click', this.onClearClick);
        let viewPort = Math.max(
            document.documentElement.clientHeight,
            window.innerHeight || 0
        );

        if (!this.isMobile) {
            this.$refs.txt_user.focus();
        }

        if (this.config.login_custom_header) {
            this.isShowLogin = true;
        }

        this.hasScroll = document.body.scrollHeight > viewPort;
        cache.getItem('fbLoginWarningDontShow').then((value) => {
            console.log('fbLoginWarningDontShow', value);
            if (value) {
                this.isUnderstood = true;
            }
        });
    },

    beforeDestroy() {
        bus.off('clear-click', this.onClearClick);
    },

    components: {
        Spinner,
        modal
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
