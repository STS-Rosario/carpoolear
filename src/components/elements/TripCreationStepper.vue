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
                {{ $t(getTripCreationStepLabelKey(step, isPassenger)) }}
            </span>
        </button>
    </div>
</template>

<script>
import {
    ALL_WIZARD_STEPS,
    canNavigateToStep,
    getTripCreationStepLabelKey,
    isStepDisabledForPassenger,
    STEP
} from '../../utils/tripCreationSteps.js';
import { isTripCreationStepCompleted } from '../../utils/tripCreationWizardMount.js';

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
        seatPriceEnabled: {
            type: Boolean,
            default: true
        },
        incompleteSteps: {
            type: Array,
            default: () => []
        }
    },

    emits: ['select'],

    computed: {
        steps() {
            // Steps a passenger skips are hidden rather than shown disabled,
            // so their stepper only lists what they actually fill in.
            return ALL_WIZARD_STEPS.filter(
                (step) =>
                    !isStepDisabledForPassenger(step, this.isPassenger) &&
                    (this.seatPriceEnabled || step !== STEP.CONTRIBUTION)
            );
        }
    },

    methods: {
        getTripCreationStepLabelKey,
        isSegmentDisabled(step) {
            return !canNavigateToStep(step, this.maxVisitedStep, this.isPassenger);
        },
        barClasses(step) {
            return {
                'trip-creation-stepper__bar--active': step === this.currentStep,
                'trip-creation-stepper__bar--completed': isTripCreationStepCompleted(
                    step,
                    this.currentStep,
                    this.maxVisitedStep
                )
            };
        },
        segmentClasses(step) {
            return {
                'trip-creation-stepper__segment--active': step === this.currentStep,
                'trip-creation-stepper__segment--completed': isTripCreationStepCompleted(
                    step,
                    this.currentStep,
                    this.maxVisitedStep
                ),
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

.trip-creation-stepper__bar--active {
    background: #e0e0e0;
    box-shadow: 0 0 0 2px rgba(30, 95, 158, 0.35), 0 2px 4px rgba(30, 95, 158, 0.25);
}

.trip-creation-stepper__bar--completed {
    background: #4caf50;
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
