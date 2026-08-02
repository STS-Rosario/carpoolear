import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'IncomingFriendRequestCard.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('IncomingFriendRequestCard.vue solicitudes row', () => {
    it('renders full-width row with avatar, name, member since, and ver perfil', () => {
        expect(viewSource).toContain('incoming-friend-request-card');
        expect(viewSource).toContain('incoming-friend-request-card__name');
        expect(viewSource).toContain('memberSinceLabel');
        expect(viewSource).toContain('getMembershipDuration');
        expect(viewSource).toContain("$t('verPerfil')");
        expect(viewSource).toContain("name: 'profile'");
        expect(viewSource).not.toContain("$t('deseaSerTuAmigo')");
        expect(viewSource).not.toContain('box-shadow:');
        expect(viewSource).not.toContain('width: fit-content');
    });

    it('shows verified shield when identity is validated', () => {
        expect(viewSource).toContain('identity_validated');
        expect(viewSource).toContain('fa-shield');
        expect(viewSource).toContain('incoming-friend-request-card__verified');
    });

    it('shows ratings and trips next to the name', () => {
        expect(viewSource).toContain('UserRatingsCounts');
        expect(viewSource).toContain('userRatingsFromProfile');
        expect(viewSource).toContain('tripsLabel');
        expect(viewSource).toMatch(
            /\$t\(\s*['"]perfilViajesParticipados['"]/
        );
        expect(viewSource).toContain('normalizeTripsCount');
        expect(viewSource).toMatch(
            /incoming-friend-request-card__name-row[\s\S]*UserRatingsCounts[\s\S]*tripsLabel/
        );
    });

});
