import { describe, expect, it } from 'vitest';
import { buildExcessContributionTemplatedTicketPayload } from './adminTripExcessContributionList';

describe('buildExcessContributionTemplatedTicketPayload', () => {
    it('builds an excess-contribution ticket for the item user with the i18n subject and template message', () => {
        const t = (key) => `t:${key}`;

        expect(
            buildExcessContributionTemplatedTicketPayload({ id: 99, user_id: 15 }, t)
        ).toEqual({
            user_id: 15,
            type: 'excess_contribution',
            subject: 't:ticketTypeExcessContribution',
            message_markdown: 't:excessContributionTemplatedTicketMessage',
            trip_id: 99
        });
    });
});
