/**
 * Shared rules for the identity-validation countdown (banner + prompt modal).
 * Matches IdentityValidationCountdownBanner visibility.
 */
export function isIdentityValidationCountdownScenario(user, appConfig) {
    if (!user) return false;
    const daysEnabled =
        appConfig &&
        Number(appConfig.identity_validation_days_for_current_users) > 0;
    if (!daysEnabled) return false;
    if (user.identity_validated) return false;
    if (!user.validate_by_date) return false;
    return true;
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
