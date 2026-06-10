import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const i18nPath = path.resolve(__dirname, 'i18n.js');
const source = fs.readFileSync(i18nPath, 'utf8');

describe('car catalog i18n', () => {
    it('defines marca and adminNavCarCatalog in all locales', () => {
        expect(source).toContain("marca: 'Marca'");
        expect(source).toContain("marca: 'Make'");
        expect(source).toContain("adminNavCarCatalog: 'Catálogo de autos'");
        expect(source).toContain("adminNavCarCatalog: 'Vehicle catalog'");
        expect(source).toContain("buscarMarca: 'Buscar marca'");
        expect(source).toContain("buscarMarca: 'Search make'");
        expect(source).toContain("anio: 'Año'");
        expect(source).toContain("anio: 'Year'");
    });
});
