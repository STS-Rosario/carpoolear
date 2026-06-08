import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const viewPath = path.join(__dirname, 'ChangelogModal.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('ChangelogModal view', () => {
    it('shows a prominent changelog title', () => {
        expect(viewSource).toContain('ultimosCambios');
        expect(viewSource).toContain('changelog-modal-title');
        expect(viewSource).toMatch(/changelog-modal-title[\s\S]*font-size:\s*1\.75rem/);
    });

    it('shows the intro message and version heading before the changes body', () => {
        expect(viewSource).toContain('changelogModalIntro');
        expect(viewSource).toContain('changelog-modal-version');
        expect(viewSource).toContain('versionHeading');
        expect(viewSource).toContain('MarkdownPreview');
        expect(viewSource).toMatch(/changelogModalIntro[\s\S]*changelog-modal-version[\s\S]*MarkdownPreview/);
    });

    it('renders markdown body with MarkdownPreview instead of raw markdown', () => {
        expect(viewSource).toContain(':source="entryBody"');
        expect(viewSource).not.toContain('message_text--markdown');
    });

    it('is positioned in the lower left with a backdrop', () => {
        expect(viewSource).toContain('changelog-modal-backdrop');
        expect(viewSource).toContain('changelog-modal-dialog');
        expect(viewSource).toMatch(/changelog-modal-dialog[\s\S]*left:\s*16px/);
        expect(viewSource).not.toMatch(/changelog-modal-dialog[\s\S]*right:\s*16px/);
    });

    it('provides an OK button that dismisses the modal', () => {
        expect(viewSource).toContain('changelogModalOk');
        expect(viewSource).toContain('changelog-modal-ok');
        expect(viewSource).toMatch(/changelog-modal-ok[\s\S]*@click="close"/);
    });

    it('marks the version as seen when closed', () => {
        expect(viewSource).toContain('markChangelogSeenForVersion');
    });

    it('opens from navigation even after the version was dismissed', () => {
        expect(viewSource).toContain('changelog:open');
        expect(viewSource).toContain('openFromNavigation');
        expect(viewSource).toContain('forcedOpen');
    });

    it('loads every changelog from navigation sorted by semver newest first', () => {
        expect(viewSource).toContain('fetchAll');
        expect(viewSource).toContain('navigationMode');
        expect(viewSource).toContain('navigationEntries');
        expect(viewSource).toContain('sortChangelogsBySemverDesc');
        expect(viewSource).toMatch(/v-for="entry in navigationEntries"/);
    });

    it('keeps long changelog content in a scrollable region with a fixed footer', () => {
        expect(viewSource).toContain('changelog-modal-scroll');
        expect(viewSource).toMatch(/changelog-modal-scroll[\s\S]*overflow-y:\s*auto/);
        expect(viewSource).toMatch(/changelog-modal-footer[\s\S]*flex-shrink:\s*0/);
        expect(viewSource).toMatch(/changelog-modal-dialog[\s\S]*min-height:\s*0/);
    });
});
