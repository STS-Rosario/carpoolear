/**
 * If identity validation is required for the current user and they are not validated,
 * redirects to the identity validation page and returns true.
 * Call before restricted actions (send message, request seat, accept/reject passenger, create trip).
 * @param {object} store - Vuex store (e.g. this.$store)
 * @param {object} router - Vue Router instance (e.g. this.$router)
 * @returns {boolean} true if redirect was performed (caller should abort); false otherwise
 */
export function redirectToIdentityValidationIfRequired (store, router) {
    const config = store.getters['auth/appConfig'];
    const user = store.getters['auth/user'];
    if (!config || !user) return false;
    if (!config.identity_validation_required_new_users) return false;
    if (!user.identity_validation_required_for_user) return false;
    if (user.identity_validated) return false;
    router.push({ name: 'identity_validation' });
    return true;
}

export function cssvar (name) {
    /* eslint-disable no-undef */
    return getComputedStyle(document.documentElement).getPropertyValue(name);
}

export function checkError (error, message) {
    if (error.status === 422) {
        if (error.data && error.data.errors && error.data.errors.error && error.data.errors.error.length) {
            for (let i = 0; i < error.data.errors.error.length; i++) {
                let errorMessage = error.data.errors.error[i];
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
    let elementPosition = element.offsetTop - offset;

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
