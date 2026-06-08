import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('dompurify', () => ({
    default: {
        sanitize: (html) => html
    }
}));

describe('renderMarkdownPreview', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it('renders markdown headings and lists instead of raw syntax', async () => {
        const { renderMarkdownPreview } = await import('./markdown.js');
        const html = renderMarkdownPreview(
            '# Cambios\n\nPrueba 23\n\n# Corrección de errores\n- Prueba dsada\n- Prueba 2'
        );

        expect(html).toContain('<h1');
        expect(html).toContain('Cambios');
        expect(html).not.toContain('<p># Cambios</p>');
        expect(html).toContain('<li>Prueba dsada</li>');
        expect(html).not.toMatch(/<p>- Prueba dsada<\/p>/);
    });

    it('renders sanitized html saved from the wysiwyg editor', async () => {
        const { renderMarkdownPreview } = await import('./markdown.js');
        const html = renderMarkdownPreview(
            '<h1>Cambios</h1><p>Prueba 23</p><h2>Corrección de errores</h2><ul><li>Prueba dsada</li></ul>'
        );

        expect(html).toContain('<h1>Cambios</h1>');
        expect(html).toContain('<p>Prueba 23</p>');
        expect(html).not.toContain('# Cambios');
        expect(html).toContain('<li>Prueba dsada</li>');
    });
});
