import { describe, it, expect } from 'vitest';
import { normalizeAdminDashboardResponse } from './adminDashboardData';

describe('normalizeAdminDashboardResponse', () => {
    it('extracts manual verifications and support tickets from nested api payload', () => {
        const result = normalizeAdminDashboardResponse({
            data: {
                manual_identity_validations: [{ id: 1 }],
                support_tickets: [{ id: 2 }]
            }
        });

        expect(result).toEqual({
            manualIdentityValidations: [{ id: 1 }],
            supportTickets: [{ id: 2 }]
        });
    });

    it('returns empty arrays when payload is missing', () => {
        expect(normalizeAdminDashboardResponse(null)).toEqual({
            manualIdentityValidations: [],
            supportTickets: []
        });
    });
});
