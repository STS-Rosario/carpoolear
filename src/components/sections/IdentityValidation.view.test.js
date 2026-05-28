import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'IdentityValidation.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('IdentityValidation rejection warnings', () => {
    it('shows warning icon and name mismatch support copy key in rejected flow', () => {
        expect(viewSource).toContain('identity-validation-rejection-notice__support-warning');
        expect(viewSource).toContain('fa fa-exclamation-triangle');
        expect(viewSource).toContain('identityValidationRejectionSupportWarningNameMismatch');
    });

    it('shows dni mismatch support copy key in rejected flow', () => {
        expect(viewSource).toContain('identityValidationRejectionSupportWarningDniMismatch');
    });

    it('uses manual reject reason to choose support warning copy', () => {
        expect(viewSource).toContain('manualStatus.reject_reason');
    });
});
