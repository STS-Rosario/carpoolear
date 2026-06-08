import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const viewPath = path.join(__dirname, 'ChangelogModal.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('ChangelogModal view', () => {
    it('shows the changelog title', () => {
        expect(viewSource).toContain('ultimosCambios');
    });

    it('renders markdown body with MarkdownPreview instead of raw markdown', () => {
        expect(viewSource).toContain('MarkdownPreview');
        expect(viewSource).toContain(':source="entryBody"');
        expect(viewSource).not.toContain('message_text--markdown');
    });

    it('is positioned in the lower right with a backdrop', () => {
        expect(viewSource).toContain('changelog-modal-backdrop');
        expect(viewSource).toContain('changelog-modal-dialog');
    });

    it('marks the version as seen when closed', () => {
        expect(viewSource).toContain('markChangelogSeenForVersion');
    });
});
