import { formatId } from '../services/utility';

export function formatDisplayDni(value, profileIdFormat) {
    if (value === null || value === undefined || String(value).trim() === '') {
        return null;
    }

    if (!profileIdFormat) {
        return String(value);
    }

    return formatId(value, profileIdFormat);
}

export function displayDniOrDash(value, profileIdFormat, dash = '—') {
    const formatted = formatDisplayDni(value, profileIdFormat);
    return formatted === null ? dash : formatted;
}
