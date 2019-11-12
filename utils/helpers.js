export function cssvar (name) {
    /* eslint-disable no-undef */
    return getComputedStyle(document.documentElement).getPropertyValue(name);
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
