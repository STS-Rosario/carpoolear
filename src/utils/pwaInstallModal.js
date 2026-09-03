export function shouldShowPwaInstallModal({
    isNativePlatform = false,
    isIos = false,
    hasInstallEvent = false
} = {}) {
    if (isNativePlatform) {
        return false;
    }
    return Boolean(hasInstallEvent) || Boolean(isIos);
}
