<template>
    <div
        v-if="shouldShow"
        class="trip-form-validation-summary alert alert-danger"
        role="alert"
    >
        <p class="trip-form-validation-summary__title">{{ title }}</p>
        <ul class="trip-form-validation-summary__list">
            <li
                v-for="(message, index) in messages"
                :key="`${message}-${index}`"
            >
                {{ message }}
            </li>
        </ul>
    </div>
</template>

<script>
import { shouldShowTripFormValidationSummary } from '../../utils/tripFormValidationFeedback.js';

export default {
    name: 'trip-form-validation-summary',
    props: {
        attempted: {
            type: Boolean,
            default: false
        },
        messages: {
            type: Array,
            default: () => []
        },
        title: {
            type: String,
            required: true
        }
    },
    computed: {
        shouldShow() {
            return shouldShowTripFormValidationSummary(this.attempted, this.messages);
        }
    }
};
</script>

<style scoped>
.trip-form-validation-summary {
    margin-top: 1rem;
    margin-bottom: 1rem;
}

.trip-form-validation-summary__title {
    margin: 0 0 0.5rem;
    font-weight: 600;
}

.trip-form-validation-summary__list {
    margin: 0;
    padding-left: 1.25rem;
}
</style>
