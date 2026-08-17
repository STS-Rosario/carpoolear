import { describe, expect, it, vi } from 'vitest';
import {
    formatApiErrorForClientLog,
    reportClientError
} from './clientErrorReporting.js';

describe('clientErrorReporting', () => {
    it('formats api errors into a safe log payload', () => {
        expect(
            formatApiErrorForClientLog({
                status: 422,
                data: {
                    message: 'Could not create new trip.',
                    errors: {
                        car_id: ['The driver must have a car with a plate.']
                    }
                }
            })
        ).toEqual({
            status: 422,
            message: 'Could not create new trip.',
            errors: {
                car_id: ['The driver must have a car with a plate.']
            }
        });
    });

    it('reports sanitized payloads through DebugApi', async () => {
        const debugApi = {
            log: vi.fn().mockResolvedValue({ data: 'ok' })
        };

        await reportClientError({
            source: 'trip_create',
            message: 'Trip create failed',
            error: {
                status: 422,
                data: { message: 'Could not create new trip.' }
            },
            debugApi
        });

        expect(debugApi.log).toHaveBeenCalledWith({
            source: 'trip_create',
            log: 'Trip create failed',
            context: {
                status: 422,
                message: 'Could not create new trip.'
            }
        });
    });

    it('does not call DebugApi when there is nothing safe to log', async () => {
        const debugApi = {
            log: vi.fn()
        };

        await reportClientError({
            source: '',
            message: '',
            error: null,
            debugApi
        });

        expect(debugApi.log).not.toHaveBeenCalled();
    });

    it('swallows reporting failures without throwing', async () => {
        const debugApi = {
            log: vi.fn().mockRejectedValue(new Error('network'))
        };

        await expect(
            reportClientError({
                source: 'trip_create',
                message: 'Trip create failed',
                debugApi
            })
        ).resolves.toBeUndefined();
    });
});
