import { isActiveClubCarpoolearMember } from './clubCarpoolearMember.js';

export function shouldRedirectToClubCarpoolearWelcome({ user, routeName } = {}) {
    if (routeName === 'club-carpoolear-welcome') {
        return false;
    }

    if (!isActiveClubCarpoolearMember(user)) {
        return false;
    }

    return !user.club_carpoolear_welcome_shown;
}
