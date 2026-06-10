import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const i18nPath = path.resolve(__dirname, 'i18n.js');
const source = fs.readFileSync(i18nPath, 'utf8');

describe('advanced search filters i18n', () => {
    it('defines advanced filter labels in all locales', () => {
        expect(source).toContain("filtrosAvanzados: 'Filtros avanzados'");
        expect(source).toContain("filtroCualquiera: 'Cualquiera'");
        expect(source).toContain("filtroPermitido: 'Permitido'");
        expect(source).toContain("filtroNoPermitido: 'No permitido'");
        expect(source).toContain("filtrosAvanzados: 'Advanced filters'");
        expect(source).toContain("filtroCualquiera: 'Any'");
        expect(source).toContain("filtrosAvanzados: 'Filtros avanzados'");
    });
});
