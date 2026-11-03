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

export function checkError (error, message) {
    if (error.status === 422) {
        if (error.data && error.data.errors && error.data.errors.error && error.data.errors.error.length) {
            for (let i = 0; i < error.data.errors.error.length; i++) {
                const errorMessage = error.data.errors.error[i];
                if (errorMessage === message) {
                    return true;
                }
            }
        }
    }
    return false;
}

export function getErrors (error) {
    if (error.status === 422) {
        if (error.data && error.data.errors && error.data.errors.error && error.data.errors.error.length) {
            return error.data.errors.error;
        }
    }
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
