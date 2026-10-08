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
        expect(componentSource).toContain('TripContributionBreakdown');
        expect(componentSource).toContain('pricingBreakdown');
        expect(componentSource).toContain('UnLitroInfoCard');
        expect(componentSource).toContain('showUnLitroCard');
        expect(componentSource).toContain(':charged="selladoCharged"');
        expect(componentSource).toContain(':complimentary="selladoComplimentary"');
        expect(componentSource).toContain(':remaining-free-trips="remainingFreeTrips"');
    });

    it('links to division de gastos help after suspension warning in importante notice', () => {
        expect(componentSource).toContain(
            'trip-contribution-step__important-explainer'
        );
        expect(componentSource).toContain(
            "$t('tripContributionDivisionExplainerPrefix')"
        );
        expect(componentSource).toContain(
            "$t('tripContributionDivisionExplainerLink')"
        );
        expect(componentSource).toContain(
            "$t('tripContributionDivisionExplainerSuffix')"
        );
        expect(componentSource).toContain("name: 'division_de_gastos'");
        expect(componentSource).toContain(':target="inAppLinkTarget()"');
        expect(componentSource).toContain('rel="noopener noreferrer"');
        const suspensionIndex = componentSource.indexOf(
            'tripContributionImportantBody'
        );
        const explainerIndex = componentSource.indexOf(
            'trip-contribution-step__important-explainer'
        );
        expect(suspensionIndex).toBeGreaterThan(-1);
        expect(explainerIndex).toBeGreaterThan(suspensionIndex);
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

    it('keeps expanded calculation body outside the accordion toggle button', () => {
        const toggleClose = componentSource.indexOf(
            'toggleSuggested'
        );
        const firstButtonClose = componentSource.indexOf(
            '</button>',
            toggleClose
        );
        const bodyIndex = componentSource.indexOf(
            'trip-contribution-step__suggested-body'
        );
        expect(bodyIndex).toBeGreaterThan(firstButtonClose);
        expect(componentSource).toContain('TripContributionBreakdown');
    });

    it('gates pricing breakdown on the show-breakdown config flag', () => {
        expect(componentSource).toContain('shouldShowContributionBreakdown');
        expect(componentSource).toContain('showContributionBreakdown');
        expect(componentSource).toContain('config:');
        expect(componentSource).toMatch(
            /v-if="showContributionBreakdown && pricingBreakdown"/
        );
    });

    it('renders an unchecked no-deposit commitment checkbox that must be ticked to continue', () => {
        expect(componentSource).toContain("$t('meComprometoNoCobrarSena')");
        expect(componentSource).toContain('type="checkbox"');
        expect(componentSource).toContain(':checked="noCobrarSena"');
        expect(componentSource).toContain(
            "@change=\"$emit('update:noCobrarSena', $event.target.checked)\""
        );
        expect(componentSource).toContain('noCobrarSenaError');
        expect(componentSource).toMatch(
            /noCobrarSena:\s*\{\s*type:\s*Boolean,\s*default:\s*false/
        );
        expect(componentSource).toContain("'update:noCobrarSena'");
        expect(componentSource).toContain(
            'data-testid="trip-contribution-no-sena"'
        );
        const importanteIndex = componentSource.indexOf(
            'trip-contribution-step__important'
        );
        const checkboxIndex = componentSource.indexOf(
            'trip-contribution-step__no-sena'
        );
        expect(importanteIndex).toBeGreaterThan(-1);
        expect(checkboxIndex).toBeGreaterThan(importanteIndex);
    });
});
