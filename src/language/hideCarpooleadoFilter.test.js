import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const i18nPath = path.resolve(__dirname, 'i18n.js');
const source = fs.readFileSync(i18nPath, 'utf8');

describe('hide carpooleado search filter i18n', () => {
    it('defines esconderViajesCarpooleados in all locales', () => {
        expect(source).toContain("esconderViajesCarpooleados: 'Esconder viajes Carpooleados'");
        expect(source).toContain("esconderViajesCarpooleados: 'Hide Carpooled trips'");
        expect(source).toContain("esconderViajesCarpooleados: 'Ocultar viajes Carpooleados'");
    });
});
