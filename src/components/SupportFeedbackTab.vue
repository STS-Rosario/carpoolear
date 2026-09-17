<template>
    <div v-if="visible">
        <SupportFeedbackModal :visible="showModal" @close="showModal = false" />
        <button
            type="button"
            class="support-feedback-tab"
            :aria-label="$t('pestanaFeedback')"
            @click="showModal = true"
        >
            <span class="support-feedback-tab__text">{{ $t('pestanaFeedback') }}</span>
        </button>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { useAuthStore } from '../stores/auth';
import SupportFeedbackModal from './SupportFeedbackModal.vue';
import { shouldShowSupportFeedbackTab } from '../utils/supportFeedbackTab';

export default {
    name: 'support-feedback-tab',
    components: {
        SupportFeedbackModal
    },
    props: {
        onboardingVisible: {
            type: Boolean,
            default: false
        },
        customSplashVisible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            showModal: false
        };
    },
    computed: {
        ...mapState(useAuthStore, {
            logged: 'checkLogin'
        }),
        visible() {
            return shouldShowSupportFeedbackTab({
                isLoggedIn: this.logged,
                onboardingVisible: this.onboardingVisible,
                customSplashVisible: this.customSplashVisible,
                routeName: this.$route && this.$route.name
            });
        }
    }
};
</script>

<style scoped>
.support-feedback-tab {
    position: fixed;
    top: 45%;
    right: 0;
    transform: translateY(-50%);
    background: var(--ds-action, #1e5f9e);
    color: white;
    border: none;
    border-radius: 8px 0 0 8px;
    box-shadow: -2px 2px 8px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    z-index: 1000;
    min-width: 30px;
    padding: 16px 8px;
    transition: padding-right 0.2s, box-shadow 0.2s;
}

.support-feedback-tab:hover {
    padding-right: 12px;
    box-shadow: -4px 2px 12px rgba(0, 0, 0, 0.2);
}

.support-feedback-tab__text {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
}
</style>
