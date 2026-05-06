import { describe, expect, it } from 'vitest';
import {
    isIdentityValidationActionBlockedByMissingDni,
    getManualIdentityValidationRoute
} from './identityValidationDniRequirements.js';

describe('identityValidationDniRequirements', () => {
    it('blocks identity validation actions when user is missing', () => {
        expect(isIdentityValidationActionBlockedByMissingDni(null)).toBe(true);
    });

    it('blocks identity validation actions when user has no dni', () => {
        expect(
            isIdentityValidationActionBlockedByMissingDni({
                id: 1,
                nro_doc: null
            })
        ).toBe(true);
    });

    it('allows identity validation actions when user has dni', () => {
        expect(
            isIdentityValidationActionBlockedByMissingDni({
                id: 1,
                nro_doc: '30111222'
            })
        ).toBe(false);
    });

    it('returns profile edit route when manual action is blocked', () => {
        expect(getManualIdentityValidationRoute(null)).toEqual({
            name: 'profile_update'
        });
    });

    it('returns manual validation route when dni is present', () => {
        expect(
            getManualIdentityValidationRoute({
                id: 1,
                nro_doc: '30111222'
            })
        ).toEqual({
            name: 'identity_validation_manual'
        });
    });
});
