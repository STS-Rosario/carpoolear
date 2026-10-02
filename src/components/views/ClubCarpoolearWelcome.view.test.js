import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewSource = fs.readFileSync(
    path.resolve(__dirname, 'ClubCarpoolearWelcome.vue'),
    'utf8'
);

describe('ClubCarpoolearWelcome', () => {
    it('reuses donation hero with welcome titles and hides mission copy', () => {
        expect(viewSource).toContain('clubCarpoolearWelcomeHeroTitlePrimary');
        expect(viewSource).toContain('clubCarpoolearWelcomeHeroTitleAccent');
        expect(viewSource).toContain(':show-mission="false"');
    });

    it('shows benefits and sign-off copy after the hero', () => {
        expect(viewSource).toContain('donationAfterRatingMonthlyBenefitsIntro');
        expect(viewSource).toContain('DONATION_AFTER_RATING_BENEFIT_KEYS');
        expect(viewSource).toContain('donationAfterRatingSignOffGreeting');
        expect(viewSource).toContain('donationAfterRatingSignOffTeam');
    });

    it('does not include donation checkout or join CTA blocks', () => {
        expect(viewSource).not.toContain('DonationAmountPicker');
        expect(viewSource).not.toContain('donationAfterRatingJoinPrefix');
        expect(viewSource).not.toContain('donationAfterRatingMissionLead');
    });

    it('marks welcome as shown after a 3 second delay', () => {
        expect(viewSource).toContain('CLUB_CARPOOLEAR_WELCOME_MARK_DELAY_MS');
        expect(viewSource).toContain('markWelcomeShown');
        expect(viewSource).toContain('setTimeout');
        expect(viewSource).toContain('clearTimeout');
    });
});
