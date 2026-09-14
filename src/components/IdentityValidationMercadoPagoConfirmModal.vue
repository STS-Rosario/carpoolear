<template>
    <div
        v-if="open"
        class="identity-validation-mp-confirm"
        role="dialog"
        aria-modal="true"
        :aria-label="$t('identityValidationMpConfirmContinue')"
    >
        <div
            class="identity-validation-mp-confirm__backdrop"
            @click="$emit('back')"
        />
        <div class="identity-validation-mp-confirm__dialog">
            <p class="identity-validation-mp-confirm__lead">
                {{ $t('identityValidationMpConfirmLead') }}
            </p>
            <p class="identity-validation-mp-confirm__name">
                {{ $t('identityValidationMpConfirmName') }}
            </p>
            <AppButton
                variant="primary"
                size="lg"
                block
                class="identity-validation-mp-confirm__continue"
                :disabled="loading"
                :loading="loading"
                @click="$emit('continue')"
            >
                {{ $t('identityValidationMpConfirmContinue') }}
            </AppButton>
            <AppButton
                variant="secondary"
                size="lg"
                block
                class="identity-validation-mp-confirm__edit"
                @click="$emit('edit-profile')"
            >
                {{ $t('identityValidationMpConfirmEditProfile') }}
            </AppButton>
            <button
                type="button"
                class="identity-validation-mp-confirm__back"
                @click="$emit('back')"
            >
                {{ $t('volver') }}
            </button>
        </div>
    </div>
</template>

<script>
import AppButton from './ui/AppButton.vue';

export default {
    name: 'IdentityValidationMercadoPagoConfirmModal',
    components: {
        AppButton
    },
    props: {
        open: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    emits: ['continue', 'edit-profile', 'back']
};
</script>

<style scoped>
.identity-validation-mp-confirm {
    position: fixed;
    inset: 0;
    z-index: 9990;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    box-sizing: border-box;
}

.identity-validation-mp-confirm__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
}

.identity-validation-mp-confirm__dialog {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 420px;
    background: #fff;
    border-radius: 12px;
    padding: 1.5rem 1.35rem 1.25rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
}

.identity-validation-mp-confirm__lead,
.identity-validation-mp-confirm__name {
    margin: 0 0 1rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #222;
    font-weight: 700;
}

.identity-validation-mp-confirm__name {
    font-weight: 400;
}

.identity-validation-mp-confirm__continue {
    margin-bottom: 0.75rem;
}

.identity-validation-mp-confirm__edit {
    margin-bottom: 0.85rem;
}

.identity-validation-mp-confirm__back {
    display: block;
    width: 100%;
    padding: 0.5rem;
    border: none;
    background: transparent;
    color: var(--ds-action, #1e5f9e);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
}

.identity-validation-mp-confirm__back:hover,
.identity-validation-mp-confirm__back:focus {
    text-decoration: underline;
}
</style>
