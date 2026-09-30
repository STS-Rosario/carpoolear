import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import messages from './i18n';

const SOURCES = [
    '../components/views/AdminIdentityVerificationReport.vue',
    '../utils/identityVerificationReportData.js',
    '../utils/identityVerificationReportFilters.js'
];

function usedReportKeys() {
    const keys = new Set();
    SOURCES.forEach((relative) => {
        const source = fs.readFileSync(path.resolve(__dirname, relative), 'utf8');
        (source.match(/adminIvr[A-Za-z]+/g) || []).forEach((key) => keys.add(key));
    });
    return [...keys].sort();
}

describe('admin identity verification report nav i18n', () => {
    it('arg locale labels the admin nav entry in Spanish', () => {
        expect(messages.arg.adminNavReporteVerificaciones).toBe('Reporte de verificaciones');
    });

    it.each(['chl', 'en'])('%s locale defines the nav entry label', (locale) => {
        expect(messages[locale].adminNavReporteVerificaciones).toBeTruthy();
    });
});

describe('admin identity verification report page i18n', () => {
    it('uses report keys in the page', () => {
        expect(usedReportKeys().length).toBeGreaterThan(20);
    });

    it.each(['arg', 'chl', 'en'])('%s locale defines every report key used by the page', (locale) => {
        const missing = usedReportKeys().filter((key) => !messages[locale][key]);

        expect(missing).toEqual([]);
    });
});
