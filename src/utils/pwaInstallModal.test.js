import { describe, expect, it } from 'vitest';
import { shouldShowPwaInstallModal } from './pwaInstallModal.js';

describe('shouldShowPwaInstallModal', () => {
    it('does not show on native iOS even when the user agent looks like iPhone', () => {
        expect(
            shouldShowPwaInstallModal({
                isNativePlatform: true,
                isIos: true,
                hasInstallEvent: false
            })
        ).toBe(false);
    });

    it('shows on iOS Safari in the browser so users can add the PWA', () => {
        expect(
            shouldShowPwaInstallModal({
                isNativePlatform: false,
                isIos: true,
                hasInstallEvent: false
            })
        ).toBe(true);
    });

    it('shows on Android web when beforeinstallprompt fired', () => {
        expect(
            shouldShowPwaInstallModal({
                isNativePlatform: false,
                isIos: false,
                hasInstallEvent: true
            })
        ).toBe(true);
    });

    it('does not show on native Android even if an install event exists', () => {
        expect(
            shouldShowPwaInstallModal({
                isNativePlatform: true,
                isIos: false,
                hasInstallEvent: true
            })
        ).toBe(false);
    });

    it('does not show on desktop web without an install event', () => {
        expect(
            shouldShowPwaInstallModal({
                isNativePlatform: false,
                isIos: false,
                hasInstallEvent: false
            })
        ).toBe(false);
    });
});
