import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'UnLitroParaCarpoolear.vue');
const routesPath = path.resolve(__dirname, '../../router/routes.js');

describe('UnLitroParaCarpoolear page wiring', () => {
    it('registers an in-app route that loads the Vue page (not StaticHtmlPage)', () => {
        const routesSource = fs.readFileSync(routesPath, 'utf8');
        expect(routesSource).toContain("path: '/un-litro-para-carpoolear'");
        expect(routesSource).toContain("name: 'un_litro_para_carpoolear'");
        expect(routesSource).toContain('UnLitroParaCarpoolear');
        expect(routesSource).not.toMatch(
            /path:\s*'\/un-litro-para-carpoolear'[\s\S]*?pageSlug:\s*'un-litro-para-carpoolear'/
        );
    });

    it('wraps content with AccountSettingsLayout and the page title key', () => {
        const viewSource = fs.readFileSync(viewPath, 'utf8');
        expect(viewSource).toContain('AccountSettingsLayout');
        expect(viewSource).toContain('unLitroParaCarpoolear');
    });
});
