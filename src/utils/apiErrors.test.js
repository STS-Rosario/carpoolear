import { describe, expect, it } from 'vitest';
import { isOfflineApiError } from './apiErrors.js';

describe('api error helpers', () => {
    it('detects normalized offline API errors', () => {
        expect(
            isOfflineApiError({
                data: { message: 'network_offline' },
                status: 0,
                offline: true
            })
        ).toBe(true);
    });

    it('does not treat validation responses as offline errors', () => {
        expect(
            isOfflineApiError({
                data: { errors: { email: ['The email has already been taken.'] } },
                status: 422
            })
        ).toBe(false);
    });
});
