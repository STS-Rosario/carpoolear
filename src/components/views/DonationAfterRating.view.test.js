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
        expect(viewSource).toContain(
            'keypath="donationAfterRatingVolunteerParagraph"'
        );
        expect(viewSource).toContain(
            'keypath="donationAfterRatingInstagramParagraph"'
        );
        expect(viewSource).toContain("$t('donationAfterRatingWordOfMouthIntro')");
        expect(viewSource).toContain(
            "$t('donationAfterRatingWordOfMouthFaceToFace')"
        );
        expect(viewSource).toContain("$t('donationAfterRatingSignOffGreeting')");
        expect(viewSource).toContain("$t('donationAfterRatingSignOffTeamName')");
        expect(viewSource).toContain("$t('donationAfterRatingCannotContributeLink')");
        expect(viewSource).toContain("$t('donationAfterRatingCannotContributeSuffix')");
        expect(viewSource).toContain('startDonationCheckout');
        expect(viewSource).toContain("type: 'once'");
        expect(viewSource).toContain("type: 'monthly'");
        expect(viewSource).toContain('onDonateOnceTime');
        expect(viewSource).toContain('onDonateMonthly');
        expect(viewSource).toContain('onContinueWithoutDonating');
        expect(viewSource).toContain('CARPOOLEAR_COLLABORATE_URL');
        expect(viewSource).toContain('CARPOOLEAR_INSTAGRAM_PROFILE_URL');
        expect(viewSource).toContain('CARPOOLEAR_FACEBOOK_PROFILE_URL');
    });

    it('bolds through markup only and lets links inherit the <strong> weight', () => {
        const linkRule = viewSource.match(
            /\.donation-after-rating__alt-copy :deep\(a\)\s*\{[^}]*\}/
        );
        expect(linkRule).not.toBeNull();
        expect(linkRule[0]).not.toMatch(/font-weight/);
        expect(viewSource).not.toContain(':deep(strong)');
        expect(viewSource).not.toContain('v-html="$t(benefitKey)"');
        expect(viewSource).toContain('keypath="donationAfterRatingSignOffTeam"');
    });

    it('styles the skip button like the one-time button, outlined in dark grey and centered', () => {
        const skipRule = viewSource.match(
            /\.donation-after-rating__btn-skip\.app-button--secondary\s*\{[^}]*\}/
        );
        expect(skipRule).not.toBeNull();
        expect(skipRule[0]).toMatch(/background:\s*transparent/);
        expect(skipRule[0]).toMatch(/border:\s*2px solid var\(--ds-text-secondary/);
        const layoutRule = viewSource.match(/\.donation-after-rating__btn-skip\s*\{[^}]*\}/);
        expect(layoutRule).not.toBeNull();
        expect(layoutRule[0]).toMatch(/align-self:\s*center/);
        expect(layoutRule[0]).toMatch(/width:\s*fit-content/);
    });

    it('returns to the trips list after starting a checkout', () => {
        expect(viewSource).toMatch(/name:\s*'trips'/);
    });

    it.each(['arg', 'en'])(
        'defines donation after rating copy in %s locale',
        (locale) => {
            expect(messages[locale].donationAfterRatingHeroTitlePrimary).toBeTruthy();
            expect(messages[locale].donationAfterRatingMissionLead).toBeTruthy();
            expect(messages[locale].donationAfterRatingMissionOrg).toBeUndefined();
            expect(messages[locale].donationAfterRatingMissionBody).toBeTruthy();
            expect(messages[locale].donationAfterRatingJoinAccent).toBeTruthy();
            expect(
                messages[locale].donationAfterRatingMonthlyBenefitsIntro
            ).toBeTruthy();
            expect(
                messages[locale].donationAfterRatingMonthlyAmountIntro
            ).toBeTruthy();
            expect(
                messages[locale].donationAfterRatingJoinCommunityMonthly
            ).toBeTruthy();
            expect(messages[locale].donationAfterRatingOnceCta).toBeTruthy();
            expect(
                messages[locale].donationAfterRatingVolunteerParagraph
            ).toContain('{link}');
            expect(messages[locale].donationAfterRatingBenefitBadgeTitle).toBeTruthy();
            expect(
                messages[locale].donationAfterRatingBenefitVisibility
            ).toBeUndefined();
        }
    );
});
