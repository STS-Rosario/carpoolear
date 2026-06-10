import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'IncomingFriendRequestCard.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('IncomingFriendRequestCard.vue', () => {
    it('shows a large profile link, hint, and accept/reject actions', () => {
        expect(viewSource).toContain('incoming-friend-request-card__name');
        expect(viewSource).toContain('width: fit-content');
        expect(viewSource).toContain('font-size: 1.25rem');
        expect(viewSource).toContain("name: 'profile'");
        expect(viewSource).toContain("$t('deseaSerTuAmigo')");
        expect(viewSource).toContain("$t('aceptar')");
        expect(viewSource).toContain("$t('rechazar')");
        expect(viewSource).toContain('btn-accept-request');
        expect(viewSource).toContain('btn-reject-request');
        expect(viewSource).toContain("$emit('accept', user)");
        expect(viewSource).toContain("$emit('reject', user)");
    });
});
