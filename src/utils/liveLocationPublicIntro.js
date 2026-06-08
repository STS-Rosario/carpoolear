import { formatLiveLocationTripDateTime } from './liveLocationFormat.js';

export function isPassengerPublicLiveShare(publicView) {
    return Boolean(
        publicView &&
            publicView.is_passenger_share &&
            publicView.sharer &&
            publicView.driver
    );
}

export function getPassengerPublicLiveLocationIntroParams(publicView) {
    if (!isPassengerPublicLiveShare(publicView)) {
        return null;
    }

    return {
        sharerName: publicView.sharer.name,
        driverName: publicView.driver.name,
        destination: publicView.destination || '',
        tripDateTime: formatLiveLocationTripDateTime(publicView.trip_date)
    };
}
