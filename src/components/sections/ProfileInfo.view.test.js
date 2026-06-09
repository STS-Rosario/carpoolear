import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'ProfileInfo.vue');
const i18nPath = path.resolve(__dirname, '../../language/i18n.js');
const viewSource = fs.readFileSync(viewPath, 'utf8');
const i18nSource = fs.readFileSync(i18nPath, 'utf8');

describe('ProfileInfo member stats', () => {
    it('shows member since and participated trips below rating counters', () => {
        const ratingsIndex = viewSource.indexOf('profile-info--ratings');
        const memberSinceIndex = viewSource.indexOf("$t('miembroDesde'");
        const tripsIndex = viewSource.indexOf("$t('perfilViajesParticipados'");

        expect(ratingsIndex).toBeGreaterThan(-1);
        expect(memberSinceIndex).toBeGreaterThan(ratingsIndex);
        expect(tripsIndex).toBeGreaterThan(memberSinceIndex);
        expect(viewSource).toContain('formatMemberSinceMonthYear');
        expect(viewSource).toContain('normalizeTripsCount');
        expect(viewSource).toContain('profile-info--member-stats');
        expect(viewSource).toMatch(/\.profile-info\s*\{[\s\S]*align-items:\s*center/);
        expect(viewSource).toMatch(
            /\.profile-info--member-stats\s*\{[\s\S]*text-align:\s*center/
        );
    });

    it('keeps member stats copy in i18n', () => {
        expect(i18nSource).toContain('miembroDesde');
        expect(i18nSource).toContain('perfilViajesParticipados');
        expect(i18nSource).toContain('Miembro desde: {date}');
        expect(i18nSource).toContain('{count} viajes');
        expect(i18nSource).toContain('Member since: {date}');
        expect(i18nSource).toContain('{count} trips');
    });
});

describe('ProfileInfo cars display', () => {
    it('lists all active patentes when viewing a profile', () => {
        expect(viewSource).toContain('activeCarsWithPlate');
        expect(viewSource).toContain('visibleCars');
        expect(viewSource).toContain('v-for="car in visibleCars"');
        expect(viewSource).toContain('profile-car-patente');
        expect(viewSource).not.toContain('profile.cars[0].patente');
    });
});

describe('ProfileInfo friend actions', () => {
    it('shows invite button with person icon for other users without friendship', () => {
        expect(viewSource).toContain('profile-friend-actions');
        expect(viewSource).toContain("$t('invitarAmigos')");
        expect(viewSource).toContain('fa-user');
        expect(viewSource).toContain('onInviteFriend');
        expect(viewSource).toContain("friendship_state === 'none'");
    });

    it('shows sent-request state when friendship is pending_sent', () => {
        expect(viewSource).toContain("friendship_state === 'pending_sent'");
        expect(viewSource).toContain("$t('solicitudEnviada')");
    });

    it('shows accept and reject for incoming friend requests', () => {
        expect(viewSource).toContain("friendship_state === 'pending_received'");
        expect(viewSource).toContain('onAcceptFriend');
        expect(viewSource).toContain('onRejectFriend');
        expect(viewSource).toContain("$t('aceptar')");
        expect(viewSource).toContain("$t('rechazar')");
    });

    it('wires friend actions through friends store', () => {
        expect(viewSource).toContain('useFriendsStore');
        expect(viewSource).toContain('requestFriend');
        expect(viewSource).toContain('acceptFriend');
        expect(viewSource).toContain('rejectFriend');
    });
});

describe('ProfileInfo friend trip alerts toggle', () => {
    it('shows receive alerts button label with friend name when alerts are disabled', () => {
        expect(viewSource).toContain("friendship_state === 'friend'");
        expect(viewSource).toContain('friend_trip_alerts_enabled');
        expect(viewSource).toContain('tripAlertsButtonLabel');
        expect(viewSource).toContain("$t('recibirAlertasViajeAmigo', params)");
        expect(viewSource).toContain("$t('detenerAlertasViajeAmigo', params)");
        expect(viewSource).toContain('onToggleTripAlerts');
    });

    it('shows snackbar feedback when toggling friend trip alerts', () => {
        expect(viewSource).toContain("import dialogs from '../../services/dialogs.js'");
        expect(viewSource).toContain("'alertasViajeAmigoActivadas'");
        expect(viewSource).toContain("'alertasViajeAmigoDesactivadas'");
        expect(viewSource).toContain("this.$t('errorAlertasViajeAmigo')");
        expect(viewSource).toContain("estado: 'success'");
        expect(viewSource).toContain("estado: 'error'");
        expect(viewSource).toContain('toggleTripAlerts');
    });

    it('patches trip alerts through profile store without reloading the profile', () => {
        const onToggleTripAlerts = viewSource.match(
            /onToggleTripAlerts\(\)\s*\{[\s\S]*?\n        \},/
        );

        expect(onToggleTripAlerts).not.toBeNull();
        expect(onToggleTripAlerts[0]).toContain('setFriendTripAlertsEnabled');
        expect(onToggleTripAlerts[0]).not.toContain('setProfileUser');
    });
});
