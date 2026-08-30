import { describe, expect, it, vi } from 'vitest';
import {
    applySuccessfulIdentityVerificationToUser,
    syncAuthUserAfterIdentityVerificationSuccess
} from './userIdentityVerification';

describe('applySuccessfulIdentityVerificationToUser', () => {
    it('marks the user as identity verified so restricted actions are allowed', () => {
        const user = {
            id: 7,
            name: 'Ada',
            identity_validated: false,
            identity_validated_at: null,
            identity_validation_required_for_user: true,
            identity_validation_rejected_at: '2026-05-01 12:00:00',
            identity_validation_reject_reason: 'dni_mismatch'
        };

        const nextUser = applySuccessfulIdentityVerificationToUser(
            user,
            '2026-08-30T18:00:00.000Z'
        );

        expect(nextUser.identity_validated).toBe(true);
        expect(nextUser.identity_validated_at).toBe('2026-08-30T18:00:00.000Z');
        expect(nextUser.identity_validation_rejected_at).toBeNull();
        expect(nextUser.identity_validation_reject_reason).toBeNull();
        expect(nextUser.id).toBe(7);
        expect(user.identity_validated).toBe(false);
    });

    it('keeps an existing verification timestamp', () => {
        const user = {
            identity_validated: true,
            identity_validated_at: '2026-06-01 10:00:00'
        };

        expect(
            applySuccessfulIdentityVerificationToUser(
                user,
                '2026-08-30T18:00:00.000Z'
            ).identity_validated_at
        ).toBe('2026-06-01 10:00:00');
    });

    it('returns the original value when user is missing', () => {
        expect(applySuccessfulIdentityVerificationToUser(null)).toBeNull();
        expect(applySuccessfulIdentityVerificationToUser(undefined)).toBeUndefined();
    });
});

describe('syncAuthUserAfterIdentityVerificationSuccess', () => {
    it('updates auth user and refreshes from the API after successful verification', async () => {
        const user = {
            id: 7,
            identity_validated: false,
            identity_validated_at: null
        };
        const setUser = vi.fn();
        const fetchUser = vi.fn(() => Promise.resolve());

        await syncAuthUserAfterIdentityVerificationSuccess({
            resultMessage: 'success',
            user,
            setUser,
            fetchUser
        });

        expect(setUser).toHaveBeenCalledTimes(1);
        expect(setUser.mock.calls[0][0].identity_validated).toBe(true);
        expect(fetchUser).toHaveBeenCalledTimes(1);
    });

    it('does not change auth user when verification did not succeed', async () => {
        const setUser = vi.fn();
        const fetchUser = vi.fn();

        await syncAuthUserAfterIdentityVerificationSuccess({
            resultMessage: 'error',
            user: { identity_validated: false },
            setUser,
            fetchUser
        });

        expect(setUser).not.toHaveBeenCalled();
        expect(fetchUser).not.toHaveBeenCalled();
    });

    it('still refreshes from the API when the local user is missing', async () => {
        const fetchUser = vi.fn(() => Promise.resolve());
        const setUser = vi.fn();

        await syncAuthUserAfterIdentityVerificationSuccess({
            resultMessage: 'success',
            user: null,
            setUser,
            fetchUser
        });

        expect(setUser).not.toHaveBeenCalled();
        expect(fetchUser).toHaveBeenCalledTimes(1);
    });
});
