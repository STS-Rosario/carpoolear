import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(
    __dirname,
    '../components/sections/ManualIdentityValidation.vue'
);
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('ManualIdentityValidation resubmit upload flow', () => {
    it('tracks can_resubmit_without_payment from status API', () => {
        expect(viewSource).toContain('canResubmitWithoutPayment');
        expect(viewSource).toContain('can_resubmit_without_payment');
    });

    it('shows upload form when resubmit is allowed without a new payment', () => {
        expect(viewSource).toContain('canUpload()');
        expect(viewSource).toContain('canResubmitWithoutPayment');
    });

    it('uses shouldShowManualValidationAlreadySubmitted for submitted-state panel', () => {
        expect(viewSource).toContain('shouldShowManualValidationAlreadySubmitted');
    });

    it('supports restart query param to begin payment again after exhausted rejections', () => {
        expect(viewSource).toContain('forcePaymentRestart');
        expect(viewSource).toContain("q.restart === '1'");
    });
});
