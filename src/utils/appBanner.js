export function shouldShowAppBanner(banner) {
    return Boolean(banner && banner.url);
}

export function resolveAppBannerAsset(banner, isMobile) {
    if (!banner) return null;
    const image = (isMobile && banner.image_mobile) || banner.image;
    const url = (isMobile && banner.url_mobile) || banner.url;
    return { image, url };
}
