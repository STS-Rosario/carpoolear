import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'TripDetailShareButton.vue');
const componentSource = fs.readFileSync(componentPath, 'utf8');

describe('TripDetailShareButton.vue', () => {
    it('renders a secondary share button with share icon and trip share label', () => {
        expect(componentSource).toContain('class="trip-detail__share"');
        expect(componentSource).toContain('data-testid="trip-detail-share"');
        expect(componentSource).toMatch(
            /variant="secondary"[\s\S]*?data-testid="trip-detail-share"[\s\S]*?icon-left="fa fa-share-alt"/
        );
        expect(componentSource).toContain("$t('tripCreationShareTrip')");
    });

    it('delegates sharing to shareTripDetail', () => {
        expect(componentSource).toContain('shareTripDetail');
        expect(componentSource).toMatch(/onShare\(\)[\s\S]*?shareTripDetail/);
        expect(componentSource).not.toContain('buildTripShareMessage');
        expect(componentSource).not.toContain('shareContent');
    });

    it('shows Invitar amistades al viaje below Compartir viaje for the owner', () => {
        expect(componentSource).toContain('canInviteFriendsToTrip');
        expect(componentSource).toContain('data-testid="trip-detail-invite-friends"');
        expect(componentSource).toContain("$t('invitarAmigosAlViaje')");
        expect(componentSource).not.toContain("$t('invitarGenteAlViaje')");
        expect(componentSource).toMatch(
            /data-testid="trip-detail-share"[\s\S]*data-testid="trip-detail-invite-friends"/
        );
        expect(componentSource).toContain('showInviteFriendsModal');
        expect(componentSource).toContain('maybeOpenInviteFriendsFromQuery');
        expect(componentSource).toContain('isInviteFriendsBlockedByUnpaidSellado');
    });
});
