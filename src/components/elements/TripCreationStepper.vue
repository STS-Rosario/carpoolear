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
                class="trip-creation-stepper__bar"
                :class="barClasses(step)"
            ></span>
            <span
                v-if="incompleteSteps.includes(step)"
                class="trip-creation-stepper__incomplete-badge"
                aria-hidden="true"
            ></span>
            <span class="trip-creation-stepper__label">
                {{ $t(getTripCreationStepLabelKey(step)) }}
            </span>
        </button>
    </div>
</template>

<script>
import {
    ALL_WIZARD_STEPS,
    canNavigateToStep,
    getTripCreationStepLabelKey,
    isStepDisabledForPassenger
} from '../../utils/tripCreationSteps.js';

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
            return ALL_WIZARD_STEPS;
        }
    },

    methods: {
        getTripCreationStepLabelKey,
        isSegmentDisabled(step) {
            return (
                isStepDisabledForPassenger(step, this.isPassenger) ||
                !canNavigateToStep(step, this.maxVisitedStep, this.isPassenger)
            );
        },
        barClasses(step) {
            return {
                'trip-creation-stepper__bar--active': step === this.currentStep,
                'trip-creation-stepper__bar--completed':
                    step < this.currentStep || step <= this.maxVisitedStep,
                'trip-creation-stepper__bar--disabled':
                    isStepDisabledForPassenger(step, this.isPassenger)
            };
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
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
    border: none;
    padding: 0;
    background: transparent;
    cursor: pointer;
}

.trip-creation-stepper__bar {
    height: 8px;
    border-radius: 4px;
    background: #e0e0e0;
}

.trip-creation-stepper__bar--active,
.trip-creation-stepper__bar--completed {
    background: #4caf50;
}

.trip-creation-stepper__bar--disabled {
    background: #ececec;
}

.trip-creation-stepper__label {
    font-size: 0.625rem;
    line-height: 1.25;
    text-align: center;
    color: #666;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    white-space: normal;
}

@media (min-width: 768px) {
    .trip-creation-stepper__label {
        display: block;
        -webkit-line-clamp: unset;
        line-height: 1.2;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}

.trip-creation-stepper__segment--active .trip-creation-stepper__label {
    color: #333;
    font-weight: 600;
}

.trip-creation-stepper__segment--disabled {
    cursor: not-allowed;
    opacity: 0.55;
}

.trip-creation-stepper__segment--disabled .trip-creation-stepper__label {
    color: #aaa;
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
