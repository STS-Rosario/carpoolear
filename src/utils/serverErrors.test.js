import { describe, expect, it } from 'vitest';
import {
    createServerUnavailableError,
    isMaintenanceResponse,
    isServerUnavailableApiError,
    isServerUnavailableHttpStatus
} from './serverErrors';

describe('serverErrors', () => {
    it('detects maintenance 503 responses', () => {
        expect(
            isMaintenanceResponse(503, { maintenance: true, message: 'DB work' })
        ).toBe(true);
        expect(isMaintenanceResponse(503, { message: 'Gateway timeout' })).toBe(
            false
        );
    });

    it('detects server-unavailable HTTP statuses', () => {
        expect(isServerUnavailableHttpStatus(502)).toBe(true);
        expect(isServerUnavailableHttpStatus(503)).toBe(true);
        expect(isServerUnavailableHttpStatus(504)).toBe(true);
        expect(isServerUnavailableHttpStatus(500)).toBe(false);
    });

    it('creates and detects normalized server-unavailable API errors', () => {
        const error = createServerUnavailableError();
        expect(error).toEqual({
            data: { message: 'server_unavailable' },
            status: 0,
            serverUnavailable: true
        });
        expect(isServerUnavailableApiError(error)).toBe(true);
    });
});
