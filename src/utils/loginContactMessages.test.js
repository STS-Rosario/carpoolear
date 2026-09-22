import { describe, expect, it } from 'vitest';
import i18n from '../i18n.js';
import {
    getLoginBannedMessage,
    getLoginInactiveAccountMessage
} from './loginContactMessages.js';

const ADMIN_EMAIL = 'admin@carpoolear.com.ar';

describe('loginContactMessages', () => {
    it('builds banned user message with admin email from config', () => {
        const message = getLoginBannedMessage(i18n.global.t, ADMIN_EMAIL);

        expect(message).toContain(ADMIN_EMAIL);
        expect(message).not.toContain('@@');
        expect(message).toMatch(/desactivada/i);
    });

    it('builds inactive account message with admin email from config', () => {
        const message = getLoginInactiveAccountMessage(
            i18n.global.t,
            ADMIN_EMAIL
        );

        expect(message).toContain(ADMIN_EMAIL);
        expect(message).not.toContain('@@');
        expect(message).toMatch(/confirmada/i);
    });

    it('does not throw when translating login contact messages in production mode', () => {
        const previousNodeEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';

        try {
            expect(() =>
                getLoginBannedMessage(i18n.global.t, ADMIN_EMAIL)
            ).not.toThrow();
            expect(() =>
                getLoginInactiveAccountMessage(i18n.global.t, ADMIN_EMAIL)
            ).not.toThrow();
        } finally {
            process.env.NODE_ENV = previousNodeEnv;
        }
    });
});
