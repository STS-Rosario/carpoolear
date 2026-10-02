import { describe, expect, it } from 'vitest';
import { isActiveClubCarpoolearMember } from './clubCarpoolearMember.js';

describe('isActiveClubCarpoolearMember', () => {
    it('returns false when user is missing', () => {
        expect(isActiveClubCarpoolearMember(null)).toBe(false);
    });

    it('returns true when club_carpoolear_active is set', () => {
        expect(isActiveClubCarpoolearMember({ club_carpoolear_active: 1 })).toBe(true);
    });

    it('returns true when monthly_donate is set for legacy payloads', () => {
        expect(isActiveClubCarpoolearMember({ monthly_donate: true })).toBe(true);
    });

    it('returns false when neither flag is active', () => {
        expect(
            isActiveClubCarpoolearMember({
                club_carpoolear_active: 0,
                monthly_donate: false
            })
        ).toBe(false);
    });
});
