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
