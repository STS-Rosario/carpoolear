import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'TripReviewStepPanel.vue');
const componentSource = fs.readFileSync(componentPath, 'utf8');

describe('TripReviewStepPanel.vue', () => {
    it('renders review sections with edit actions and no-lucrar modal', () => {
        expect(componentSource).toContain("$t('tripCreationStepLastDetailsTitle')");
        expect(componentSource).toContain("$t('tripCreationStepLastDetailsSubtitle')");
        expect(componentSource).toContain("$t('tripReviewSectionRoute')");
        expect(componentSource).toContain("$t('tripReviewSectionVehicle')");
        expect(componentSource).toContain("$t('tripReviewSectionSeats')");
        expect(componentSource).toContain("$t('tripReviewSectionContribution')");
        expect(componentSource).toContain('unLitroSectionTitle');
        expect(componentSource).toContain('showUnLitroCard');
        expect(componentSource).toContain('selladoCharged');
        expect(componentSource).toContain('selladoComplimentary');
        expect(componentSource).toContain('selladoBonificado');
        expect(componentSource).toMatch(
            /v-if="showUnLitroCard && \(selladoCharged \|\| selladoComplimentary \|\| selladoBonificado\)"/
        );
        expect(componentSource).toContain(':complimentary="selladoComplimentary"');
        expect(componentSource).toContain(':bonificado="selladoBonificado"');
        expect(componentSource).toContain('UnLitroInfoCard');
        expect(componentSource).toContain('unLitroReviewIncludes');
        expect(componentSource).toContain('formatPesoIntegerFromCents');
        expect(componentSource).toContain("$t('tripReviewSectionPreferences')");
        expect(componentSource).toContain("$t('tripReviewEdit')");
        expect(componentSource).toContain("emit('edit'");
        expect(componentSource).toContain('getTripReviewEditStep');
        expect(componentSource).toContain('noLucrar');
        expect(componentSource).toContain("$t('tripReviewMoreInfo')");
        expect(componentSource).toContain("$t('tripReviewNoLucrarModalTitle')");
        expect(componentSource).toContain('showNoLucrarModal');
    });

    it('shows Este viaje suma Un litro on the last step when the trip is charged', () => {
        const chargedBlock = componentSource.match(
            /class="trip-review-step__un-litro"[\s\S]*?<UnLitroInfoCard[\s\S]*?\/>/
        )?.[0];

        expect(chargedBlock).toBeTruthy();
        expect(chargedBlock).toContain(':charged="true"');
        expect(chargedBlock).not.toContain('link-only');
        expect(componentSource).toContain(
            'trip-review-step__section--contribution'
        );
        expect(componentSource).toContain(
            '.trip-review-step__section--contribution'
        );
        expect(componentSource).toContain(
            '.trip-review-step__section--contribution {\n    padding-bottom: 0.5rem;'
        );
        expect(componentSource).not.toMatch(
            /\.trip-review-step__section--contribution \{[^}]*border-bottom:\s*0/
        );
        expect(componentSource).toContain(
            '.trip-review-step__section--un-litro {\n    padding-top: 1.25rem;\n    padding-bottom: 1.25rem;'
        );
        expect(componentSource).toContain(
            '.trip-review-step__nolucrar {\n    margin-top: 1.25rem;'
        );
        expect(componentSource).toContain(
            '.trip-review-step__price-caption {\n    margin: 0.2rem 0 0;'
        );
        expect(componentSource).toContain(
            '.trip-review-step__un-litro-amount {\n    margin: 0 0 0.15rem;'
        );
        expect(componentSource).toContain(
            '.trip-review-step__un-litro-card {\n    margin-top: 0.15rem;\n    margin-bottom: 0;'
        );
        expect(
            (componentSource.match(/class="trip-review-step__un-litro-card"/g) || [])
                .length
        ).toBe(2);
    });
});
