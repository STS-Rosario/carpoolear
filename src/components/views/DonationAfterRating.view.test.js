import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import messages from '../../language/i18n';

const viewPath = path.resolve(__dirname, 'DonationAfterRating.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('DonationAfterRating page content', () => {
    it('wraps all page content in an 80vw container on big desktop', () => {
        expect(viewSource).toContain('donation-after-rating__page');
        expect(viewSource).toMatch(
            /<div class="donation-after-rating__page">[\s\S]*<DonationAfterRatingHero \/>/
        );
        expect(viewSource).toMatch(
            /@media \(min-width: 992px\)[\s\S]*donation-after-rating__page[\s\S]*width:\s*80vw/
        );
    });

    it('shows the community CTA between the hero and donation form', () => {
        expect(viewSource).toContain('donation-after-rating__cta');
        expect(viewSource).toContain("$t('donationAfterRatingJoinPrefix')");
        expect(viewSource).toContain("$t('donationAfterRatingJoinAccent')");
        expect(viewSource).toContain('text-transform: uppercase');
        expect(viewSource).toContain(
            "$t('donationAfterRatingMonthlyBenefitsIntro')"
        );
        expect(viewSource).toContain('donation-after-rating__benefits');
        expect(viewSource).toContain('padding-inline-start: 2rem');
        expect(viewSource).toContain('list-style-position: inside');
        expect(viewSource).toContain('DONATION_AFTER_RATING_BENEFIT_KEYS');
        expect(viewSource.indexOf('DonationAfterRatingHero')).toBeLessThan(
            viewSource.indexOf('donation-after-rating__cta')
        );
        expect(viewSource.indexOf('donation-after-rating__cta')).toBeLessThan(
            viewSource.indexOf('DonationAmountPicker')
        );
    });

    it('shows the redesigned monthly and one-time donation actions', () => {
        expect(viewSource).toContain('donationAfterRatingMonthlyAmountIntro');
        expect(viewSource).toContain(':body-text-tone="true"');
        expect(viewSource).toContain('variant="header-donate"');
        expect(viewSource).toContain('width: fit-content');
        expect(viewSource).toContain('margin-top: 9rem');
        expect(viewSource).toContain('radio-group-name="donationAfterRatingMonthly"');
        expect(viewSource).toContain('radio-group-name="donationAfterRatingOnce"');
        expect(viewSource).toContain(
            "$t('donationAfterRatingJoinCommunityMonthly')"
        );
        expect(viewSource).toContain(
            "$t('donationAfterRatingJoinCommunityMonthlyHint')"
        );
        expect(viewSource).toContain("$t('donationAfterRatingOnceIntro')");
        expect(viewSource).toContain("$t('donationAfterRatingOnceCta')");
        expect(viewSource).toContain('donation-after-rating__btn-once');
        expect(viewSource).not.toContain("$t('MENSUAL')");
        expect(viewSource).not.toContain("$t('unicaVez')");
        expect(viewSource).not.toContain("$t('donationUsageNote')");
        expect(viewSource).not.toContain("$t('conoceMasDonar')");
        expect(viewSource).not.toContain("$t('continuarSinDonar')");
        expect(viewSource).toContain('volunteerParagraphHtml');
        expect(viewSource).toContain('instagramParagraphHtml');
        expect(viewSource).toContain(
            "$t('donationAfterRatingCannotContributeLink')"
        );
        expect(viewSource).toContain(
            "$t('donationAfterRatingCannotContributeSuffix')"
        );
        expect(viewSource).toContain('getDonationOnceUrl');
        expect(viewSource).toContain('getDonationMonthlyUrl');
        expect(viewSource).toContain('onDonateOnceTime');
        expect(viewSource).toContain('onDonateMonthly');
        expect(viewSource).toContain('onContinueWithoutDonating');
        expect(viewSource).toContain('CARPOOLEAR_COLLABORATE_URL');
        expect(viewSource).toContain('CARPOOLEAR_INSTAGRAM_URL');
    });

    it('offers a skip link that returns to the trips list', () => {
        expect(viewSource).toContain('href="/trips"');
        expect(viewSource).toContain('onContinueWithoutDonating');
        expect(viewSource).toMatch(/name:\s*'trips'/);
    });

    it.each(['arg', 'en'])(
        'defines donation after rating copy in %s locale',
        (locale) => {
            expect(messages[locale].donationAfterRatingHeroTitlePrimary).toBeTruthy();
            expect(messages[locale].donationAfterRatingMissionLead).toBeTruthy();
            expect(messages[locale].donationAfterRatingMissionOrg).toBeTruthy();
            expect(messages[locale].donationAfterRatingMissionBody).toBeTruthy();
            expect(messages[locale].donationAfterRatingJoinAccent).toBeTruthy();
            expect(
                messages[locale].donationAfterRatingMonthlyBenefitsIntro
            ).toBeTruthy();
            expect(
                messages[locale].donationAfterRatingMonthlyAmountIntro
            ).toMatch(/<strong>.*<\/strong>/);
            expect(
                messages[locale].donationAfterRatingJoinCommunityMonthly
            ).toBeTruthy();
            expect(messages[locale].donationAfterRatingOnceCta).toBeTruthy();
            expect(
                messages[locale].donationAfterRatingVolunteerParagraph
            ).toContain('{link}');
            for (const key of [
                'donationAfterRatingBenefitVisibility',
                'donationAfterRatingBenefitBadge'
            ]) {
                expect(messages[locale][key]).toBeTruthy();
            }
        }
    );
});
