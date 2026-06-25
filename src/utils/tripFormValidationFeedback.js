export const TRIP_FORM_ERROR_SELECTORS = [
    '.trip-error',
    '.has-error',
    'span.error'
];

export function collectActiveValidationMessages(errorFields) {
    const messages = [];
    const seen = new Set();

    if (!Array.isArray(errorFields)) {
        return messages;
    }

    errorFields.forEach((field) => {
        if (!field || !field.state) {
            return;
        }

        const message = String(field.message || '').trim();
        if (!message || seen.has(message)) {
            return;
        }

        seen.add(message);
        messages.push(message);
    });

    return messages;
}

export function shouldShowTripFormValidationSummary(attempted, messages) {
    return attempted === true && Array.isArray(messages) && messages.length > 0;
}

export function formatTripValidationDialogMessage(fallback, messages) {
    const unique = [...new Set(
        (messages || [])
            .map((message) => String(message).trim())
            .filter(Boolean)
    )];

    if (!unique.length) {
        return fallback;
    }

    return `${fallback}\n${unique.map((message) => `• ${message}`).join('\n')}`;
}

export function findFirstTripFormErrorElement(root = document) {
    for (let i = 0; i < TRIP_FORM_ERROR_SELECTORS.length; i += 1) {
        const selector = TRIP_FORM_ERROR_SELECTORS[i];
        const nodes = root.querySelectorAll(selector);

        if (nodes && nodes.length > 0) {
            return nodes[0];
        }
    }

    return null;
}
