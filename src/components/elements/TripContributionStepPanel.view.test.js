import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'TripContributionStepPanel.vue');
const componentSource = fs.readFileSync(componentPath, 'utf8');

describe('TripContributionStepPanel.vue', () => {
    it('renders amount input with suggested accordion and importante notice', () => {
        expect(componentSource).toContain("$t('tripCreationStepContributionQuestion')");
        expect(componentSource).toContain("$t('tripContributionPerPerson')");
        expect(componentSource).toContain("$t('tripContributionSuggested'");
        expect(componentSource).toContain('suggestedExpanded');
        expect(componentSource).toContain('toggleSuggested');
        expect(componentSource).not.toContain('applySuggested');
        expect(componentSource).toContain("$t('tripContributionHowCalculated')");
        expect(componentSource).toContain("$t('tripContributionImportantTitle')");
        expect(componentSource).toContain('tripContributionImportantBody');
    });

    it('does not write the suggested amount into the price input on click', () => {
        expect(componentSource).not.toContain('contributionUnitsFromCents');
        expect(componentSource).toMatch(
            /@click="toggleSuggested"/
        );
        expect(componentSource).toMatch(
            /toggleSuggested\(\)\s*\{\s*this\.suggestedExpanded\s*=\s*!this\.suggestedExpanded;\s*\}/
        );
    });
});
