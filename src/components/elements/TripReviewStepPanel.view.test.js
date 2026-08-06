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
        expect(componentSource).toContain("$t('tripReviewSectionPreferences')");
        expect(componentSource).toContain("$t('tripReviewEdit')");
        expect(componentSource).toContain("emit('edit'");
        expect(componentSource).toContain('getTripReviewEditStep');
        expect(componentSource).toContain('noLucrar');
        expect(componentSource).toContain("$t('tripReviewMoreInfo')");
        expect(componentSource).toContain("$t('tripReviewNoLucrarModalTitle')");
        expect(componentSource).toContain('showNoLucrarModal');
    });
});
