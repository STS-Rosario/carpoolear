import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const viewPath = path.join(__dirname, 'MarkdownPreview.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('MarkdownPreview view', () => {
    it('uses the shared markdown preview renderer', () => {
        expect(viewSource).toContain('renderMarkdownPreview');
    });

    it('forces readable text color on rendered headings and paragraphs', () => {
        expect(viewSource).toContain('markdown-preview');
        expect(viewSource).toContain('color: #333');
        expect(viewSource).toMatch(/:deep\(h1\)/);
        expect(viewSource).toMatch(/:deep\(p\)/);
    });

    it('does not reuse chat message styles that inherit white text', () => {
        expect(viewSource).not.toContain('message_text');
    });
});
