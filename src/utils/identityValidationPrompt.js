/**
 * Shared rules for the identity-validation countdown (banner) and prompt modal.
 */
export function isIdentityValidationUiEnabled(appConfig) {
    if (!appConfig || appConfig.identity_validation_enabled !== true) {
        return false;
    }
    return (
        appConfig.identity_validation_mercado_pago_enabled === true ||
        appConfig.identity_validation_manual_enabled === true
    );
}

/**
 * Countdown strip: show when there is a deadline and feature is on.
 */
export function isIdentityValidationCountdownScenario(user, appConfig) {
    if (!user) return false;
    if (!isIdentityValidationUiEnabled(appConfig)) return false;
    const daysEnabled =
        appConfig &&
        Number(appConfig.identity_validation_days_for_current_users) > 0;
    if (!daysEnabled) return false;
    if (user.identity_validated) return false;
    if (!user.validate_by_date) return false;
    return true;
}

/**
 * Whether to show the full-screen prompt modal (if not permanently dismissed in localStorage).
 * Optional: show even without a validate_by date (soft campaign).
 * Mandatory: show for new users flagged by API or for current users in countdown window.
 */
export function isIdentityValidationPromptScenario(user, appConfig) {
    if (!user) return false;
    if (!isIdentityValidationUiEnabled(appConfig)) return false;
    if (user.identity_validated) return false;
    if (appConfig.identity_validation_optional === true) {
        return true;
    }
    if (
        user.identity_validation_required_for_user &&
        !user.identity_validated
    ) {
        return true;
    }
    return isIdentityValidationCountdownScenario(user, appConfig);
}

const STORAGE_PREFIX = 'carpoolear_identity_validation_prompt_dismissed';

export function identityPromptDismissStorageKey(userId) {
    return `${STORAGE_PREFIX}_${userId}`;
}

/** User chose "Más tarde" / closed the prompt — do not show again for this account on this device. */
export function isIdentityPromptDismissed(userId) {
    if (userId == null || typeof localStorage === 'undefined') return false;
    return localStorage.getItem(identityPromptDismissStorageKey(userId)) === '1';
}

export function dismissIdentityPromptPermanently(userId) {
    if (userId == null || typeof localStorage === 'undefined') return;
    localStorage.setItem(identityPromptDismissStorageKey(userId), '1');
}
