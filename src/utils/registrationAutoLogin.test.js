import { describe, it, expect, vi } from 'vitest';
import { completeSessionIfRegistrationReturnsToken } from './registrationAutoLogin.js';

describe('completeSessionIfRegistrationReturnsToken', () => {
    it('calls onLoginWithToken when API response includes a non-empty token', async () => {
        const onLoginWithToken = vi.fn().mockResolvedValue(undefined);
        await completeSessionIfRegistrationReturnsToken(
            { data: { id: 1, active: 1 }, token: 'jwt-from-registration' },
            onLoginWithToken
        );
        expect(onLoginWithToken).toHaveBeenCalledTimes(1);
        expect(onLoginWithToken).toHaveBeenCalledWith('jwt-from-registration');
    });

    it('does not call onLoginWithToken when token is missing', async () => {
        const onLoginWithToken = vi.fn();
        await completeSessionIfRegistrationReturnsToken({ data: { id: 1 } }, onLoginWithToken);
        expect(onLoginWithToken).not.toHaveBeenCalled();
    });
});
