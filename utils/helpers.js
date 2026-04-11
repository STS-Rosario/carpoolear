/**
 * If identity validation is required for the current user and they are not validated,
 * redirects to the identity validation page and returns true.
 * Call before restricted actions (send message, request seat, accept/reject passenger, create trip).
 * @param {object} router - Vue Router instance (e.g. this.$router)
 * @returns {boolean} true if redirect was performed (caller should abort); false otherwise
 */
export function redirectToIdentityValidationIfRequired (router) {
    try {
        const { useAuthStore } = require('../src/stores/auth');
        const authStore = useAuthStore();
        const config = authStore.appConfig;
        const user = authStore.user;
        
        if (!config || !user) {
            return false;
        }
        
        if (!config.identity_validation_required_new_users) {
            return false;
        }
        
        // Check new users (identity_validation_required_for_user flag)
        if (user.identity_validation_required_for_user && !user.identity_validated) {
            router.push({ name: 'identity_validation' });
            return true;
        }
        
        // Check current users with deadline (validate_by_date)
        if (user.validate_by_date && !user.identity_validated) {
            const [y, m, d] = user.validate_by_date.split('-').map(Number);
            const deadlineEndOfDay = new Date(y, m - 1, d, 23, 59, 59, 999).getTime();
            if (Date.now() >= deadlineEndOfDay) {
                router.push({ name: 'identity_validation' });
                return true;
            }
        }
        
        return false;
    } catch (e) {
        console.log('[identity check] ERROR:', e.message);
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