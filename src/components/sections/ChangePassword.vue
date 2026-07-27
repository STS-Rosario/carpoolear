<template>
    <div class="change-password-component update-profile-component">
        <h1 class="change-password__heading visible-xs-block">
            {{ $t('cambiarPassword') }}
        </h1>

        <div v-if="isImpersonating" class="alert alert-info">
            {{ $t('impersonationActionForbidden') }}
        </div>

        <form v-else class="form" @submit.prevent="save">
            <div class="form-group">
                <label for="input-pass">{{ $t('ingreseNuevaPassword') }}</label>
                <input
                    maxlength="40"
                    v-model="password"
                    type="password"
                    autocomplete="new-password"
                    class="form-control"
                    id="input-pass"
                    :placeholder="$t('placeholderContrasena')"
                />
            </div>
            <div class="form-group">
                <label for="input-pass-confirm">{{
                    $t('repetirContrasena')
                }}</label>
                <input
                    maxlength="40"
                    v-model="passwordConfirmation"
                    type="password"
                    autocomplete="new-password"
                    class="form-control"
                    id="input-pass-confirm"
                    :placeholder="$t('placeholderRepetirContrasena')"
                />
            </div>

            <span class="error" v-if="error">{{ error }}</span>

            <div class="btn-container">
                <button
                    type="submit"
                    class="btn btn-primary btn-donar-header"
                    :disabled="loading"
                >
                    <span v-if="!loading">{{ $t('cambiarPassword') }}</span>
                    <spinner class="blue" v-if="loading"></spinner>
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import dialogs from '../../services/dialogs.js';
import Spinner from '../Spinner.vue';
import { getApiErrorMessage } from '../../utils/apiErrors.js';

export default {
    name: 'change-password',
    components: {
        Spinner
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
.change-password-component .form {
    max-width: 32rem;
}

.change-password__heading {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 1rem;
    color: #036686;
}

@media only screen and (max-width: 768px) {
    .change-password-component {
        padding: 1em;
    }
}
</style>
