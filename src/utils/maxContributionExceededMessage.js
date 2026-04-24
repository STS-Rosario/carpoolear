export function getMaxContributionExceededMessage({
    t,
    n,
    maxContributionCents
}) {
    return t('precioMaximoExcedido', {
        maxContribution: n(maxContributionCents / 100, 'currency')
    });
}
