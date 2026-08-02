import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TripCardShell.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('TripCardShell.vue', () => {
    it('shows driver name, ratings, route points, seats and detail CTA', () => {
        expect(viewSource).toContain('data-testid="trip-card-driver-name"');
        expect(viewSource).toContain('{{ user.name }}');
        expect(viewSource).toContain('UserRatingsCounts');
        expect(viewSource).not.toContain('UserNameWithBadge');
        expect(viewSource).toContain('fromCity');
        expect(viewSource).toContain('fromRegion');
        expect(viewSource).toContain('fromPoint');
        expect(viewSource).toContain('toCity');
        expect(viewSource).toContain('toRegion');
        expect(viewSource).toContain('toPoint');
        expect(viewSource).toContain('getSeatsPillLabel');
        expect(viewSource).toContain('data-testid="trip-card-detail"');
        expect(viewSource).toContain("$t('verDetalle')");
        expect(viewSource).not.toContain("$t('puntoDePartida')");
        expect(viewSource).not.toContain("$t('puntoDeLlegada')");
    });

    it('shows verified shield after trips count only when driver is verified', () => {
        expect(viewSource).toContain('data-testid="trip-card-trips-count"');
        expect(viewSource).toContain('data-testid="trip-card-verified"');
        expect(viewSource).toMatch(
            /tripsCountLabel[\s\S]*trip-card-trips-count[\s\S]*trip-card-verified|trip-card-trips-count[\s\S]*trip-card-verified/
        );
        expect(viewSource).toMatch(
            /v-if="isDriverVerified"[\s\S]*data-testid="trip-card-verified"|data-testid="trip-card-verified"[\s\S]*v-if="isDriverVerified"/
        );
        expect(viewSource).toContain("$t('usuarioVerificado')");
        expect(viewSource).toMatch(
            /isDriverVerified\(\)\s*\{[\s\S]*identity_validated[\s\S]*identity_validated_at/
        );
    });

    it('uses profile image for the driver avatar', () => {
        expect(viewSource).toContain('v-imgSrc:profile="avatarImage"');
        expect(viewSource).toMatch(/avatarImage\(\)\s*\{[\s\S]*user\.image/);
    });

    it('routes profile vs detail clicks separately', () => {
        expect(viewSource).toMatch(
            /@click\.stop(?:\.prevent)?="onProfileClick"|v-on:click\.stop="onProfileClick"/
        );
        expect(viewSource).toContain("$emit('profile-click'");
        expect(viewSource).toContain("$emit('detail-click'");
        expect(viewSource).toContain('data-testid="trip-card-detail"');
    });

    it('exposes actions-extra, body-extra and footer-extra slots', () => {
        expect(viewSource).toContain('name="actions-extra"');
        expect(viewSource).toContain('name="body-extra"');
        expect(viewSource).toContain('name="footer-extra"');
    });
});
