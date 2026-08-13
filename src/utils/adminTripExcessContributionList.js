import { contributionUnitsFromCents } from './tripContributionDisplay.js';

export function formatTripContributionPesosLabel(cents) {
    const units = contributionUnitsFromCents(cents);

    if (!units) {
        return '-';
    }

    return `$${units}`;
}
