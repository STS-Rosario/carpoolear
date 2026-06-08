import dayjs from '../dayjs';

export function formatLiveLocationUpdatedAt(recordedAt) {
    if (!recordedAt) {
        return '';
    }

    return dayjs(recordedAt).format('DD/MM/YYYY HH:mm');
}
