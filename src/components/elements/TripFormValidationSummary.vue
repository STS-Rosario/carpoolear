<template>
    <div
        v-if="shouldShow"
        class="trip-form-validation-summary"
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
    margin-right: 5px;
    padding: 1rem;
    background-color: #fff;
    border: 2px solid var(--main-error, #d72521);
    border-radius: 4px;
    color: #1f1f1f;
}

.trip-form-validation-summary__title {
    margin: 0 0 0.5rem;
    font-weight: 700;
    color: var(--main-error, #d72521);
}

.trip-form-validation-summary__list {
    margin: 0;
    padding-left: 1.5rem;
    list-style-type: disc;
    color: #1f1f1f;
}

.trip-form-validation-summary__list li {
    margin-bottom: 0.25rem;
}

.trip-form-validation-summary__list li::marker {
    color: #1f1f1f;
}
</style>
