import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'IdentityValidation.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('IdentityValidation rejection warnings', () => {
    it('shows mismatch support warning with warning icon in MP mismatch alert', () => {
        expect(viewSource).toContain('<div class="alert alert-warning" v-if="mismatchDetails">');
        expect(viewSource).toContain('identity-validation-mismatch-support-warning');
        expect(viewSource).toContain('$t(mismatchSupportWarningKey)');
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
