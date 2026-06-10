import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'PendingFriendRequestsCard.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('PendingFriendRequestsCard', () => {
    it('uses compact centered card styling and links to friends settings', () => {
        expect(viewSource).toContain('pending-friend-requests');
        expect(viewSource).toContain('max-width: 500px');
        expect(viewSource).toContain('max-width: 50px');
        expect(viewSource).toContain('max-height: 50px');
        expect(viewSource).toContain("$t('solicitudesDeAmistad')");
        expect(viewSource).toContain("$t('tenesInvitacionesAmigosAntesClick')");
        expect(viewSource).toContain("$t('clickAca')");
        expect(viewSource).toContain("$t('paraVerlasInvitacionesAmigos')");
        expect(viewSource).toContain("name: 'friends_setting'");
    });

    it('is hidden when there are no pending invitations', () => {
        expect(viewSource).toContain('v-if="hasPending"');
    });
});
