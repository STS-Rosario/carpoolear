import { describe, expect, it } from 'vitest';
import {
    getIdentityValidationPendingSwitchBehavior,
    IDENTITY_VALIDATION_PENDING_SWITCH_BEHAVIOR_OAUTH
} from './identityValidationPendingSwitchBehavior.js';

describe('getIdentityValidationPendingSwitchBehavior', () => {
    it('uses mercado pago oauth as the pending-payment switch action', () => {
        expect(getIdentityValidationPendingSwitchBehavior()).toBe(
            IDENTITY_VALIDATION_PENDING_SWITCH_BEHAVIOR_OAUTH
        );
    });
});
