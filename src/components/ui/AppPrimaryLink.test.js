import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'AppPrimaryLink.vue');
const source = fs.readFileSync(componentPath, 'utf8');

describe('AppPrimaryLink', () => {
    it('renders as a router-link with primary button styles', () => {
        expect(source).toContain('<router-link');
        expect(source).toContain('app-button--primary');
        expect(source).toContain(':to="to"');
    });

    it('supports size variants', () => {
        expect(source).toContain("default: 'sm'");
        expect(source).toMatch(/app-button--\$\{this\.size\}/);
    });

    it('supports external href links', () => {
        expect(source).toContain('<a');
        expect(source).toContain(':href="href"');
    });
});
