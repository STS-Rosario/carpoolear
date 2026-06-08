export function isAccountVerificationBanner(banner) {
    const image = banner && banner.image;
    return typeof image === 'string' && image.toLowerCase().includes('verif');
}

export function shouldShowAppBanner(banner, user) {
    if (!banner || !banner.url) {
        return false;
    }
    if (!isAccountVerificationBanner(banner)) {
        return true;
    }
    if (!user) {
        return true;
    }
    return !user.identity_validated;
}
