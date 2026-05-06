import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TicketDetail.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('TicketDetail user view', () => {
    it('shows translated, color-coded priority and status labels', () => {
        expect(viewSource).toContain('priorityClass(');
        expect(viewSource).toContain('statusClass(');
        expect(viewSource).toContain('priorityLabel(');
        expect(viewSource).toContain('statusLabel(');
    });

    it('does not show unread counter helper text', () => {
        expect(viewSource).not.toContain("{{ $t('sinLeer') }}");
    });

    it('shows user name instead of generic user label for non-admin replies', () => {
        expect(viewSource).toContain('replyAuthorLabel(reply)');
    });

    it('shows translated image attachment title', () => {
        expect(viewSource).toContain("{{ $t('adjuntarImagenes') }}");
    });

    it('shows relative message date with tooltip containing full timestamp', () => {
        expect(viewSource).toContain('relativeDate(reply.created_at)');
        expect(viewSource).toContain(':title="fullDate(reply.created_at)"');
    });
});
