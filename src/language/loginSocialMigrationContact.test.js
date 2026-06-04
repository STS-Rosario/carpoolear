import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import messages from './i18n';

const MIGRATION_CONTACT_ES = {
    escribinosMesaAyudaMigracionLead:
        'Para recuperar tu cuenta y migrarla a una cuenta vinculada a correo, escribinos a ',
    escribinosMesaAyudaMigracionMid: ' o por mensaje a ',
    escribinosMesaAyudaMigracionOr: ' o '
};

const MIGRATION_CONTACT_BY_LOCALE = {
    arg: MIGRATION_CONTACT_ES,
    chl: MIGRATION_CONTACT_ES,
    en: {
        escribinosMesaAyudaMigracionLead:
            'To recover your account and migrate it to an email-linked account, write us at ',
        escribinosMesaAyudaMigracionMid: ' or message us on ',
        escribinosMesaAyudaMigracionOr: ' or '
    }
};

const CARPOOLEAR_FACEBOOK_URL = 'https://www.facebook.com/Carpoolear';
const CARPOOLEAR_INSTAGRAM_URL =
    'https://www.instagram.com/carpoolear/?hl=en';

const loginViewPath = path.resolve(
    __dirname,
    '../components/views/Login.vue'
);
const loginViewSource = fs.readFileSync(loginViewPath, 'utf8');

describe('Login social migration contact (i18n)', () => {
    it.each(Object.entries(MIGRATION_CONTACT_BY_LOCALE))(
        '%s locale has migration contact copy for email and social networks',
        (locale, expected) => {
            Object.entries(expected).forEach(([key, label]) => {
                expect(messages[locale][key]).toBe(label);
            });
        }
    );

    it('arg locale no longer points migration help to mesa de ayuda', () => {
        expect(messages.arg.escribinosMesaAyudaMigracionLead).not.toContain(
            'escribinos desde la'
        );
    });
});

describe('Login.vue social migration contact links', () => {
    it('shows mailto admin email and Carpoolear Instagram/Facebook profile links', () => {
        expect(loginViewSource).toContain(
            "$t('escribinosMesaAyudaMigracionLead')"
        );
        expect(loginViewSource).toContain(
            "$t('escribinosMesaAyudaMigracionMid')"
        );
        expect(loginViewSource).toContain(
            "$t('escribinosMesaAyudaMigracionOr')"
        );
        expect(loginViewSource).toContain(
            ":href=\"'mailto:' + config.admin_email\""
        );
        expect(loginViewSource).toContain(CARPOOLEAR_FACEBOOK_URL);
        expect(loginViewSource).toContain(CARPOOLEAR_INSTAGRAM_URL);
        expect(loginViewSource).toContain("$t('footerInstagram')");
        expect(loginViewSource).toContain("$t('footerFacebook')");
    });

    it('does not route migration contact through mesa de ayuda tickets', () => {
        expect(loginViewSource).not.toMatch(
            /escribinosMesaAyudaMigracionLead[\s\S]{0,300}router-link[^>]*name:\s*'tickets'/
        );
    });
});
