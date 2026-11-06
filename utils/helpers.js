/**
 * If identity validation is required for the current user and they are not validated,
 * redirects to the identity validation page and returns true.
 * Incomplete profile redirects to edit profile first (same as trip create / messages).
 * Call before restricted actions (send message, request seat, accept/reject passenger, create trip).
 * @param {object} router - Vue Router instance (e.g. this.$router)
 * @returns {boolean} true if redirect was performed (caller should abort); false otherwise
 */
export function redirectToIdentityValidationIfRequired (router) {
    try {
        const { useAuthStore } = require('../src/stores/auth');
        const { redirectIfIdentityValidationRequired } = require('../src/utils/identityValidationNavigation');
        const authStore = useAuthStore();
        return redirectIfIdentityValidationRequired(router, {
            user: authStore.user,
            config: authStore.appConfig
        });
    } catch (e) {
        console.log('[identity check] ERROR:', e.message);
        return false;
    }
}

/**
 * If the user has pending ratings, redirects to my-trips and returns true.
 * Call before restricted actions (same places as identity validation redirect).
 * @param {object} router - Vue Router instance (e.g. this.$router)
 * @returns {boolean} true if redirect was performed (caller should abort); false otherwise
 */
export function redirectToMyTripsIfPendingRatingsRequired (router) {
    try {
        const { useRatesStore } = require('../src/stores/rates');
        const { performPendingRatingsRedirectIfRequired } = require('../src/utils/pendingRatingsEnforcement');
        return performPendingRatingsRedirectIfRequired(
            useRatesStore().pendingRates,
            router
        );
    } catch (e) {
        console.log('[pending ratings check] ERROR:', e.message);
        return false;
    }
}

export function cssvar (name) {
    /* eslint-disable no-undef */
    return getComputedStyle(document.documentElement).getPropertyValue(name);
}

/**
 * Laravel validation payloads often use `errors.error` as either a string or string[].
 * Older code assumed an array only; iterating a string matched character-by-character and broke detection.
 */
function normalizeValidationErrorCodes (error) {
    if (error.status !== 422 || !error.data || !error.data.errors) {
        return [];
    }
    const raw = error.data.errors.error;
    if (raw == null) {
        return [];
    }
    if (Array.isArray(raw)) {
        return raw;
    }
    if (typeof raw === 'string') {
        return raw.length ? [raw] : [];
    }
    return [];
}

export function checkError (error, message) {
    if (!error || error.status !== 422) {
        return false;
    }
    const codes = normalizeValidationErrorCodes(error);
    for (let i = 0; i < codes.length; i++) {
        if (codes[i] === message) {
            return true;
        }
    }
    return false;
}

export function getErrors (error) {
    if (!error || error.status !== 422) {
        return undefined;
    }
    const codes = normalizeValidationErrorCodes(error);
    return codes.length ? codes : undefined;
}

export function scrollToElement (element, offset) {
    if (typeof element === 'string') {
        element = document.getElementById('targetElement');
    }
    if (!offset) {
        offset = 30;
    }
    const elementPosition = element.offsetTop - offset;

    const onScroll = () => {
        if (Math.round(window.pageYOffset) === elementPosition) {
            window.removeEventListener('scroll', onScroll);
            if (element.focus) {
                element.focus();
            }
        }
    };

    window.addEventListener('scroll', onScroll);
    onScroll();
    window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
    });
}
