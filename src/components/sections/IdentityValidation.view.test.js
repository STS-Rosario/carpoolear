import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'IdentityValidation.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('IdentityValidation paid awaiting photos', () => {
    it('shows esperando fotos status before documents are uploaded', () => {
        expect(viewSource).toContain('manual-status-upload-block__status');
        expect(viewSource).toContain("{{ $t('estadoEsperandoFotos') }}");
    });
});

describe('IdentityValidation page card', () => {
    it('wraps content in a white card with the page title inside', () => {
        expect(viewSource).toContain('identity-validation-page__card');
        expect(viewSource).toContain('identity-validation-page__heading');
        expect(viewSource).toMatch(
            /identity-validation-page__card[\s\S]*identity-validation-page__heading[\s\S]*\$t\('validarIdentidad'\)/
        );
    });
});

describe('IdentityValidation admin review note contexts', () => {
    it('uses approval note helper in success banner', () => {
        expect(viewSource).toContain('displayableManualApprovalReviewNote');
        expect(viewSource).toContain('manualApprovalReviewNoteLabelKey');
    });

    it('uses rejection note helper only in rejection notice', () => {
        expect(viewSource).toContain('displayableManualRejectionReviewNote');
        expect(viewSource).toContain('manualRejectionReviewNoteLabelKey');
        expect(viewSource).not.toContain(':note="displayableManualReviewNote"');
    });
});

describe('IdentityValidation rejected manual verification', () => {
    it('passes the current user into manual rejection choice-card helper', () => {
        expect(viewSource).toContain('user: this.user');
    });

    it('shows retry prompt and choice cards when manual verification was rejected', () => {
        expect(viewSource).toContain('showManualRejectedWithChoiceCards');
        expect(viewSource).toContain('identity-validation-rejected-flow');
        expect(viewSource).toContain("$t('identityValidationRetryPrompt')");
        expect(viewSource).toContain('identity-validation-cards');
        expect(viewSource).toContain("$t('validarConMercadoPago')");
        expect(viewSource).toContain("$t('solicitarVerificacionManual')");
    });

    it('does not render standalone in-flow review note when manual verification was rejected', () => {
        expect(viewSource).not.toContain('in-flow');
    });
});

describe('IdentityValidation rejection warnings', () => {
    it('shows mismatch support warning with warning icon in MP mismatch alert', () => {
        expect(viewSource).toContain('<div class="alert alert-warning" v-if="mismatchDetails">');
        expect(viewSource).toContain('identity-validation-mismatch-support-warning');
        expect(viewSource).toContain('$t(mismatchSupportWarningParts.leadKey)');
        expect(viewSource).toContain('fa fa-exclamation-triangle');
    });

    it('maps MP mismatch result to support warning key', () => {
        expect(viewSource).toContain('mismatchSupportWarningKey');
        expect(viewSource).toContain('this.resultMessage');
    });

    it('renders mismatch support warning after mismatch details rows', () => {
        const warningIndex = viewSource.indexOf('identity-validation-mismatch-support-warning');
        const detailsIndex = viewSource.indexOf("{{ $t('nombreEnMercadoPago') }}:");
        expect(warningIndex).toBeGreaterThan(detailsIndex);
    });

    it('links mismatch support warning to ticket creation route', () => {
        expect(viewSource).toContain(":to=\"{ name: 'ticket-new' }\"");
        expect(viewSource).toContain('identityValidationMismatchSupportTicketCta');
    });

    it('interpolates mismatch support warning text around ticket CTA link', () => {
        expect(viewSource).toContain('mismatchSupportWarningParts');
        expect(viewSource).toContain('$t(mismatchSupportWarningParts.leadKey)');
        expect(viewSource).toContain('$t(mismatchSupportWarningParts.tailKey)');
    });

    it('renders two-paragraph both-mismatch warning with ticket link in second paragraph', () => {
        expect(viewSource).toContain("mismatchSupportWarningParts.layout === 'twoParagraph'");
        expect(viewSource).toContain('identity-validation-mismatch-support-warning--stacked');
        expect(viewSource).toContain('identity-validation-mismatch-support-warning__paragraph');
        expect(viewSource).toContain('$t(mismatchSupportWarningParts.paragraph1Key)');
        expect(viewSource).toContain('$t(mismatchSupportWarningParts.paragraph2LeadKey)');
        expect(viewSource).toContain('$t(mismatchSupportWarningParts.paragraph2TailKey)');
    });

    it('shows warning icon and translated mismatch warning placeholder in rejected flow', () => {
        expect(viewSource).toContain('identity-validation-rejection-notice__support-warning');
        expect(viewSource).toContain('fa fa-exclamation-triangle');
        expect(viewSource).toContain('$t(manualRejectionSupportWarningKey)');
    });

    it('uses computed warning key helper in rejected flow', () => {
        expect(viewSource).toContain('manualRejectionSupportWarningKey');
    });

    it('uses manual reject reason to choose support warning copy', () => {
        expect(viewSource).toContain('manualStatus.reject_reason');
    });

    it('links to manual upload when resubmit without payment is available', () => {
        expect(viewSource).toContain('canManualResubmitWithoutPayment');
        expect(viewSource).toContain('manualValidationResubmitRoute');
        expect(viewSource).toContain('identityValidationRejectionResubmitDocumentsCta');
    });
});

describe('IdentityValidation Mercado Pago ownership warning', () => {
    it('lists that MP integration can be removed after verifying', () => {
        expect(viewSource).toContain("$t('identidadModalAutoPuedeEliminarMp')");
        const autoInmediata = viewSource.indexOf(
            "$t('identidadModalAutoInmediata')"
        );
        const puedeEliminar = viewSource.indexOf(
            "$t('identidadModalAutoPuedeEliminarMp')"
        );
        expect(autoInmediata).toBeGreaterThan(-1);
        expect(puedeEliminar).toBeGreaterThan(autoInmediata);
    });

    it('shows MP apps disconnect hint with link on MP verification success', () => {
        expect(viewSource).toContain('showMpIntegrationDisconnectHint');
        expect(viewSource).toContain('shouldShowMercadoPagoIntegrationDisconnectHint');
        expect(viewSource).toContain('MERCADO_PAGO_MY_APPS_URL');
        expect(viewSource).toContain(
            "$t('identityVerificationSuccessMpDisconnectLead')"
        );
        expect(viewSource).toContain(
            "$t('identityVerificationSuccessMpDisconnectLink')"
        );
        expect(viewSource).toContain(
            "$t('identityVerificationSuccessMpDisconnectTail')"
        );
        expect(viewSource).toContain(':href="mercadoPagoMyAppsUrl"');
    });

    it('shows manual MP disconnect instructions when disconnect hint is visible', () => {
        expect(viewSource).toContain(
            "$t('identityVerificationSuccessMpDisconnectManualInstructions')"
        );
        expect(viewSource).toContain(
            'identity-verification-success-banner__mp-disconnect-manual'
        );
        const disconnectTailIndex = viewSource.indexOf(
            "$t('identityVerificationSuccessMpDisconnectTail')"
        );
        const manualInstructionsIndex = viewSource.indexOf(
            "$t('identityVerificationSuccessMpDisconnectManualInstructions')"
        );
        expect(manualInstructionsIndex).toBeGreaterThan(disconnectTailIndex);
    });

    it('groups MP disconnect copy under a single visibility guard', () => {
        const templateStart = viewSource.indexOf(
            '<template v-if="showMpIntegrationDisconnectHint">'
        );
        const manualInstructionsIndex = viewSource.indexOf(
            "$t('identityVerificationSuccessMpDisconnectManualInstructions')"
        );
        const templateEnd = viewSource.indexOf(
            '</template>',
            templateStart
        );
        expect(templateStart).toBeGreaterThan(-1);
        expect(manualInstructionsIndex).toBeGreaterThan(templateStart);
        expect(manualInstructionsIndex).toBeLessThan(templateEnd);
    });

    it('shows ownership warning with profile edit link on MP verification card', () => {
        expect(viewSource).toContain('identity-validation-mp-warning');
        expect(viewSource).toContain(
            "$t('identityValidationMercadoPagoOwnershipWarningPrefix')"
        );
        expect(viewSource).toContain(
            "$t('identityValidationMercadoPagoOwnershipWarningProfileLink')"
        );
        expect(viewSource).toContain(
            "$t('identityValidationMercadoPagoOwnershipWarningSuffix')"
        );
        expect(viewSource).toContain('@click.prevent="goToProfileEdit"');
    });

    it('renders ownership warning with profile edit link in all MP warning blocks', () => {
        const prefixOccurrences = (
            viewSource.match(
                /identityValidationMercadoPagoOwnershipWarningPrefix/g
            ) || []
        ).length;
        expect(prefixOccurrences).toBe(3);
    });
});

describe('IdentityValidation manual admin review note', () => {
    it('shows admin review note in success banner and rejection notice when present', () => {
        expect(viewSource).toContain('IdentityValidationAdminReviewNote');
        expect(viewSource).toContain('displayableManualApprovalReviewNote');
        expect(viewSource).toContain('displayableManualRejectionReviewNote');
        expect(viewSource).toContain('manualApprovalReviewNoteLabelKey');
        expect(viewSource).toContain('manualRejectionReviewNoteLabelKey');
        expect(viewSource).toContain('manualIdentityValidationReviewNote');
    });

    it('does not render review note only inside rejection notice markup', () => {
        expect(viewSource).not.toContain(
            'identity-validation-rejection-notice__note"'
        );
    });
});
