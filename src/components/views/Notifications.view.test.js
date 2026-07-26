import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'Notifications.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('Notifications view', () => {
    it('renders the notification permission warning for logged-in users on any supported platform', () => {
        expect(viewSource).toContain("user: 'user'");
        expect(viewSource).toContain(
            'v-if="user && notificationsEnabledForPlatform && !hasNotificationPermission && showNotificationWarning"'
        );
    });

    it('delegates permission check/request to the shared platform-aware util', () => {
        expect(viewSource).toContain(
            "from '../../utils/notificationPermission.js'"
        );
        expect(viewSource).toContain('getNotificationPermissionStatus');
        expect(viewSource).toContain('requestNotificationPermission');
    });

    it('enables push for native Capacitor builds regardless of web_push_notification', () => {
        expect(viewSource).toContain('notificationsEnabledForPlatform');
        expect(viewSource).toContain('isNativePlatform');
        expect(viewSource).not.toContain('isPWA()');
    });

    it('routes identity_validation notifications to account verification page', () => {
        expect(viewSource).toContain("case 'identity_validation':");
        expect(viewSource).toContain("name: 'identity_validation'");
    });

    it('routes identity_validation_manual notifications to manual validation upload page', () => {
        expect(viewSource).toContain("case 'identity_validation_manual':");
        expect(viewSource).toContain("name: 'identity_validation_manual'");
        expect(viewSource).toContain('request_id: n.extras.request_id');
        expect(viewSource).toContain("resubmit: n.extras.resubmit");
    });

    it('routes friend trip alert notifications through trip detail resolver', () => {
        expect(viewSource).toContain(
            "import { resolveTripDetailRoute } from '../../utils/notificationNavigation.js'"
        );
        expect(viewSource).toContain('const tripRoute = resolveTripDetailRoute(n)');
        expect(viewSource).toContain('router.push(tripRoute)');
    });
});
