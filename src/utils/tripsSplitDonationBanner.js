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
        user.monthly_donate ||
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
