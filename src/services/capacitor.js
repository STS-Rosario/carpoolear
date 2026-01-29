import { Capacitor } from '@capacitor/core';

/**
 * User ID for which donation prompts are hidden on iOS Capacitor (e.g. test/internal accounts).
 */
export const DONATION_HIDDEN_USER_ID_IOS_CAPACITOR = 147963;

/**
 * Returns true when running as a native iOS app via Capacitor.
 */
export function isIOSCapacitor() {
    return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios';
}

/**
 * Returns true when donation UI should be hidden on iOS Capacitor:
 * - User is not logged in, or
 * - User has the specific ID (e.g. internal/test account).
 * Returns false when not on iOS Capacitor or when donation should be shown.
 */
export function shouldHideDonationOnIOSCapacitor(user) {
    if (!isIOSCapacitor()) {
        return false;
    }
    if (!user) {
        return true;
    }
    return user.id === DONATION_HIDDEN_USER_ID_IOS_CAPACITOR;
}
