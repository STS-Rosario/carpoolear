export function googleInfoClean(value) {
    if (value && value.replace) {
        return value.replace('Province', '');
    }
    return value;
}
