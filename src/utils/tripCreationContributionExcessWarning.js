import { STEP } from './tripCreationSteps.js';
import { seatPriceCentsForApi } from './tripSeatPrice.js';
import { hasPotentialExcessContribution } from './tripDescriptionContribution.js';

/**
 * Steps whose "Siguiente" commits one side of the comparison: the
 * contribution (seat price) or the description that may ask for more.
 */
const CONTRIBUTION_EXCESS_CHECK_STEPS = [STEP.CONTRIBUTION, STEP.DESCRIPTION];

export function shouldShowContributionExcessWarning({
    step,
    description,
    price,
    alreadyShown = false,
    isEdit = false
} = {}) {
    if (alreadyShown || isEdit) {
        return false;
    }

    if (!CONTRIBUTION_EXCESS_CHECK_STEPS.includes(step)) {
        return false;
    }

    return hasPotentialExcessContribution(description, seatPriceCentsForApi(price));
}
