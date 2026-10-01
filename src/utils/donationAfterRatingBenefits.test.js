import { describe, expect, it } from 'vitest';
import { DONATION_AFTER_RATING_BENEFIT_KEYS } from './donationAfterRatingBenefits.js';
import messages from '../language/i18n';

describe('donationAfterRatingBenefits', () => {
    it('lists the document benefits as base keys for a title and a text', () => {
        expect(DONATION_AFTER_RATING_BENEFIT_KEYS).toEqual([
            'donationAfterRatingBenefitPrioritySupport',
            'donationAfterRatingBenefitEarlyAccess',
            'donationAfterRatingBenefitSemiannualReport',
            'donationAfterRatingBenefitBadge'
        ]);
    });

    it.each(['arg', 'en'])(
        'defines a "Title:" and a plain text for each benefit in %s',
        (locale) => {
            DONATION_AFTER_RATING_BENEFIT_KEYS.forEach((benefitKey) => {
                expect(messages[locale][`${benefitKey}Title`]).toMatch(/^[^<:]+:$/);
                expect(messages[locale][`${benefitKey}Text`]).toMatch(/^[^<]+$/);
                expect(messages[locale][benefitKey]).toBeUndefined();
            });
        }
    );
});
