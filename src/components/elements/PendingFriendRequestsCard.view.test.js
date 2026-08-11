import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'PendingFriendRequestsCard.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('PendingFriendRequestsCard', () => {
    it('uses cream prompt-banner styling and links to Solicitudes Recibidas', () => {
        expect(viewSource).toContain('pending-friend-requests');
        expect(viewSource).toContain('home-prompt-banner');
        expect(viewSource).toContain("$t('solicitudesDeAmistad')");
        expect(viewSource).toContain("$t('tenesInvitacionesAmigosAntesClick')");
        expect(viewSource).toContain("$t('clickAca')");
        expect(viewSource).toContain("$t('paraVerlasInvitacionesAmigos')");
        expect(viewSource).toContain('FRIENDS_SOLICITUDES_RECIBIDAS_ROUTE');
        expect(viewSource).toContain(':to="FRIENDS_SOLICITUDES_RECIBIDAS_ROUTE"');
        expect(viewSource).not.toContain('pending-friend-requests-card__chevron');
        expect(viewSource).not.toContain('Aceptar');
        expect(viewSource).not.toContain('Rechazar');
    });

    it('is hidden when there are no pending invitations', () => {
        expect(viewSource).toContain('v-if="hasPending"');
    });
});
