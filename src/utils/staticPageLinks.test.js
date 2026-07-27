import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const utilPath = path.resolve(__dirname, 'staticPageLinks.js');
const utilSource = fs.readFileSync(utilPath, 'utf8');

describe('bindInternalStaticPageLinks', () => {
    it('maps FAQ subpage hrefs to in-app routes', () => {
        expect(utilSource).toContain("'/division-de-gastos': 'division_de_gastos'");
        expect(utilSource).toContain(
            "'/verificacion-cuenta': 'verificacion_cuenta'"
        );
        expect(utilSource).toContain('event.preventDefault()');
        expect(utilSource).toContain('router.push({ name: routeName })');
    });
});
