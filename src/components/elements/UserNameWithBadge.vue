<template>
    <span class="user-name-with-badge">
        <span>{{ displayName }}</span>
        <span
            v-if="hasValidatedBadge"
            class="identity-validated-badge"
            :title="$t('identidadValidadaTooltip')"
        >
            <i class="fa fa-check-circle" aria-hidden="true"></i>
        </span>
    </span>
</template>

<script>
export default {
    name: 'UserNameWithBadge',
    props: {
        /** User object with name and optional identity_validated_at (show badge when date is set) */
        user: {
            type: Object,
            default: null
        },
        /** Or pass name and showBadge explicitly */
        name: {
            type: String,
            default: ''
        },
        /** Show badge when true (when not using user object) */
        showBadge: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        displayName() {
            if (this.user && this.user.name != null) return this.user.name;
            return this.name || '';
        },
        hasValidatedBadge() {
            if (this.user && this.user.identity_validated_at) return true;
            return this.showBadge;
        }
    }
};
</script>

<style scoped>
.user-name-with-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25em;
}
.identity-validated-badge {
    color: #5cb85c;
    font-size: 0.95em;
}
.identity-validated-badge i {
    vertical-align: middle;
}
</style>
