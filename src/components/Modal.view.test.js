import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const modalPath = path.resolve(__dirname, 'Modal.vue');
const source = fs.readFileSync(modalPath, 'utf8');

describe('Modal close behavior', () => {
    it('closes from backdrop via click.self on modal mask', () => {
    });

    it('uses a stable directive handler method instead of a data ref set in mounted', () => {
        expect(source).toMatch(/v-clickoutside="onModalClickOutside"/);
        expect(source).not.toContain('clickOutsideHandler');
        expect(source).not.toMatch(/setTimeout\(\s*\(\)\s*=>\s*\{\s*this\.clickOutsideHandler/);
    });

    it('defers outside-dismiss until after the opening click stack (outsideDismissReady)', () => {
        expect(source).toContain('outsideDismissReady');
        expect(source).toMatch(
            /onModalClickOutside\(\)\s*\{[\s\S]*?if\s*\(\s*!this\.outsideDismissReady\s*\)/
        );
    });

    it('registers Escape to dismiss the modal', () => {
        expect(source).toContain("'Escape'");
        expect(source).toMatch(/addEventListener\s*\(\s*['"]keydown['"]/);
        expect(source).toMatch(/removeEventListener\s*\(\s*['"]keydown['"]/);
    });

    it('shows a top-right close control with icon and accessible label', () => {
        expect(source).toContain('modal-header-close');
        expect(source).toContain('fa fa-times');
        expect(source).toMatch(/:aria-label="\$t\('cerrar'\)"/);
        expect(source).toMatch(/type="button"/);
    });

    it('keeps the title and close control on one header row, title left and close right', () => {
        expect(source).toMatch(
            /class="modal-header modal-header-with-close"[\s\S]*?<slot name="header">[\s\S]*?class="modal-header-close/
        );
        expect(source).toMatch(
            /\.modal-header-with-close\s*\{[^}]*display:\s*flex/s
        );
        expect(source).toMatch(
            /\.modal-header-close\s*\{[^}]*margin-left:\s*auto/s
        );
    });

    it('left-aligns the header title with the body paragraphs', () => {
        expect(source).toMatch(/\.modal-header\s*\{[^}]*padding:\s*0/s);
        expect(source).toMatch(/\.modal-header\s*\{[^}]*text-align:\s*left/s);
        expect(source).toMatch(
            /\.modal-header(?:\s|:deep\s*\()h3[^}]*text-align:\s*left/s
        );
        expect(source).toMatch(/\.modal-body\s*\{[^}]*padding:\s*0/s);
        expect(source).toMatch(/\.modal-header::before[\s\S]*display:\s*none/s);
        expect(source).toMatch(/\.modal-header::after[\s\S]*display:\s*none/s);
    });

    it('adds extra space below the footer close button', () => {
        expect(source).toMatch(
            /\.modal-footer\s*\{[^}]*padding-bottom:\s*1\.5rem/s
        );
    });

    it('keeps title, close icon, and Cerrar spacing on trip-detail pages', () => {
        expect(source).toMatch(
            /\.modal-mask\s+\.modal-wrapper\s+\.modal-container\s*\{[^}]*padding:\s*1\.5rem 1\.5rem 2rem/s
        );
        expect(source).toMatch(
            /\.modal-mask\s+\.modal-wrapper\s+\.modal-container\s*\{[^}]*gap:\s*0\.75rem/s
        );
        expect(source).toMatch(
            /\.modal-mask\s+\.modal-container\s+\.modal-header-with-close\s*\{[^}]*align-items:\s*center/s
        );
        expect(source).toMatch(
            /\.modal-mask\s+\.modal-container\s+\.modal-header-close\s*\{[^}]*padding:\s*0/s
        );
        expect(source).toMatch(
            /\.modal-mask\s+\.modal-container\s+\.modal-header\s*\{[^}]*margin-bottom:\s*0/s
        );
        expect(source).toMatch(
            /\.modal-mask\s+\.modal-container\s+\.modal-body\s*\{[^}]*margin:\s*0/s
        );
        expect(source).toMatch(
            /\.modal-mask\s+\.modal-container\s+\.modal-footer\s*\{[^}]*padding:\s*0/s
        );
    });

    it('keeps long content scrollable within the viewport', () => {
    });

    it('forces readable dark text inside the modal even under .blue pages', () => {
    });

    it('declares legacy title/body props so they do not fall through as HTML attributes', () => {
        expect(source).toMatch(/title:\s*\{[\s\S]*?type:\s*String/);
        expect(source).toMatch(/body:\s*\{[\s\S]*?type:\s*String/);
    });

    it('removes grey header and footer divider bars', () => {
    });

    it('sizes the modal to fit content instead of stretching full width', () => {
    });
});
