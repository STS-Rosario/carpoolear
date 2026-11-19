import { describe, expect, it } from 'vitest';
import messages from './i18n.js';

describe('liveLocationGpsUnavailable i18n', () => {
    it('uses the approved Spanish copy for arg and chl', () => {
        ['arg', 'chl'].forEach((locale) => {
            expect(messages[locale].liveLocationGpsUnavailable).toBe(
                'No disponible en este dispositivo por falta de GPS'
            );
        });
    });

    it('provides an English string', () => {
        expect(messages.en.liveLocationGpsUnavailable).toContain('GPS');
        expect(messages.en.liveLocationGpsUnavailable).not.toBe(
            messages.arg.liveLocationGpsUnavailable
        );
    });
});
