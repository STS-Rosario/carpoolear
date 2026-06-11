import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'TripCreationSuccess.vue');
const componentSource = fs.readFileSync(componentPath, 'utf8');

describe('TripCreationSuccess.vue', () => {
    it('offers a return-trip button for driver trips', () => {
        expect(componentSource).toContain('data-testid="trip-creation-return-trip"');
        expect(componentSource).toContain("$t('cargarViajeRegreso')");
        expect(componentSource).toContain("$emit('start-return-trip')");
        expect(componentSource).toContain('!trip.is_passenger');
    });

    it('builds share text with trip date, destination and url', () => {
        expect(componentSource).toContain('buildTripShareMessage');
        expect(componentSource).toContain('translate: (key, params) => this.$t(key, params)');
        expect(componentSource).not.toContain("'publicarUnViajeCompartir'");
    });

    it('vertically centers action buttons including the view-trip router-link', () => {
        expect(componentSource).toContain('.trip-creation-success__actions .btn');
        expect(componentSource).toMatch(
            /\.trip-creation-success__actions\s*\{[^}]*align-items:\s*center/
        );
        expect(componentSource).toMatch(
            /\.trip-creation-success__actions\s+\.btn\s*\{[^}]*display:\s*inline-flex[^}]*align-items:\s*center/
        );
    });

    it('embeds invite friends once and closes to trip detail', () => {
        expect(componentSource).not.toContain('trip-creation-success__invite-title');
        expect(componentSource).not.toContain("$t('queresInvitarTusAmigos')");
        expect(componentSource).toContain('close-behavior="trip-detail"');
        expect(componentSource).not.toContain('@close=');
    });

    it('offers saving the trip as a reusable template', () => {
        expect(componentSource).toContain('data-testid="trip-creation-save-template"');
        expect(componentSource).toContain("$t('tripCreationSaveTemplate')");
        expect(componentSource).toContain("$t('tripCreationSaveTemplateTitle')");
        expect(componentSource).toContain("$t('tripCreationSaveTemplateBody')");
        expect(componentSource).toContain("$t('tripCreationTemplateNameLabel')");
        expect(componentSource).toContain('buildTripCreationTemplateFromSnapshot');
        expect(componentSource).toContain('saveTripCreationTemplate');
        expect(componentSource).toContain("$t('tripCreationTemplateSaved')");
    });
});
