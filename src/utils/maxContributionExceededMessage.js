import { getContributionWarningAmountPart } from './contributionWarningAmountPart.js';

export function getMaxContributionExceededMessage({
    t,
    n,
    maxContributionCents
}) {
    return t('precioMaximoExcedido', {
        maxContributionPart:
            getContributionWarningAmountPart(n, maxContributionCents)
    });
}
