import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'ProfileInfo.vue');
const i18nPath = path.resolve(__dirname, '../../language/i18n.js');
const profilePageCssPath = path.resolve(
    __dirname,
    '../../styles/components/profile-page.css'
);
const viewSource = fs.readFileSync(viewPath, 'utf8');
const i18nSource = fs.readFileSync(i18nPath, 'utf8');
const profilePageCss = fs.readFileSync(profilePageCssPath, 'utf8');

describe('ProfileInfo public panel', () => {
    it('renders sobre mi, identity tile, privacy note without duplicating header identity', () => {
        expect(viewSource).toContain('profile-info-panel');
        expect(viewSource).toContain("$t('sobreMi')");
        expect(viewSource).toContain("$t('identidadVerificadaTitulo')");
        expect(viewSource).toContain("$t('contactoPrivacidadPerfil')");
        expect(viewSource).not.toContain('UserRatingsCounts');
        expect(viewSource).not.toContain('profile-info--ratings');
        expect(viewSource).not.toContain('profile-info--member-stats');
        expect(viewSource).not.toContain('circle-box profile');
        expect(viewSource).not.toContain('fa-smile');
    });

    it('always shows identity tile with verified or unverified copy', () => {
        expect(viewSource).toContain("$t('identidadVerificadaTitulo')");
        expect(viewSource).toContain("$t('identidadVerificadaSub')");
        expect(viewSource).toContain("$t('identidadNoVerificadaTitulo')");
        expect(viewSource).toContain("$t('identidadNoVerificadaSub')");
        expect(viewSource).not.toMatch(
            /v-if="isIdentityVerified"[\s\S]*?identidadVerificadaTitulo/
        );
        expect(viewSource).toContain('profile-info-panel__tile-icon-wrap--verified');
        expect(viewSource).toContain('profile-info-panel__tile-icon--verified');
    });

    it('shows shield when verified and person icon when unverified', () => {
        expect(viewSource).toMatch(/['"]fa-shield['"]:\s*isIdentityVerified/);
        expect(viewSource).toMatch(/['"]fa-user['"]:\s*!isIdentityVerified/);
    });

    it('centers tile icons and beats legacy floated profile icons', () => {
        expect(profilePageCss).toMatch(
            /\.profile-page\s+\.profile-info-component\s+\.profile-info-panel__tile-icon\s*\{[^}]*float:\s*none/
        );
        expect(profilePageCss).toMatch(
            /\.profile-page\s+\.profile-info-component\s+\.profile-info-panel__tile-icon-wrap\s*\{[^}]*align-items:\s*center/
        );
        expect(profilePageCss).toMatch(
            /\.profile-page\s+\.profile-info-component\s+\.profile-info-panel__tile-icon-wrap\s*\{[^}]*justify-content:\s*center/
        );
        expect(profilePageCss).toMatch(
            /\.profile-page\s+\.profile-info-component\s+\.profile-info-panel__tile-icon-wrap--verified\s*\{[^}]*background:/
        );
        expect(profilePageCss).toMatch(
            /\.profile-page\s+\.profile-info-component\s+\.profile-info-panel__tile-icon--verified\s*\{[^}]*color:\s*var\(--profile-verified/
        );
    });

    it('always shows response tile when the conversation delay module is on', () => {
        expect(viewSource).toContain('showResponseTile');
        expect(viewSource).toContain("respondeMensajesPorcentaje");
        expect(viewSource).toContain("$t('sinDatosRespuestaTitulo')");
        expect(viewSource).toContain("$t('sinDatosRespuestaSub')");
        expect(viewSource).toContain('module_conversation_average_delay');
    });

    it('keeps profile panel copy in i18n', () => {
        expect(i18nSource).toContain('sobreMi');
        expect(i18nSource).toContain('identidadVerificadaTitulo');
        expect(i18nSource).toContain('identidadVerificadaSub');
        expect(i18nSource).toContain('identidadNoVerificadaTitulo');
        expect(i18nSource).toContain('identidadNoVerificadaSub');
        expect(i18nSource).toContain('sinDatosRespuestaTitulo');
        expect(i18nSource).toContain('sinDatosRespuestaSub');
        expect(i18nSource).toContain('contactoPrivacidadPerfil');
        expect(i18nSource).toContain('usuarioVerificado');
        expect(i18nSource).toContain(
            "Identidad no verificada"
        );
        expect(i18nSource).toContain(
            'Este usuario aún debe verificar su identidad'
        );
        expect(i18nSource).toContain('Sin datos de respuesta aún');
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

    it('shows Enviando solicitud while invite is in flight', () => {
        expect(viewSource).toContain("$t('enviandoSolicitudAmistad')");
        expect(viewSource).toMatch(
            /friendship_state === 'none'[\s\S]*?friendActionLoading[\s\S]*?enviandoSolicitudAmistad[\s\S]*?invitarAmigos/
        );
        expect(i18nSource).toMatch(
            /enviandoSolicitudAmistad:\s*'Enviando solicitud'/
        );
        expect(i18nSource).toMatch(
            /enviandoSolicitudAmistad:\s*'Sending request'/
        );
    });

    it('shows danger cancel button when friendship is pending_sent', () => {
        expect(viewSource).toContain("friendship_state === 'pending_sent'");
        expect(viewSource).toContain("$t('cancelarSolicitudAmistad')");
        expect(viewSource).toContain('onCancelFriendRequest');
        expect(viewSource).not.toContain("$t('suSolicitudAmistadEnviada')");
        expect(i18nSource).toMatch(
            /cancelarSolicitudAmistad:\s*'Cancelar solicitud de amistad'/
        );
        expect(i18nSource).toMatch(
            /cancelarSolicitudAmistad:\s*'Cancel friend request'/
        );
    });

    it('does not render accept or reject buttons for incoming requests', () => {
        expect(viewSource).not.toMatch(
            /friendship_state === 'pending_received'[\s\S]*?onAcceptFriend/
        );
        expect(viewSource).not.toMatch(
            /friendship_state === 'pending_received'[\s\S]*?\$t\('aceptar'\)/
        );
        expect(viewSource).not.toContain('onAcceptFriend');
        expect(viewSource).not.toContain('onRejectFriend');
    });

    it('wires friend actions through friends store', () => {
        expect(viewSource).toContain('useFriendsStore');
        expect(viewSource).toContain('requestFriend');
        expect(viewSource).toContain('cancelFriendRequest');
        expect(viewSource).toContain("cancelFriendRequest: 'cancelRequest'");
    });
});

describe('ProfileInfo own profile actions', () => {
    it('does not duplicate account settings buttons covered by account nav', () => {
        expect(viewSource).not.toContain("name: 'profile_update'");
        expect(viewSource).not.toContain("name: 'friends_setting'");
        expect(viewSource).not.toContain("name: 'debug_setting'");
        expect(viewSource).not.toContain("name: 'transacciones'");
        expect(viewSource).not.toContain("name: 'identity_validation'");
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
        expect(viewSource).toContain(
            "import dialogs from '../../services/dialogs.js'"
        );
        expect(viewSource).toContain("'alertasViajeAmigoActivadas'");
        expect(viewSource).toContain("'alertasViajeAmigoDesactivadas'");
        expect(viewSource).toContain("this.$t('errorAlertasViajeAmigo')");
        expect(viewSource).toContain("estado: 'success'");
        expect(viewSource).toContain("estado: 'error'");
        expect(viewSource).toContain('toggleTripAlerts');
    });

    it('patches trip alerts through profile store without reloading the profile', () => {
        const onToggleTripAlerts = viewSource.match(
            /onToggleTripAlerts\(\)\s*\{[\s\S]*?\n {8}\},/
        );

        expect(onToggleTripAlerts).not.toBeNull();
        expect(onToggleTripAlerts[0]).toContain('setFriendTripAlertsEnabled');
        expect(onToggleTripAlerts[0]).not.toContain('setProfileUser');
    });

});
