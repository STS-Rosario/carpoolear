import { describe, expect, it } from 'vitest';
import { DONATION_AFTER_RATING_BENEFIT_KEYS } from './donationAfterRatingBenefits.js';
import messages from '../language/i18n';

describe('donationAfterRatingBenefits', () => {
    it('lists all monthly benefit translation keys', () => {
        expect(DONATION_AFTER_RATING_BENEFIT_KEYS).toEqual([
            'donationAfterRatingBenefitVisibility',
            'donationAfterRatingBenefitPrioritySupport',
            'donationAfterRatingBenefitEarlyAccess',
            'donationAfterRatingBenefitSemiannualReport',
            'donationAfterRatingBenefitBadge'
        ]);
    });

    it.each(['arg', 'chl', 'en'])(
        'defines monthly benefit copy in %s locale with bold labels',
        (locale) => {
            for (const key of DONATION_AFTER_RATING_BENEFIT_KEYS) {
                expect(messages[locale][key]).toMatch(/^<strong>[^<]+:<\/strong> /);
            }
        }
    );
});
