import { describe, expect, it } from 'vitest';
import {
    BANNED_USER_HOME_ROUTE,
    bannedUserRedirectLocation,
    isBannedUserAllowedRoute,
    isUserBanned
} from './bannedUserAccess.js';

describe('isUserBanned', () => {
    it('treats numeric and boolean banned flags as banned', () => {
        expect(isUserBanned({ banned: 1 })).toBe(true);
        expect(isUserBanned({ banned: true })).toBe(true);
    });

    it('treats missing or zero banned flags as not banned', () => {
        expect(isUserBanned(null)).toBe(false);
        expect(isUserBanned({})).toBe(false);
        expect(isUserBanned({ banned: 0 })).toBe(false);
        expect(isUserBanned({ banned: false })).toBe(false);
    });
});

describe('bannedUserRedirectLocation', () => {
    it('sends banned users to mesa de ayuda from other routes', () => {
        expect(bannedUserRedirectLocation({ banned: 1 }, 'trips')).toEqual(
            BANNED_USER_HOME_ROUTE
        );
        expect(bannedUserRedirectLocation({ banned: 1 }, 'ticket-new')).toEqual(
            BANNED_USER_HOME_ROUTE
        );
    });

    it('lets banned users stay on ticket list and ticket detail', () => {
        expect(bannedUserRedirectLocation({ banned: 1 }, 'tickets')).toBeNull();
        expect(bannedUserRedirectLocation({ banned: 1 }, 'ticket-detail')).toBeNull();
        expect(isBannedUserAllowedRoute('tickets')).toBe(true);
        expect(isBannedUserAllowedRoute('ticket-detail')).toBe(true);
        expect(isBannedUserAllowedRoute('ticket-new')).toBe(false);
    });

    it('does not redirect users who are not banned', () => {
        expect(bannedUserRedirectLocation({ banned: 0 }, 'trips')).toBeNull();
        expect(bannedUserRedirectLocation(null, 'trips')).toBeNull();
    });
});
