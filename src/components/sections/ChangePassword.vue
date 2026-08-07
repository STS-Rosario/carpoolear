<template>
    <div class="change-password-component">
        <div class="change-password-page__card">
            <h1 class="change-password-page__heading">
                {{ $t('cambiarPassword') }}
            </h1>

            <div v-if="isImpersonating" class="alert alert-info">
                {{ $t('impersonationActionForbidden') }}
            </div>

            <form v-else class="form" @submit.prevent="save">
                <AppInput
                    v-model="password"
                    password
                    id="input-pass"
                    maxlength="40"
                    autocomplete="new-password"
                    :label="$t('ingreseNuevaPassword')"
                    :placeholder="$t('placeholderContrasena')"
                    :show-password-label="$t('mostrarContrasena')"
                    :hide-password-label="$t('ocultarContrasena')"
                />
                <AppInput
                    v-model="passwordConfirmation"
                    password
                    id="input-pass-confirm"
                    maxlength="40"
                    autocomplete="new-password"
                    :label="$t('repetirContrasena')"
                    :placeholder="$t('placeholderRepetirContrasena')"
                    :show-password-label="$t('mostrarContrasena')"
                    :hide-password-label="$t('ocultarContrasena')"
                    :error="error || ''"
                />
                <AppButton
                    type="submit"
                    variant="primary"
                    :loading="loading"
                    :label="$t('cambiarPassword')"
                >
                    <template #loading>
                        <spinner class="blue"></spinner>
                    </template>
                </AppButton>
            </form>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import dialogs from '../../services/dialogs.js';
import Spinner from '../Spinner.vue';
import AppInput from '../ui/AppInput.vue';
import AppButton from '../ui/AppButton.vue';
import { getApiErrorMessage } from '../../utils/apiErrors.js';

export default {
    name: 'change-password',
    components: {
        Spinner,
        AppInput,
        AppButton
    },
    data() {
        return {
            password: '',
            passwordConfirmation: '',
            error: null,
            loading: false
        };
    },
    computed: {
        ...mapState(useAuthStore, {
            isImpersonating: 'isImpersonating'
        })
    },
    methods: {
        ...mapActions(useAuthStore, {
            update: 'update'
        }),
        save() {
            if (!this.password || !this.passwordConfirmation) {
                this.error = this.$t('faltanCamposObligatorios');
                return;
            }
            if (this.password !== this.passwordConfirmation) {
                this.error = this.$t('passwordNoCoincide');
                return;
            }

            this.loading = true;
            this.error = null;

            const bodyFormData = new FormData();
            bodyFormData.append('password', this.password);
            bodyFormData.append('password_confirmation', this.passwordConfirmation);

            this.update(bodyFormData)
                .then(() => {
                    this.password = '';
                    this.passwordConfirmation = '';
                    this.loading = false;
                    dialogs.message(this.$t('passwordActualizadaCorrectamente'));
                })
                .catch((err) => {
                    this.loading = false;
                    const message = getApiErrorMessage(
                        err,
                        this.$t('errorDatos'),
                        this.$t.bind(this)
                    );
                    this.error = message;
                    dialogs.message(message, {
                        duration: 10,
                        estado: 'error'
                    });
                });
        }
    }
};
</script>

<style scoped>
.change-password-component {
    color: var(--main-font-color, #555);
}

.change-password-page__heading {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 1rem;
    line-height: 1.3;
    color: #333;
}

.change-password-page__card {
    width: 100%;
    box-sizing: border-box;
    padding: 1rem 1.25rem 1.25rem;
    background: var(--profile-card-bg, #fff);
    border-radius: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.change-password-component .form {
    max-width: 32rem;
    background: transparent;
    box-shadow: none;
    border-radius: 0;
    padding: 0;
}

.change-password-component .form :deep(.app-input) {
    margin-bottom: 1rem;
}

@media only screen and (max-width: 768px) {
    .change-password-component {
        padding: 1em;
    }
}
</style>
