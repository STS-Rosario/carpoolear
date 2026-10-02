import { isActiveClubCarpoolearMember } from './clubCarpoolearMember.js';

export const CLUB_CARPOOLEAR_WELCOME_MARK_DELAY_MS = 3000;

export function clubCarpoolearWelcomeLocation() {
    return {
        name: 'club-carpoolear-welcome',
        query: { result: 'success' }
    };
}

export function shouldRedirectToClubCarpoolearWelcome({ user, routeName } = {}) {
    if (routeName === 'club-carpoolear-welcome') {
        return false;
    }

    if (!isActiveClubCarpoolearMember(user)) {
        return false;
    }

    return !user.club_carpoolear_welcome_shown;
}
