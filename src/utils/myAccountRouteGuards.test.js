import { beforeEach, describe, expect, it, vi } from 'vitest';
import { redirectMyAccountOnDesktop } from './myAccountRouteGuards.js';
import { DESKTOP_DEFAULT_ACCOUNT_ROUTE } from './myAccountDesktopSections.js';

const { useDeviceStore } = vi.hoisted(() => ({
    useDeviceStore: vi.fn()
}));

vi.mock('../stores/device', () => ({
    useDeviceStore
}));

describe('redirectMyAccountOnDesktop', () => {
    beforeEach(() => {
        useDeviceStore.mockReset();
    });

    it('redirects to the desktop default route when on a desktop layout', () => {
        useDeviceStore.mockReturnValue({ isMobile: false });
        const next = vi.fn();

        redirectMyAccountOnDesktop({}, {}, next);

        expect(next).toHaveBeenCalledWith({ ...DESKTOP_DEFAULT_ACCOUNT_ROUTE, replace: true });
    });

    it('continues to the requested route on mobile layouts', () => {
        useDeviceStore.mockReturnValue({ isMobile: true });
        const next = vi.fn();

        redirectMyAccountOnDesktop({}, {}, next);

        expect(next).toHaveBeenCalledWith();
    });
});
