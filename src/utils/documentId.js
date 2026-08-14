import { formatId } from '../services/utility';

function cleanDocumentIdValue(value) {
    return String(value || '')
        .replace(/[^a-zA-Z0-9]/g, '')
        .toUpperCase();
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
        return [formats];
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

export function resolveProfileIdFormats(config = {}) {
    if (Array.isArray(config.profile_id_formats) && config.profile_id_formats.length) {
        return config.profile_id_formats;
    }

    if (config.profile_id_format) {
        return [{ type: 'default', pattern: config.profile_id_format }];
    }

    return [];
}

export function formatDocumentId(value, formats, options = {}) {
    const { allowPartial = false } = options;
    const cleaned = cleanDocumentIdValue(value);
    if (!cleaned) {
        return '';
    }

    const patterns = resolvePatterns(formats);
    const best = findBestPatternMatch(cleaned, patterns, true);
    if (best) {
        return best.match.formatted;
    }

    if (!allowPartial) {
        return '';
    }

    const partialBest = findBestPatternMatch(cleaned, patterns, false);
    return partialBest ? partialBest.match.formatted : '';
}

export function cleanDocumentIdForStorage(value, formats) {
    const cleaned = cleanDocumentIdValue(value);
    if (!cleaned) {
        return '';
    }

    const patterns = resolvePatterns(formats);
    const best = findBestPatternMatch(cleaned, patterns, true);
    if (!best) {
        return '';
    }

    return cleaned;
}

export function isValidDocumentId(value, formats) {
    const cleaned = cleanDocumentIdValue(value);
    if (!cleaned) {
        return false;
    }

    const patterns = resolvePatterns(formats);
    return Boolean(findBestPatternMatch(cleaned, patterns, true));
}

export function getMaxDocumentIdInputLength(formats) {
    const patterns = resolvePatterns(formats);
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

export function formatDocumentIdFromConfig(value, config) {
    return formatDocumentId(value, resolveProfileIdFormats(config));
}

export function cleanDocumentIdForStorageFromConfig(value, config) {
    return cleanDocumentIdForStorage(value, resolveProfileIdFormats(config));
}

export function isValidDocumentIdForConfig(value, config) {
    return isValidDocumentId(value, resolveProfileIdFormats(config));
}

export function getMaxDocumentIdInputLengthFromConfig(config) {
    return getMaxDocumentIdInputLength(resolveProfileIdFormats(config));
}

export function formatDocumentIdInput(value, formats) {
    return formatDocumentId(value, formats, { allowPartial: true });
}
