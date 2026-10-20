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
            <ul class="identity-validation-mp-confirm__conditions">
                <li>{{ $t('identityValidationMpConfirmConditionSession') }}</li>
                <li>{{ $t('identityValidationMpConfirmName') }}</li>
            </ul>
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
            <p class="identity-validation-mp-confirm__help">
                {{ $t('identityValidationMpConfirmHelpPrefix') }}<router-link :to="{ name: 'ticket-new' }">{{ $t('identityValidationMpConfirmHelpLink') }}</router-link>
            </p>
            <AppButton
                variant="tertiary"
                size="lg"
                block
                class="identity-validation-mp-confirm__back"
                icon-left="fa fa-chevron-left"
                @click="$emit('back')"
            >
                {{ $t('volver') }}
            </AppButton>
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

.identity-validation-mp-confirm__lead {
    margin: 0 0 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #222;
    font-weight: 700;
}

.identity-validation-mp-confirm__conditions {
    margin: 0 0 1rem;
    padding-left: 0;
    list-style: none;
    font-size: 1rem;
    line-height: 1.5;
    color: #222;
}

.identity-validation-mp-confirm__conditions li {
    position: relative;
    padding-left: 1.4rem;
    margin-bottom: 0.5rem;
}

.identity-validation-mp-confirm__conditions li:last-child {
    margin-bottom: 0;
}

.identity-validation-mp-confirm__conditions li::before {
    content: '';
    position: absolute;
    left: 0.2rem;
    top: 0.55em;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: var(--ds-action, #1e5f9e);
}

.identity-validation-mp-confirm__help {
    margin: 0 0 0.5rem;
    font-size: 0.9rem;
    line-height: 1.5;
    color: #444;
}

.identity-validation-mp-confirm__help a {
    color: var(--ds-action, #1e5f9e);
    font-weight: 600;
}

.identity-validation-mp-confirm__continue {
    margin-bottom: 0.75rem;
}

.identity-validation-mp-confirm__edit {
    margin-bottom: 0.85rem;
}

.identity-validation-mp-confirm__back {
    margin-top: 0.25rem;
}
</style>
