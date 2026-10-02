import { describe, expect, it } from 'vitest';
import { shouldRedirectToClubCarpoolearWelcome } from './clubCarpoolearWelcomeRedirect.js';

describe('shouldRedirectToClubCarpoolearWelcome', () => {
    it('returns false when there is no user', () => {
        expect(
            shouldRedirectToClubCarpoolearWelcome({
                user: null,
                routeName: 'trips'
            })
        ).toBe(false);
    });

    it('returns false when the user is not an active Club member', () => {
        expect(
            shouldRedirectToClubCarpoolearWelcome({
                user: {
                    club_carpoolear_active: 0,
                    club_carpoolear_welcome_shown: 0
                },
                routeName: 'trips'
            })
        ).toBe(false);
    });

    it('returns false when the welcome screen was already shown', () => {
        expect(
            shouldRedirectToClubCarpoolearWelcome({
                user: {
                    club_carpoolear_active: 1,
                    club_carpoolear_welcome_shown: 1
                },
                routeName: 'trips'
            })
        ).toBe(false);
    });

    it('returns false when already on the welcome route', () => {
        expect(
            shouldRedirectToClubCarpoolearWelcome({
                user: {
                    club_carpoolear_active: 1,
                    club_carpoolear_welcome_shown: 0
                },
                routeName: 'club-carpoolear-welcome'
            })
        ).toBe(false);
    });

    it('returns true for active members who have not seen the welcome screen', () => {
        expect(
            shouldRedirectToClubCarpoolearWelcome({
                user: {
                    club_carpoolear_active: 1,
                    club_carpoolear_welcome_shown: 0
                },
                routeName: 'trips'
            })
        ).toBe(true);
    });
});
