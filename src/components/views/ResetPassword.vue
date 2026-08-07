<template>
    <div
        class="user-form user-form--inputs user-form--reset-password container"
        :class="{ 'user-form--reset-password-mobile': isMobile }"
    >
        <AppAuthPage>
            <div class="form row reset-form" v-if="send">
                <AppPageTitle>{{ $t('recuperarContraseña') }}</AppPageTitle>
                <p class="reset-form__success-message">
                    {{ $t('seHaEnviadoEmailIndicacionesRestablecerContrasena') }}
                </p>
            </div>
            <div class="form row reset-form" v-else-if="!token">
                <AppPageTitle>{{ $t('recuperarContraseña') }}</AppPageTitle>
                <AppInput
                    v-jump
                    ref="txt_email"
                    :label="$t('email')"
                    v-model="email"
                    type="email"
                    id="txt_email"
                    name="email"
                    :placeholder="$t('loginUsuarioPlaceholder')"
                    autocomplete="username"
                    autocapitalize="none"
                    autocorrect="off"
                    spellcheck="false"
                    inputmode="email"
                    :error="error || ''"
                />
                <AppButton
                    v-jump
                    variant="primary"
                    block
                    class="reset-form__submit"
                    :loading="loading"
                    :label="$t('recuperarContraseña')"
                    @click="reset"
                >
                    <template #loading>
                        <spinner class="blue"></spinner>
                    </template>
                </AppButton>
            </div>
            <div class="form row reset-form" v-else>
                <AppPageTitle>{{ $t('cambiarPassword') }}</AppPageTitle>
                <AppInput
                    v-jump
                    ref="txt_password"
                    :label="$t('password')"
                    v-model="password"
                    password
                    id="txt_password"
                    name="password"
                    :placeholder="$t('loginPasswordPlaceholder')"
                    autocomplete="new-password"
                    :show-password-label="$t('mostrarContrasena')"
                    :hide-password-label="$t('ocultarContrasena')"
                />
                <AppInput
                    v-jump
                    ref="txt_password_confirmation"
                    :label="$t('repetirContrasena')"
                    v-model="password_confirmation"
                    password
                    id="txt_password_confirmation"
                    name="password_confirmation"
                    :placeholder="$t('loginPasswordPlaceholder')"
                    autocomplete="new-password"
                    :show-password-label="$t('mostrarContrasena')"
                    :hide-password-label="$t('ocultarContrasena')"
                    :error="error || ''"
                />
                <AppButton
                    v-jump
                    variant="primary"
                    block
                    class="reset-form__submit"
                    :loading="loading"
                    :label="$t('cambiarPassword')"
                    @click="change"
                >
                    <template #loading>
                        <spinner class="blue"></spinner>
                    </template>
                </AppButton>
            </div>
        </AppAuthPage>
    </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useDeviceStore } from '../../stores/device';
import { useAuthStore } from '../../stores/auth';
import Spinner from '../Spinner.vue';
import AppInput from '../ui/AppInput.vue';
import AppButton from '../ui/AppButton.vue';
import AppPageTitle from '../ui/AppPageTitle.vue';
import AppAuthPage from '../ui/AppAuthPage.vue';

let emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

export default {
    name: 'reset-password',
    props: {
        token: {
            type: String,
            required: false
        }
    },

    data() {
        return {
            email: '',
            loading: false,
            error: null,
            send: false,
            password_confirmation: '',
            password: ''
        };
    },
    computed: {
        ...mapState(useDeviceStore, {
            isMobile: 'isMobile'
        })
    },

    watch: {
        email() {
            this.error = null;
        },
        password() {
            this.error = null;
        },
        password_confirmation() {
            this.error = null;
        }
    },

    methods: {
        ...mapActions(useAuthStore, {
            resetPassword: 'resetPassword',
            changePassword: 'changePassword'
        }),

        reset() {
            this.error = null;
            if (emailRegex.test(this.email)) {
                this.loading = true;
                this.resetPassword(this.email).then(
                    () => {
                        this.loading = false;
                        this.send = true;
                    },
                    () => {
                        this.loading = false;
                        this.error =
                            this.$t('emailIngresadoNoPerteneceUsuario');
                    }
                );
            } else {
                this.error = this.$t('ingreseEmailValido');
            }
        },

        change() {
            this.error = null;
            if (this.password === this.password_confirmation) {
                this.loading = true;
                let data = {};
                data.password = this.password;
                data.password_confirmation = this.password_confirmation;
                let token = this.token;
                this.changePassword({ token, data }).then(
                    () => {
                        this.$router.replace({ name: 'login' });
                    },
                    () => {
                        this.loading = false;
                        this.error = this.$t('tokenInvalido');
                    }
                );
            } else {
                this.error = this.$t('noCoincidenCampos');
            }
        }
    },

    components: {
        Spinner,
        AppInput,
        AppButton,
        AppPageTitle,
        AppAuthPage
    }
};
</script>

<style>
.app-container {
    min-height: 100vh;
}
</style>
