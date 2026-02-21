import { getRoute } from '../services/utility';
import moment from 'moment-timezone';

export function profileImage(value) {
    return getRoute(value, '/image/profile/');
}

export function conversationImage(value) {
    return getRoute(value);
}

export function googleInfoClean(value) {
    if (value && value.replace) {
        return value.replace('Province', '');
    } else {
        return value;
    }
}

export function formatDate(date, format) {
    if (!date) return '';
    return moment(date).format(format);
}

export function useFormatters() {
    return {
        profileImage,
        conversationImage,
        googleInfoClean,
        formatDate
    };
}
