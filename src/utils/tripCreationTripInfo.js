import { STEP } from './tripCreationSteps.js';

export const TRIP_INFO_STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    READY: 'ready',
    ERROR: 'error'
};

export function shouldDisableTripCreationNext({
    currentStep,
    tripInfoStatus,
    destinationStep = STEP.DESTINATION
}) {
    if (currentStep !== destinationStep) {
        return false;
    }

    return tripInfoStatus !== TRIP_INFO_STATUS.READY;
}
