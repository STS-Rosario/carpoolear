<template>
    <div class="impersonation-banner" role="status">
        <span class="impersonation-banner__text">
            {{ $t('impersonationBannerText', { name: user?.name || '' }) }}
        </span>
        <button
            type="button"
            class="impersonation-banner__button"
            @click="stopImpersonation"
        >
            {{ $t('impersonationBannerStop') }}
        </button>
    </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { useAuthStore } from '../stores/auth';

export default {
    name: 'impersonation-banner',
    computed: {
        ...mapState(useAuthStore, ['user'])
    },
    methods: {
        ...mapActions(useAuthStore, {
            stopImpersonation: 'stopImpersonation'
        })
    }
};
</script>

<style scoped>
.impersonation-banner {
    position: sticky;
    top: 0;
    z-index: 9999;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px 16px;
    padding: 10px 14px;
    background: #fde2e2;
    border-bottom: 1px solid #f5b5b5;
    color: #842029;
    font-size: 14px;
}

.impersonation-banner__button {
    font-weight: 600;
    white-space: nowrap;
    background: transparent;
    border: 0;
    color: inherit;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
}
</style>
