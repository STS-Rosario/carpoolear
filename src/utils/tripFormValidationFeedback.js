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

export function isTripFormErrorElementVisible(element) {
    if (!element || typeof element.getClientRects !== 'function') {
        return false;
    }

    const rects = element.getClientRects();
    if (!rects || rects.length === 0) {
        return false;
    }

    if (typeof window !== 'undefined' && typeof window.getComputedStyle === 'function') {
        const style = window.getComputedStyle(element);
        if (style.visibility === 'hidden' || style.display === 'none') {
            return false;
        }
    }

    return true;
}

export function findFirstTripFormErrorElement(root = document) {
    for (let i = 0; i < TRIP_FORM_ERROR_SELECTORS.length; i += 1) {
        const selector = TRIP_FORM_ERROR_SELECTORS[i];
        const nodes = root.querySelectorAll(selector);

        if (!nodes || nodes.length === 0) {
            continue;
        }

        for (let j = 0; j < nodes.length; j += 1) {
            if (isTripFormErrorElementVisible(nodes[j])) {
                return nodes[j];
            }
        }
    }

    return null;
}

export function scrollTripFormErrorElementIntoView(
    element,
    { behavior = 'smooth', block = 'center' } = {}
) {
    if (!element || typeof element.scrollIntoView !== 'function') {
        return;
    }

    element.scrollIntoView({ behavior, block });
}

export function scrollToFirstTripFormError(root, options = {}) {
    const element = findFirstTripFormErrorElement(root);
    if (!element) {
        return false;
    }

    const scroll = options.scroll || scrollTripFormErrorElementIntoView;
    scroll(element, options);
    return true;
}
