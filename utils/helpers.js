export function cssvar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name);
}
