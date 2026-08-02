import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const modalPath = path.resolve(__dirname, 'Modal.vue');
const source = fs.readFileSync(modalPath, 'utf8');

describe('Modal close behavior', () => {
    it('closes from backdrop via click.self on modal mask', () => {
        expect(source).toMatch(/class="modal-mask"[^>]*@click\.self/);
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

    it('keeps long content scrollable within the viewport', () => {
        expect(source).toMatch(/\.modal-container\s*\{[\s\S]*max-height:\s*calc\(100vh/);
        expect(source).toMatch(
            /\.modal-body\s*\{[\s\S]*?overflow-y:\s*auto/s
        );
    });

    it('styles the footer Cerrar action as secondary AppButton', () => {
        expect(source).toContain("import AppButton from './ui/AppButton.vue'");
        expect(source).toMatch(
            /<AppButton[\s\S]*?variant="secondary"[\s\S]*?\$t\('cerrar'\)[\s\S]*?<\/AppButton>/
        );
        expect(source).not.toMatch(
            /class="modal-default-button btn btn-link"/
        );
    });

    it('forces readable dark text inside the modal even under .blue pages', () => {
        expect(source).toMatch(
            /\.modal-container\s+:deep\((?:p|label|h3|li)\)[\s\S]*color:\s*#333/s
        );
    });

    it('removes grey header and footer divider bars', () => {
        expect(source).toMatch(
            /\.modal-header\s*\{[^}]*border-bottom:\s*none/
        );
        expect(source).toMatch(
            /\.modal-footer\s*\{[^}]*border-top:\s*none/
        );
    });
});
