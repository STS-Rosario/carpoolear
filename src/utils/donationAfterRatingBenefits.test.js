import { describe, expect, it } from 'vitest';
import { DONATION_AFTER_RATING_BENEFIT_KEYS } from './donationAfterRatingBenefits.js';
import messages from '../language/i18n';

describe('donationAfterRatingBenefits', () => {
    it('lists all monthly benefit translation keys', () => {
        expect(DONATION_AFTER_RATING_BENEFIT_KEYS).toEqual([
            'donationAfterRatingBenefitPrioritySupport',
            'donationAfterRatingBenefitEarlyAccess',
            'donationAfterRatingBenefitSemiannualReport',
            'donationAfterRatingBenefitBadge'
        ]);
    });

    it.each(['arg', 'en'])(
        'defines monthly benefit copy in %s locale as plain "Label: text"',
        (locale) => {
            DONATION_AFTER_RATING_BENEFIT_KEYS.forEach((benefitKey) => {
                expect(messages[locale][benefitKey]).toMatch(/^[^<:]+: [^<]+$/);
            });
        }
    );
});
