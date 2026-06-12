import { describe, expect, it, vi } from 'vitest';
import { isWebPushActive, shouldPollNotificationCount } from './notificationPolling.js';

describe('notificationPolling utils', () => {
    it('polls when web push is disabled in config', () => {
        expect(shouldPollNotificationCount({ web_push_notification: false })).toBe(true);
    });

    it('does not poll when web push is granted', () => {
        vi.stubGlobal('window', { Notification: { permission: 'granted' } });

        expect(
            isWebPushActive({ web_push_notification: true })
        ).toBe(true);
        expect(
            shouldPollNotificationCount({ web_push_notification: true })
        ).toBe(false);

        vi.unstubAllGlobals();
    });
});
