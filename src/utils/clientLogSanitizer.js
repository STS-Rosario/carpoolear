const HTML_TAG_PATTERN = /<[^>]*>/g;
const SCRIPT_BLOCK_PATTERN = /<script\b[^>]*>[\s\S]*?<\/script>/gi;
const STYLE_BLOCK_PATTERN = /<style\b[^>]*>[\s\S]*?<\/style>/gi;
const CONTROL_CHAR_PATTERN = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

function removeScriptAndStyleBlocks(value) {
    return value
        .replace(SCRIPT_BLOCK_PATTERN, '')
        .replace(STYLE_BLOCK_PATTERN, '');
}

export function sanitizeClientLogString(value, maxLength = 4000) {
    if (value == null) {
        return null;
    }

    let sanitized = removeScriptAndStyleBlocks(String(value));
    sanitized = sanitized.replace(HTML_TAG_PATTERN, '');
    sanitized = sanitized.replace(CONTROL_CHAR_PATTERN, '');
    sanitized = sanitized.replace(/[\r\n]+/g, ' ').trim();

    if (!sanitized) {
        return null;
    }

    if (sanitized.length > maxLength) {
        return sanitized.slice(0, maxLength);
    }

    return sanitized;
}

export function sanitizeClientLogContext(context, maxDepth = 2) {
    if (!context || typeof context !== 'object' || Array.isArray(context)) {
        return null;
    }

    return sanitizeContextLevel(context, 0, maxDepth);
}

function sanitizeContextLevel(context, depth, maxDepth) {
    const sanitized = {};

    Object.keys(context).forEach((key) => {
        const safeKey = sanitizeClientLogString(key, 100);
        if (!safeKey) {
            return;
        }

        const value = context[key];

        if (value == null) {
            return;
        }

        if (typeof value === 'number' || typeof value === 'boolean') {
            sanitized[safeKey] = value;
            return;
        }

        if (typeof value === 'string') {
            const safeValue = sanitizeClientLogString(value, 1000);
            if (safeValue) {
                sanitized[safeKey] = safeValue;
            }
            return;
        }

        if (depth >= maxDepth) {
            return;
        }

        if (Array.isArray(value)) {
            const safeItems = value
                .map((item) =>
                    typeof item === 'string'
                        ? sanitizeClientLogString(item, 1000)
                        : null
                )
                .filter(Boolean);
            if (safeItems.length) {
                sanitized[safeKey] = safeItems;
            }
            return;
        }

        if (typeof value === 'object') {
            if (depth + 1 > maxDepth) {
                return;
            }

            const nested = sanitizeContextLevel(value, depth + 1, maxDepth);
            if (nested && Object.keys(nested).length) {
                sanitized[safeKey] = nested;
            }
        }
    });

    return sanitized;
}
