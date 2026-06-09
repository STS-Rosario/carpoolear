import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'PendingFriendRequestsCard.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('PendingFriendRequestsCard', () => {
    it('uses rate-pending styling and links to friends settings', () => {
        expect(viewSource).toContain('rate-pending_component');
        expect(viewSource).toContain("$t('tenesInvitacionesAmigosClickParaVerlas')");
        expect(viewSource).toContain("name: 'friends_setting'");
    });

    it('is hidden when there are no pending invitations', () => {
        expect(viewSource).toContain('v-if="hasPending"');
    });
});
