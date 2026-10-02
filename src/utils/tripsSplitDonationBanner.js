import { isActiveClubCarpoolearMember } from './clubCarpoolearMember.js';

export function shouldShowSplitDonationPanel({
    isDonationTime,
    user,
    hideOnIos,
    friendTripsCount,
    otherTripsCount,
    tripsOffset,
    tripsCount
}) {
    if (
        !isDonationTime ||
        !user ||
        isActiveClubCarpoolearMember(user) ||
        hideOnIos
    ) {
        return false;
    }
    if (!friendTripsCount && !otherTripsCount) {
        return false;
    }
    const offset = parseFloat(tripsOffset);
    const count = parseFloat(tripsCount);
    return offset % count === 0;
}
