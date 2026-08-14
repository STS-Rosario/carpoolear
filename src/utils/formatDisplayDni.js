import {
    formatDocumentId,
    parseProfileIdFormat,
    resolveProfileIdFormats
} from './documentId';

function resolveFormats(profileIdFormatOrConfig) {
    if (Array.isArray(profileIdFormatOrConfig)) {
        return profileIdFormatOrConfig;
    }

    if (
        profileIdFormatOrConfig &&
        typeof profileIdFormatOrConfig === 'object' &&
        profileIdFormatOrConfig.profile_id_format
    ) {
        return resolveProfileIdFormats(profileIdFormatOrConfig);
    }

    if (typeof profileIdFormatOrConfig === 'string') {
        return parseProfileIdFormat(profileIdFormatOrConfig);
    }

    return [];
}

export function formatDisplayDni(value, profileIdFormatOrFormats) {
    if (value === null || value === undefined || String(value).trim() === '') {
        return null;
    }

    const formats = resolveFormats(profileIdFormatOrFormats);
    if (!formats.length) {
        return String(value);
    }

    const formatted = formatDocumentId(value, formats);
    return formatted === '' ? null : formatted;
}

export function displayDniOrDash(value, profileIdFormatOrFormats, dash = '—') {
    const formatted = formatDisplayDni(value, profileIdFormatOrFormats);
    return formatted === null ? dash : formatted;
}
