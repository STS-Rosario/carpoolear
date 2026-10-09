import { describe, expect, it } from 'vitest';
import messages from './i18n';

describe('admin support Club column i18n', () => {
    it.each(['arg', 'chl', 'en'])('labels the Club column as Club in %s', (locale) => {
        expect(messages[locale].columnaClub).toBe('Club');
    });
});
