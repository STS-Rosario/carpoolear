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

    it('keeps all heading levels through h6 in markdown and html previews', async () => {
        const { renderMarkdownPreview } = await import('./markdown.js');
        const markdownHtml = renderMarkdownPreview(
            '# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6'
        );
        expect(markdownHtml).toContain('<h1');
        expect(markdownHtml).toContain('<h2');
        expect(markdownHtml).toContain('<h3');
        expect(markdownHtml).toContain('<h4');
        expect(markdownHtml).toContain('<h5');
        expect(markdownHtml).toContain('<h6');

        const wysiwygHtml = renderMarkdownPreview(
            '<h1>H1</h1><h2>H2</h2><h3>H3</h3><h4>H4</h4><h5>H5</h5><h6>H6</h6>'
        );
        expect(wysiwygHtml).toContain('<h4>H4</h4>');
        expect(wysiwygHtml).toContain('<h5>H5</h5>');
        expect(wysiwygHtml).toContain('<h6>H6</h6>');
    });
});
