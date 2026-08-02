import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const layoutPath = path.resolve(__dirname, 'AdminLayout.vue');
const layoutSource = fs.readFileSync(layoutPath, 'utf8');
const navPath = path.resolve(__dirname, '../sections/adminNav.vue');
const navSource = fs.readFileSync(navPath, 'utf8');

describe('AdminLayout desktop spacing', () => {
    it('uses a flex shell with compact sidebar and fluid content', () => {
        expect(layoutSource).toContain('admin-layout');
        expect(layoutSource).toContain('admin-layout__sidebar');
        expect(layoutSource).toContain('admin-layout-content');
        expect(layoutSource).toMatch(
            /\.admin-layout\s*\{[^}]*display:\s*flex/
        );
        expect(layoutSource).toMatch(
            /\.admin-layout__sidebar\s*\{[^}]*flex:\s*0 0 240px|\.admin-layout__sidebar\s*\{[^}]*width:\s*240px/
        );
        expect(layoutSource).toMatch(
            /\.admin-layout-content\s*\{[^}]*flex:\s*1/
        );
        expect(layoutSource).toContain('min-width: 0');
    });

    it('applies a single modest top offset on the shell, not duplicated on nav and content', () => {
        expect(layoutSource).toMatch(
            /\.admin-layout\s*\{[^}]*margin-top:\s*(1rem|16px|1\.5rem|24px)/
        );
        expect(layoutSource).not.toMatch(
            /\.admin-layout-content\s*\{[^}]*margin-top:\s*72px/
        );
        expect(navSource).not.toMatch(
            /\.admin-nav-wrapper\s*\{[^}]*margin-top:\s*72px/
        );
    });

    it('neutralizes nested container and column offsets inside content', () => {
        expect(layoutSource).toMatch(
            /\.admin-layout-content\s+:deep\(\.container\)|\.admin-layout-content\s+:deep\(\s*\.container/
        );
        expect(layoutSource).toContain('max-width: none');
        expect(layoutSource).toMatch(
            /col-md-offset|\[class\*='col-md-offset'\]|\[class\*="col-md-offset"\]/
        );
    });

    it('keeps overflow-x safety without relying on Bootstrap col-md-4/20 shell', () => {
        expect(layoutSource).toContain('overflow-x: auto');
        expect(layoutSource).not.toMatch(/class="col-md-4"/);
        expect(layoutSource).not.toMatch(/class="col-md-20[^"]*"/);
        expect(layoutSource).not.toContain('<div class="col-md-24">');
    });

    it('wraps main content in a DS card with dark page-title styling', () => {
        expect(layoutSource).toContain('admin-layout-card');
        expect(layoutSource).toMatch(
            /\.admin-layout-card\s*\{[^}]*background:\s*var\(--ds-card-bg\)/
        );
        expect(layoutSource).toMatch(
            /\.admin-layout-card\s*\{[^}]*border-radius:\s*var\(--ds-card-radius\)/
        );
        expect(layoutSource).toMatch(
            /\.admin-layout-card\s*\{[^}]*box-shadow:\s*var\(--ds-card-shadow\)/
        );
        expect(layoutSource).toMatch(
            /admin-layout-card[\s\S]*?h2[\s\S]*?color:\s*var\(--ds-text-primary\)/
        );
        expect(layoutSource).toMatch(
            /admin-layout-card[\s\S]*?\.app-page-title[\s\S]*?color:\s*var\(--ds-text-primary\)/
        );
    });
});
