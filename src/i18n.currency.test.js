import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const i18nSource = fs.readFileSync(path.resolve(__dirname, 'i18n.js'), 'utf8');
const mainSource = fs.readFileSync(path.resolve(__dirname, 'main.js'), 'utf8');

describe('currency number formatting', () => {
    it('uses narrowSymbol so ARS renders as $ not ARS', () => {
        expect(i18nSource).toContain("currencyDisplay: 'narrowSymbol'");
        expect(i18nSource).not.toMatch(
            /currencyDisplay:\s*'symbol'/
        );
    });

    it('maps app locale arg to es-AR when formatting currency via i18n.n', () => {
        expect(i18nSource).toContain('installCurrencyNumberFormat');
        expect(i18nSource).toContain('appLocaleToBCP47');
        expect(i18nSource).toMatch(
            /return originalN\(value, 'currency', intlLocale\)/
        );
    });
});
