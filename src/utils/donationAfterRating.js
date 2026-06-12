export function shouldPromptDonationAfterRating({ user, tripId, tripsRated }) {
    if (!user || user.monthly_donate) {
        return false;
    }

    const tripRatedLimit = parseFloat(tripsRated);

    if (!user.donations) {
        return true;
    }

    const donationForTrip = user.donations.find((donation) => donation.trip_id === tripId);
    if (donationForTrip) {
        return false;
    }

    const tripDonations = user.donations.filter((donation) => donation.trip_id !== null);
    return tripDonations.length < tripRatedLimit;
}
