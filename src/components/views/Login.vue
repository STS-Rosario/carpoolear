<template>
    <div
        class="user-form user-form--inputs user-form--login container"
        :class="{ 'user-form--login-mobile': isMobile }"
    >
        <AppAuthPage>
        <div class="login-header" v-if="loginCustomHeader">
            <div
                class="col-sm-12 col-md-12"
                v-show="isMobile && loginCustomHeader"
            >
                <img class="login-custom-header--logo" :src="app_logo" />
            </div>
        </div>
        <div class="form row login-form">
            <div class="alert alert-warning" role="alert" v-if="!isUnderstood">
                {{ $t('recuperarDeFacebook') }}
                <a :href="'mailto:' + config.admin_email">{{
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
                <AppPageTitle v-if="!(hasScroll && isMobile) && !loginCustomHeader">
                    {{ $t('iniciarSesion') }}
                </AppPageTitle>
                <form class="login-form__fields" @submit.prevent="submitLogin">
                        <AppInput
                            v-show="!loginCustomHeader"
                            ref="txt_user"
                            :label="$t('email')"
                            v-model="email"
                            type="email"
                            id="txt_user"
                            name="email"
                            :placeholder="$t('loginUsuarioPlaceholder')"
                            autocomplete="username"
                            autocapitalize="none"
                            autocorrect="off"
                            spellcheck="false"
                            inputmode="email"
                        />
                        <AppInput
                            ref="txt_password"
                            :label="$t('password')"
                            v-model="password"
                            password
                            id="txt_password"
                            name="password"
                            :placeholder="$t('loginPasswordPlaceholder')"
                            autocomplete="current-password"
                            :show-password-label="$t('mostrarContrasena')"
                            :hide-password-label="$t('ocultarContrasena')"
                        />
                        <router-link
                            class="login-form__link login-form__forgot"
                            :to="{ name: 'reset-password' }"
                        >
                            {{ $t('olvideContraMobile') }}
                        </router-link>
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
                        <AppButton
                            v-jump
                            ref="btn_login"
                            id="btn_login"
                            type="submit"
                            variant="primary"
                            block
                            class="login-form__submit"
                            :loading="loading"
                            :label="$t('iniciarSesion')"
                        >
                            <template #loading>
                                <spinner class="blue"></spinner>
                            </template>
                        </AppButton>
                        <div class="login-form__remember">
                            <input id="checkbox_remember" type="checkbox" />
                            <label for="checkbox_remember">{{
                                $t('recordarMiCuenta')
                            }}</label>
                        </div>
                </form>
            </div>
            <div
                v-if="isDesktop"
                class="login-form__aside"
                :class="[righPanelclass]"
            >
                <p class="login-form__register-prompt">
                    {{ $t('noTenesFace') }}
                    <router-link
                        class="login-form__link"
                        :to="{ name: 'register' }"
                    >
                        {{ $t('registrateAcaLink') }}
                    </router-link>
                </p>
                <AppInfoCard
                    :action-label="$t('loginLegacyProvidersContact')"
                    @action="openLegacyLoginModal"
                >
                    <template #text>
                        <span
                            v-html="$t('loginLegacyProvidersQuestion')"
                        ></span>
                    </template>
                </AppInfoCard>
            </div>
            <div v-if="isMobile" class="login-form__footer col-sm-12 col-md-12">
                <hr class="login-form__divider" />
                <p class="login-form__register-prompt">
                    {{ $t('noTenesFace') }}
                    <router-link
                        class="login-form__link"
                        :to="{ name: 'register' }"
                    >
                        {{ $t('registrateAcaLink') }}
                    </router-link>
                </p>
                <hr class="login-form__divider" />
                <AppInfoCard
                    :action-label="$t('loginLegacyProvidersContact')"
                    @action="openLegacyLoginModal"
                >
                    <template #text>
                        <span
                            v-html="$t('loginLegacyProvidersQuestion')"
                        ></span>
                    </template>
                </AppInfoCard>
            </div>

            <modal
                :name="'modal'"
                v-if="showModalLogin"
                @close="toggleModalLogin"
                :body="'Body'"
            >
                <template #header><h3>
                    <span>
                        {{ $t('teniasCuentaVinculada') }} {{ modalType === 'facebook' ? $t('facebook') : $t('apple') }}?
                    </span>
                </h3></template>
                <template #body><div>
                    <div class="text-left color-black login-modal">
                        <p>
                            {{ $t('ingresoRegistroYaNoFunciona') }} {{ modalType === 'facebook' ? $t('facebook') : $t('apple') }} {{ $t('ingresoRegistroYaNoFuncionaMas') }}
                        </p>
                        <p>
                            <span>{{ $t('escribinosMesaAyudaMigracionLead') }}</span>
                            <a :href="'mailto:' + config.admin_email">{{
                                config.admin_email
                            }}</a>
                            <span>{{ $t('escribinosMesaAyudaMigracionMid') }}</span>
                            <a
                                :href="carpoolearInstagramUrl"
                                target="_blank"
                                rel="noopener noreferrer"
                            >{{ $t('footerInstagram') }}</a>
                            <span>{{ $t('escribinosMesaAyudaMigracionOr') }}</span>
                            <a
                                :href="carpoolearFacebookUrl"
                                target="_blank"
                                rel="noopener noreferrer"
                            >{{ $t('footerFacebook') }}</a>
                        </p>
                        <p>{{ $t('buenasRutas') }}</p>
                    </div>
                </div></template>
            </modal>
        </div>
        </AppAuthPage>
    </div>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { useDeviceStore } from '../../stores/device';
import { useCordovaStore } from '../../stores/cordova';
import modal from '../Modal';
import dialogs from '../../services/dialogs.js';
import router from '../../router';
import bus from '../../services/bus-event';
import Spinner from '../Spinner.vue';
import AppInput from '../ui/AppInput.vue';
import AppButton from '../ui/AppButton.vue';
import AppPageTitle from '../ui/AppPageTitle.vue';
import AppInfoCard from '../ui/AppInfoCard.vue';
import AppAuthPage from '../ui/AppAuthPage.vue';
import cache from '../../services/cache';
import { isOfflineApiError } from '../../utils/apiErrors.js';
import {
    CARPOOLEAR_FACEBOOK_URL,
    CARPOOLEAR_INSTAGRAM_URL
} from '../../utils/carpoolearSocialUrls.js';

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
            hasScroll: false,
            isUnderstood: true,
            dontShowAgain: false,
            isShowLogin: false,
            showUserNotActiveInfo: false,
            showModalLogin: false,
            modalType: 'facebook',
            carpoolearFacebookUrl: CARPOOLEAR_FACEBOOK_URL,
            carpoolearInstagramUrl: CARPOOLEAR_INSTAGRAM_URL,
            showUserBannedInfo: false,
            app_logo:
                process.env.ROUTE_BASE +
                'img/' +
                process.env.TARGET_APP +
                '_logo_full.png'
        };
    },
    computed: {
        ...mapState(useAuthStore, {
            checkLogin: 'checkLogin',
            config: 'appConfig'
        }),
        ...mapState(useDeviceStore, {
            isMobile: 'isMobile'
        }),
        ...mapState(useCordovaStore, {
            deviceData: 'device'
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
        ...mapActions(useAuthStore, {
            doLogin: 'login'
        }),
        ...mapActions(useCordovaStore, {
            fbLogin: 'facebookLogin',
            appleLogin: 'appleLogin'
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
        openLegacyLoginModal() {
            this.toggleModalLogin('facebook');
        },
        submitLogin() {
            if (this.loading) {
                return;
            }
            this.login();
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
                        if (isOfflineApiError(error)) {
                            this.loading = false;
                            return;
                        }
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
            // After failed retoken, login can be the first route — history.back() does nothing.
            router.replace({ name: 'trips' });
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

    beforeUnmount() {
        bus.off('clear-click', this.onClearClick);
    },

    components: {
        Spinner,
        modal,
        AppInput,
        AppButton,
        AppPageTitle,
        AppInfoCard,
        AppAuthPage
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
}

.password-field {
    position: relative;
    display: block;
    width: 100%;
    margin-bottom: 0.5em;
}

.password-field input {
    margin-bottom: 0;
    padding-right: 2.25rem;
    width: 100%;
    box-sizing: border-box;
}

.password-field__toggle {
    position: absolute;
    top: 1px;
    right: 1px;
    bottom: 1px;
    width: 2.25rem;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: none;
    box-shadow: none;
    appearance: none;
    -webkit-appearance: none;
    color: #666;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
}

.password-field__toggle:hover,
.password-field__toggle:focus,
.password-field__toggle:active {
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
    box-shadow: none;
    outline: none;
}

.password-field__toggle:focus-visible {
    color: var(--secondary-background, #2793ff);
}

.password-field__toggle .fa {
    font-size: 1rem;
    pointer-events: none;
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
