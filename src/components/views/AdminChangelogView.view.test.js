import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const viewPath = path.join(__dirname, 'AdminChangelogView.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('AdminChangelogView view', () => {
    it('previews changelog body with MarkdownPreview instead of raw markdown', () => {
        expect(viewSource).toContain('MarkdownPreview');
        expect(viewSource).toContain(':source="row.body_markdown');
        expect(viewSource).not.toContain('message_text--markdown');
    });
});
