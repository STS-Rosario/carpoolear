<template>
    <p
        v-if="note"
        class="identity-validation-admin-review-note"
        :class="flowClass"
    >
        <strong>{{ $t(labelKey) }}:</strong>
        {{ note }}
    </p>
</template>

<script>
export default {
    name: 'IdentityValidationAdminReviewNote',
    props: {
        note: {
            type: String,
            default: ''
        },
        labelKey: {
            type: String,
            required: true
        },
        inFlow: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        flowClass() {
            return this.inFlow
                ? 'identity-validation-admin-review-note--flow'
                : null;
        }
    }
};
</script>

<style scoped>
.identity-validation-admin-review-note {
    margin: 1.25rem 0 1.25rem;
    padding: 0.65rem 0.75rem;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.85);
    font-size: 0.95rem;
    line-height: 1.45;
    color: #334155;
}

.identity-validation-admin-review-note--flow {
    margin-top: 1.25rem;
    margin-bottom: 1.25rem;
}
</style>
