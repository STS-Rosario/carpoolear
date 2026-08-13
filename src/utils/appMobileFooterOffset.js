export const APP_MOBILE_FOOTER_OFFSET_CSS_VAR = '--app-mobile-footer-offset';

/** padding-top + icon + label + gap + indicator slot (matches .mobile-footer-bar). */
export const MOBILE_FOOTER_BAR_CONTENT_HEIGHT_PX = 68;

export const APP_MOBILE_FOOTER_OFFSET_VALUE = `calc(${MOBILE_FOOTER_BAR_CONTENT_HEIGHT_PX}px + env(safe-area-inset-bottom, 0px))`;
