import { describe, expect, it, vi } from 'vitest';
import { handleGenericApiError } from './genericApiErrorHandling.js';

describe('genericApiErrorHandling', () => {
    it('reports the error and shows a translated fallback message', async () => {
        const dialogs = { message: vi.fn() };
        const reportError = vi.fn().mockResolvedValue(undefined);

        await handleGenericApiError(
            { status: 500, data: { message: 'Server Error' } },
            {
                source: 'support_ticket_create',
                fallbackMessageKey: 'errorDatos',
                t: (key) => key,
                dialogs,
                reportError
            }
        );

        expect(reportError).toHaveBeenCalledWith(
            'support_ticket_create',
            { status: 500, data: { message: 'Server Error' } },
            { debugEnabled: false }
        );
        expect(dialogs.message).toHaveBeenCalledWith('errorDatos', {
            estado: 'error'
        });
    });

    it('prefers field validation messages over the fallback', async () => {
        const dialogs = { message: vi.fn() };

        await handleGenericApiError(
            {
                status: 422,
                data: {
                    errors: {
                        subject: ['The subject field is required.']
                    }
                }
            },
            {
                source: 'support_ticket_create',
                fallbackMessageKey: 'errorDatos',
                t: (key) => key,
                dialogs,
                reportError: vi.fn()
            }
        );

        expect(dialogs.message).toHaveBeenCalledWith('The subject field is required.', {
            estado: 'error'
        });
    });
});
