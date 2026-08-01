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

    it('does not show the share prompt above the action buttons', () => {
        expect(componentSource).not.toContain('tripCreationSuccessSharePrompt');
        expect(componentSource).not.toContain('trip-creation-success__prompt');
    });

    it('vertically centers action buttons including the view-trip router-link', () => {
        expect(componentSource).toContain('.trip-creation-success__actions');
        expect(componentSource).toMatch(
            /\.trip-creation-success__actions\s*\{[^}]*flex-direction:\s*column[^}]*align-items:\s*stretch/
        );
    });

    it('embeds invite friends once and closes to trip detail', () => {
        expect(componentSource).not.toContain('trip-creation-success__invite-title');
        expect(componentSource).not.toContain("$t('queresInvitarTusAmigos')");
        expect(componentSource).toContain('close-behavior="trip-detail"');
        expect(componentSource).not.toMatch(/TripInviteFriends[\s\S]*@close=/);
    });

    it('offers saving the trip as a reusable template', () => {
        expect(componentSource).toContain('data-testid="trip-creation-save-template"');
        expect(componentSource).toContain("$t('tripCreationSaveTemplate')");
        expect(componentSource).toContain("$t('tripCreationSaveTemplateTitle')");
        expect(componentSource).toContain("$t('tripCreationSaveTemplateBody')");
        expect(componentSource).toContain("$t('tripCreationTemplateNameLabel')");
        expect(componentSource).toContain("$t('tripCreationOr')");
        expect(componentSource).toContain("$t('tripCreationReplaceTemplateLabel')");
        expect(componentSource).toContain('data-testid="trip-creation-template-replace"');
        expect(componentSource).toContain('listTripCreationTemplates');
        expect(componentSource).toContain('resolveTripCreationTemplateSaveName');
        expect(componentSource).toContain('canSaveTripCreationTemplateName');
        expect(componentSource).toContain('canConfirmSaveTemplate');
        expect(componentSource).toContain('buildTripCreationTemplateFromSnapshot');
        expect(componentSource).toContain('saveTripCreationTemplate');
        expect(componentSource).toContain("$t('tripCreationTemplateSaved')");
        expect(componentSource).toContain("$t('errorAlGuardar')");
    });

    it('stacks trip actions in a column with Ver viaje primary and secondary share/return/template', () => {
        const viewIdx = componentSource.indexOf('data-testid="trip-creation-view-trip"');
        const shareIdx = componentSource.indexOf('data-testid="trip-creation-share"');
        const returnIdx = componentSource.indexOf('data-testid="trip-creation-return-trip"');
        const templateIdx = componentSource.indexOf('data-testid="trip-creation-save-template"');

        expect(viewIdx).toBeGreaterThan(-1);
        expect(shareIdx).toBeGreaterThan(viewIdx);
        expect(returnIdx).toBeGreaterThan(shareIdx);
        expect(templateIdx).toBeGreaterThan(returnIdx);

        expect(componentSource).toContain("import AppButton from '../ui/AppButton.vue'");
        expect(componentSource).toMatch(
            /variant="primary"[\s\S]*?data-testid="trip-creation-view-trip"/
        );
        expect(componentSource).toMatch(
            /variant="secondary"[\s\S]*?data-testid="trip-creation-share"[\s\S]*?icon-left="fa fa-share-alt"/
        );
        expect(componentSource).toMatch(
            /variant="secondary"[\s\S]*?data-testid="trip-creation-return-trip"[\s\S]*?icon-left="fa fa-arrow-left"/
        );
        expect(componentSource).toMatch(
            /variant="secondary"[\s\S]*?data-testid="trip-creation-save-template"[\s\S]*?icon-left="fa fa-bookmark"/
        );
        expect(componentSource).not.toContain('btn btn-primary');
        expect(componentSource).toMatch(
            /\.trip-creation-success__actions\s*\{[^}]*flex-direction:\s*column/
        );
    });
});
