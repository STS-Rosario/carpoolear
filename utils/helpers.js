export function cssvar (name) {
    /* eslint-disable no-undef */
    return getComputedStyle(document.documentElement).getPropertyValue(name);
}
