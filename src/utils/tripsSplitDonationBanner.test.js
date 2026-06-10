import { describe, expect, it } from 'vitest';
import { shouldShowSplitDonationPanel } from './tripsSplitDonationBanner.js';

describe('shouldShowSplitDonationPanel', () => {
    it('shows once at the top when the first combined trip slot would have shown it', () => {
        expect(
            shouldShowSplitDonationPanel({
                isDonationTime: true,
                user: { id: 1, monthly_donate: false },
                hideOnIos: false,
                friendTripsCount: 1,
                otherTripsCount: 3,
                tripsOffset: 0,
                tripsCount: 4
            })
        ).toBe(true);
    });

    it('does not show when the user already donates monthly', () => {
        expect(
            shouldShowSplitDonationPanel({
                isDonationTime: true,
                user: { id: 1, monthly_donate: true },
                hideOnIos: false,
                friendTripsCount: 1,
                otherTripsCount: 1,
                tripsOffset: 0,
                tripsCount: 4
            })
        ).toBe(false);
    });

    it('does not show when there are no trips in either section', () => {
        expect(
            shouldShowSplitDonationPanel({
                isDonationTime: true,
                user: { id: 1, monthly_donate: false },
                hideOnIos: false,
                friendTripsCount: 0,
                otherTripsCount: 0,
                tripsOffset: 0,
                tripsCount: 4
            })
        ).toBe(false);
    });
});
