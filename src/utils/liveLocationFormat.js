import dayjs from '../dayjs';

export function formatLiveLocationUpdatedAt(recordedAt) {
    if (!recordedAt) {
        return '';
    }

    return dayjs(recordedAt).format('DD/MM/YYYY HH:mm');
}

export function formatLiveLocationTripDateTime(tripDate) {
    if (!tripDate) {
        return '';
    }

    return dayjs(tripDate).format('dddd D [de] MMMM [a las] HH:mm');
}
