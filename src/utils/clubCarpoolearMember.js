export function isActiveClubCarpoolearMember(user) {
    if (!user) {
        return false;
    }

    if (user.club_carpoolear_active === 1 || user.club_carpoolear_active === true) {
        return true;
    }

    return Boolean(user.monthly_donate);
}
