import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'IdentityValidation.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('IdentityValidation rejected manual verification', () => {
    it('uses shared success banner helper so rejected manual flow is not hidden', () => {
        expect(viewSource).toContain('shouldShowIdentityVerificationSuccessBanner');
    });

    it('shows retry prompt and choice cards when manual verification was rejected', () => {
        expect(viewSource).toContain('showManualRejectedWithChoiceCards');
        expect(viewSource).toContain('identity-validation-rejected-flow');
        expect(viewSource).toContain("$t('identityValidationRetryPrompt')");
        expect(viewSource).toContain('identity-validation-cards');
        expect(viewSource).toContain("$t('validarConMercadoPago')");
        expect(viewSource).toContain("$t('solicitarVerificacionManual')");
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
});

describe('IdentityValidation Mercado Pago ownership warning', () => {
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

    it('styles profile edit link inside Mercado Pago ownership warning', () => {
        expect(viewSource).toContain('.identity-validation-mp-warning a {');
    });
});

describe('IdentityValidation manual admin review note', () => {
    it('shows admin review note in success banner and main flow when present', () => {
        expect(viewSource).toContain('IdentityValidationAdminReviewNote');
        expect(viewSource).toContain('displayableManualReviewNote');
        expect(viewSource).toContain('manualAdminReviewNoteLabelKey');
        expect(viewSource).toContain('manualIdentityValidationReviewNote');
    });

    it('does not render review note only inside rejection notice markup', () => {
        expect(viewSource).not.toContain(
            'identity-validation-rejection-notice__note"'
        );
    });
});
