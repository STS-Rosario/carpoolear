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
    return Boolean(user) && !user.identity_validated;
}

export function resolveAppBannerAsset(banner, isMobile) {
    if (!banner) return null;
    const image = (isMobile && banner.image_mobile) || banner.image;
    const url = (isMobile && banner.url_mobile) || banner.url;
    return { image, url };
}
