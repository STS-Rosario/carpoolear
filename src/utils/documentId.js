export const DOCUMENT_TYPE_DNI = 'dni';
export const DOCUMENT_TYPE_PASSPORT = 'passport';
export const PASSPORT_MIN_LENGTH = 5;
export const PASSPORT_MAX_LENGTH = 9;

function cleanDocumentIdValue(value) {
    return String(value || '')
        .replace(/[^a-zA-Z0-9]/g, '')
        .toUpperCase();
}

function isDniPattern(pattern) {
    return typeof pattern === 'string' && pattern.includes('#') && !pattern.includes('A');
}

function isValidPassportValue(cleaned) {
    return (
        cleaned.length >= PASSPORT_MIN_LENGTH &&
        cleaned.length <= PASSPORT_MAX_LENGTH
    );
}

function dniPatternsFrom(formats) {
    return resolvePatterns(formats).filter(isDniPattern);
}

function patternsForType(formats, type) {
    if (type === DOCUMENT_TYPE_DNI) {
        return dniPatternsFrom(formats);
    }

    return resolvePatterns(formats);
}

function matchDocumentIdPattern(cleaned, pattern) {
    let formatted = '';
    let cleanedIndex = 0;

    for (let i = 0; i < pattern.length; i++) {
        if (cleanedIndex >= cleaned.length) {
            break;
        }

        if (pattern[i] === '#') {
            if (!/[0-9]/.test(cleaned[cleanedIndex])) {
                return { formatted, consumed: cleanedIndex, complete: false };
            }
            formatted += cleaned[cleanedIndex];
            cleanedIndex++;
        } else if (pattern[i] === 'A') {
            if (!/[A-Z]/.test(cleaned[cleanedIndex])) {
                return { formatted, consumed: cleanedIndex, complete: false };
            }
            formatted += cleaned[cleanedIndex];
            cleanedIndex++;
        } else {
            formatted += pattern[i];
        }
    }

    return {
        formatted,
        consumed: cleanedIndex,
        complete: cleanedIndex === cleaned.length
    };
}

function resolvePatterns(formats) {
    if (Array.isArray(formats)) {
        return formats.map((entry) =>
            typeof entry === 'string' ? entry : entry.pattern
        );
    }

    if (typeof formats === 'string' && formats.length > 0) {
        return parseProfileIdFormat(formats);
    }

    return [];
}

function findBestPatternMatch(cleaned, patterns, requireComplete = false) {
    let best = null;

    patterns.forEach((pattern) => {
        const match = matchDocumentIdPattern(cleaned, pattern);
        if (requireComplete && !match.complete) {
            return;
        }

        if (!best || match.consumed > best.match.consumed) {
            best = { pattern, match };
        }
    });

    return best;
}

export function parseProfileIdFormat(value) {
    if (!value || typeof value !== 'string') {
        return [];
    }

    return value
        .split(',')
        .map((pattern) => pattern.trim())
        .filter(Boolean);
}

export function resolveProfileIdFormats(config = {}) {
    if (config.profile_id_format) {
        return parseProfileIdFormat(config.profile_id_format);
    }

    return [];
}

export function resolveDniFormats(config = {}) {
    return resolveProfileIdFormats(config).filter(isDniPattern);
}

export function inferDocumentType(value, formats) {
    const cleaned = cleanDocumentIdValue(value);
    if (!cleaned) {
        return DOCUMENT_TYPE_DNI;
    }

    if (
        isValidDocumentId(value, formats, {
            type: DOCUMENT_TYPE_DNI
        })
    ) {
        return DOCUMENT_TYPE_DNI;
    }

    return DOCUMENT_TYPE_PASSPORT;
}

export function formatDocumentId(value, formats, options = {}) {
    const { allowPartial = false, type } = options;
    const cleaned = cleanDocumentIdValue(value);
    if (!cleaned) {
        return '';
    }

    if (type === DOCUMENT_TYPE_PASSPORT) {
        return cleaned.slice(0, PASSPORT_MAX_LENGTH);
    }

    const patterns = patternsForType(formats, type);
    const best = findBestPatternMatch(cleaned, patterns, true);
    if (best) {
        return best.match.formatted;
    }

    if (type !== DOCUMENT_TYPE_DNI && isValidPassportValue(cleaned)) {
        return cleaned;
    }

    if (!allowPartial) {
        return '';
    }

    if (type !== DOCUMENT_TYPE_DNI) {
        return cleaned.slice(0, PASSPORT_MAX_LENGTH);
    }

    const partialBest = findBestPatternMatch(cleaned, patterns, false);
    return partialBest ? partialBest.match.formatted : '';
}

export function cleanDocumentIdForStorage(value, formats, options = {}) {
    const cleaned = cleanDocumentIdValue(value);
    if (!cleaned || !isValidDocumentId(value, formats, options)) {
        return '';
    }

    return cleaned;
}

export function isValidDocumentId(value, formats, options = {}) {
    const cleaned = cleanDocumentIdValue(value);
    if (!cleaned) {
        return false;
    }

    const { type } = options;
    if (type === DOCUMENT_TYPE_PASSPORT) {
        return isValidPassportValue(cleaned);
    }

    const patterns = patternsForType(formats, type);
    if (findBestPatternMatch(cleaned, patterns, true)) {
        return true;
    }

    if (type === DOCUMENT_TYPE_DNI) {
        return false;
    }

    return isValidPassportValue(cleaned);
}

export function getMaxDocumentIdInputLength(formats, options = {}) {
    if (options.type === DOCUMENT_TYPE_PASSPORT) {
        return PASSPORT_MAX_LENGTH;
    }

    const patterns = patternsForType(formats, options.type);
    if (!patterns.length) {
        return 0;
    }

    return patterns.reduce(
        (maxLength, pattern) => Math.max(maxLength, pattern.length),
        0
    );
}

export function getProfileIdFormatsFromConfig(config) {
    return resolveProfileIdFormats(config);
}

export function formatDocumentIdFromConfig(value, config, options = {}) {
    return formatDocumentId(value, resolveProfileIdFormats(config), options);
}

export function cleanDocumentIdForStorageFromConfig(value, config, options = {}) {
    return cleanDocumentIdForStorage(
        value,
        resolveProfileIdFormats(config),
        options
    );
}

export function isValidDocumentIdForConfig(value, config, options = {}) {
    return isValidDocumentId(value, resolveProfileIdFormats(config), options);
}

export function getMaxDocumentIdInputLengthFromConfig(config, options = {}) {
    return getMaxDocumentIdInputLength(resolveProfileIdFormats(config), options);
}

export function getDocumentIdPlaceholderFromConfig(config) {
    return resolveProfileIdFormats(config).join(' / ');
}

export function formatDocumentIdInput(value, formats, options = {}) {
    return formatDocumentId(value, formats, {
        ...options,
        allowPartial: true
    });
}

export { cleanDocumentIdValue };
