<template>
    <div class="trip-creation-stepper" role="list" aria-label="Trip creation progress">
        <button
            v-for="step in steps"
            :key="step"
            type="button"
            class="trip-creation-stepper__segment"
            :class="segmentClasses(step)"
            :data-testid="`trip-creation-step-${step}`"
            :disabled="isSegmentDisabled(step)"
            :aria-current="step === currentStep ? 'step' : false"
            @click="onSegmentClick(step)"
        >
            <span
                v-if="incompleteSteps.includes(step)"
                class="trip-creation-stepper__incomplete-badge"
                aria-hidden="true"
            ></span>
        </button>
    </div>
</template>

<script>
import {
    canNavigateToStep,
    isStepDisabledForPassenger
} from '../../utils/tripCreationSteps.js';

const STEPS = [1, 2, 3, 4, 5, 6, 7];

export default {
    name: 'trip-creation-stepper',

    props: {
        currentStep: {
            type: Number,
            required: true
        },
        maxVisitedStep: {
            type: Number,
            required: true
        },
        isPassenger: {
            type: Boolean,
            default: false
        },
        incompleteSteps: {
            type: Array,
            default: () => []
        }
    },

    emits: ['select'],

    computed: {
        steps() {
            return STEPS;
        }
    },

    methods: {
        isSegmentDisabled(step) {
            return (
                isStepDisabledForPassenger(step, this.isPassenger) ||
                !canNavigateToStep(step, this.maxVisitedStep, this.isPassenger)
            );
        },
        segmentClasses(step) {
            return {
                'trip-creation-stepper__segment--active': step === this.currentStep,
                'trip-creation-stepper__segment--completed':
                    step < this.currentStep || step <= this.maxVisitedStep,
                'trip-creation-stepper__segment--disabled':
                    isStepDisabledForPassenger(step, this.isPassenger),
                'trip-creation-stepper__segment--incomplete':
                    this.incompleteSteps.includes(step)
            };
        },
        onSegmentClick(step) {
            if (this.isSegmentDisabled(step)) {
                return;
            }
            this.$emit('select', step);
        }
    }
};
</script>

<style scoped>
.trip-creation-stepper {
    display: flex;
    gap: 4px;
    margin: 0 0 1.25rem;
}

.trip-creation-stepper__segment {
    position: relative;
    flex: 1;
    height: 8px;
    border: none;
    padding: 0;
    background: #e0e0e0;
    border-radius: 4px;
    cursor: pointer;
}

.trip-creation-stepper__segment:first-child {
    border-radius: 4px;
}

.trip-creation-stepper__segment:last-child {
    border-radius: 4px;
}

.trip-creation-stepper__segment--active,
.trip-creation-stepper__segment--completed {
    background: #4caf50;
}

.trip-creation-stepper__segment--disabled {
    background: #ececec;
    cursor: not-allowed;
    opacity: 0.55;
}

.trip-creation-stepper__segment:disabled {
    cursor: not-allowed;
}

.trip-creation-stepper__incomplete-badge {
    position: absolute;
    top: -4px;
    right: -2px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #e53935;
}
</style>
