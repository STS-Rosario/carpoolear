import { describe, expect, it } from 'vitest';
import { getConversationContributionWarningData } from './conversationContributionWarning.js';

describe('getConversationContributionWarningData', () => {
    it('returns driver warning data including max contribution amount', () => {
        const data = getConversationContributionWarningData({
            conversation: {
                trip: {
                    id: 42,
                    seat_price_cents: 12345,
                    user: { id: 8 }
                }
            },
            user: { id: 8 }
        });

        expect(data).toEqual({
            role: 'driver',
            maxContributionCents: 12345,
            reportPath: null
        });
    });

    it('returns passenger warning data including report link with trip id', () => {
        const data = getConversationContributionWarningData({
            conversation: {
                trip: {
                    id: 99,
                    seat_price_cents: 5000,
                    user: { id: 8 }
                }
            },
            user: { id: 18 }
        });

        expect(data).toEqual({
            role: 'passenger',
            maxContributionCents: 5000,
            reportPath: '/denunciar?tripId=99'
        });
    });
});
