import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'TripCreationSuccess.vue');
const componentSource = fs
    .readFileSync(componentPath, 'utf8')
    .replace(/\r\n/g, '\n');

describe('TripCreationSuccess.vue', () => {
    it('offers a return-trip button for driver trips', () => {
        expect(componentSource).toContain('data-testid="trip-creation-return-trip"');
        expect(componentSource).toContain("$t('cargarViajeRegreso')");
        expect(componentSource).toContain("$emit('start-return-trip')");
        expect(componentSource).toContain('!trip.is_passenger');
    });

    it('shares trip detail through shareTripDetail', () => {
        expect(componentSource).toContain('shareTripDetail');
        expect(componentSource).not.toContain('buildTripShareMessage');
        expect(componentSource).not.toContain('shareContent');
        expect(componentSource).not.toContain("'publicarUnViajeCompartir'");
    });

    it('does not show the share prompt above the action buttons', () => {
        expect(componentSource).not.toContain('tripCreationSuccessSharePrompt');
        expect(componentSource).not.toContain('trip-creation-success__prompt');
    });

    it('vertically centers action buttons including the view-trip router-link', () => {
        expect(componentSource).toContain('.trip-creation-success__actions');
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
    });

    it('shows Bonificado or Este viaje aporta with last-step card styling', () => {
        expect(componentSource).toContain('unLitroCardKindFromTrip');
        expect(componentSource).toContain('v-if="unLitroKind"');
        expect(componentSource).toContain(':charged="unLitroKind === \'charged\'"');
        expect(componentSource).toContain(
            ':complimentary="unLitroKind === \'complimentary\'"'
        );
        expect(componentSource).toContain(':bonificado="unLitroKind === \'bonificado\'"');
        expect(componentSource).toContain('hasComplimentarySellado');
        expect(componentSource).toContain('trip-creation-success__un-litro');
        expect(componentSource).toContain("$t('unLitroSectionTitle')");
        expect(componentSource).toContain('text-align: left');
    });

    it('shows Un litro payment methods before share actions when sellado is pending', () => {
        expect(componentSource).toContain('isSelladoPending');
        expect(componentSource).toContain("$t('unLitroPublishTitle')");
        expect(componentSource).toContain('UnLitroPayCard');
        expect(componentSource).toContain(':qr-enabled="qrEnabled"');
        expect(componentSource).toContain('isTripCreationPaymentQrEnabled');
        expect(componentSource).not.toContain('RapiPago');
        const payCardIdx = componentSource.indexOf('<UnLitroPayCard');
        const shareIdx = componentSource.indexOf('data-testid="trip-creation-share"');
        expect(payCardIdx).toBeGreaterThan(-1);
        expect(shareIdx).toBeGreaterThan(payCardIdx);
        expect(componentSource).not.toMatch(
            /v-if="!showUnLitroPayment"[\s\S]*?class="trip-creation-success__actions"/
        );
        expect(componentSource).toContain(
            'v-if="!showUnLitroPayment"\n            class="trip-creation-success__invite"'
        );
    });

    it('keeps share, return trip and save template visible while Un litro is unpaid', () => {
        expect(componentSource).toContain('data-testid="trip-creation-share"');
        expect(componentSource).toContain('data-testid="trip-creation-return-trip"');
        expect(componentSource).toContain('data-testid="trip-creation-save-template"');
        expect(componentSource).toContain('canSaveTemplate');
        expect(componentSource).not.toMatch(
            /v-if="!showUnLitroPayment"[\s\S]*?class="trip-creation-success__actions"/
        );
        expect(componentSource).toContain(
            'v-if="!showUnLitroPayment"\n            class="trip-creation-success__invite"'
        );
    });

    it('scrolls to the top when the success screen is shown', () => {
        expect(componentSource).toContain('window.scrollTo(0, 0)');
        expect(componentSource).toMatch(
            /mounted\(\)\s*\{[\s\S]*window\.scrollTo\(0,\s*0\)/
        );
    });
});
