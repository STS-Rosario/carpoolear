import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'StaticHtmlPage.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('StaticHtmlPage', () => {
    it('loads static page content from the API and renders it in the terms layout', () => {
        expect(viewSource).toContain('.getPage(this.pageSlug)');
        expect(viewSource).toContain('v-html="pageContent"');
    });

    it('wraps the page with the account settings layout', () => {
        expect(viewSource).toContain('AccountSettingsLayout');
        expect(viewSource).toContain(':page-title-key="pageTitleKey"');
    });

    it('binds internal FAQ subpage links through the SPA router', () => {
        expect(viewSource).toContain('bindInternalStaticPageLinks');
    });
});

describe('static help page routes', () => {
    it('registers in-app FAQ and linked article routes', () => {
        const routesSource = fs.readFileSync(
            path.resolve(__dirname, '../../router/routes.js'),
            'utf8'
        );
        expect(routesSource).toContain("name: 'faq'");
        expect(routesSource).toContain("name: 'division_de_gastos'");
        expect(routesSource).toContain("name: 'verificacion_cuenta'");
        expect(routesSource).toContain("pageSlug: 'faq'");
        expect(routesSource).toContain("pageSlug: 'division-de-gastos'");
        expect(routesSource).toContain("pageSlug: 'verificacion-cuenta'");
    });
});
