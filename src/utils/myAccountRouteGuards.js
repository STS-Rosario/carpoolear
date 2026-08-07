import { DESKTOP_DEFAULT_ACCOUNT_ROUTE } from './myAccountDesktopSections';
import { useDeviceStore } from '../stores/device';

export function redirectMyAccountOnDesktop(to, from, next) {
    const deviceStore = useDeviceStore();
    if (!deviceStore.isMobile) {
        next({ ...DESKTOP_DEFAULT_ACCOUNT_ROUTE, replace: true });
        return;
    }
    next();
}
