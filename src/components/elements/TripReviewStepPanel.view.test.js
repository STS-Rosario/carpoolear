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

    it('hides seats and preferences sections for passengers', () => {
        // Mirrors the existing showVehicle/showContribution pattern: the
        // section (and its edit link into a step passengers cannot see)
        // is skipped entirely instead of just shown disabled.
        expect(componentSource).toContain('v-if="showSeats"');
        expect(componentSource).toContain('v-if="showPreferences"');
        expect(componentSource).toContain('showSeats: { type: Boolean, default: true }');
        expect(componentSource).toContain('showPreferences: { type: Boolean, default: true }');
    });
});
