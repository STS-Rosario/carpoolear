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
        expect(componentSource).toContain(':complimentary="selladoComplimentary"');
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

    it('keeps charged Un litro compact with Qué es esto and a divider before preferences', () => {
        const chargedBlock = componentSource.match(
            /class="trip-review-step__un-litro"[\s\S]*?<UnLitroInfoCard[\s\S]*?\/>/
        )?.[0];

        expect(chargedBlock).toBeTruthy();
        expect(chargedBlock).toContain('link-only');
        expect(chargedBlock).not.toContain(':charged="true"');
        expect(componentSource).toContain(
            'trip-review-step__section--contribution'
        );
        expect(componentSource).toContain(
            '.trip-review-step__section--contribution'
        );
        expect(componentSource).toContain(
            '.trip-review-step__section--contribution {\n    padding-bottom: 0.5rem;\n    border-bottom: 0;'
        );
        expect(componentSource).toContain(
            '.trip-review-step__section--un-litro {\n    padding-top: 0.5rem;'
        );
        expect(componentSource).toContain(
            '.trip-review-step__price-caption {\n    margin: 0.2rem 0 0;'
        );
        expect(componentSource).toContain(
            '.trip-review-step__un-litro-amount {\n    margin: 0 0 0.15rem;'
        );
        expect(componentSource).toContain(
            '.trip-review-step__un-litro-card {\n    margin-top: 0.15rem;'
        );
    });
});
