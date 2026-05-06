import { describe, expect, it } from 'vitest';
import { getIdentityValidationPendingSwitchBehavior } from './identityValidationPendingSwitchBehavior.js';

describe('getIdentityValidationPendingSwitchBehavior', () => {
    it('uses mercado pago oauth as the pending-payment switch action', () => {
        expect(getIdentityValidationPendingSwitchBehavior()).toBe('mercadopago_oauth');
    });
});
