import { describe, expect, it } from 'vitest';
import messages from './i18n';

const FRIENDS_OVERHAUL_LABELS_ES = {
    invitarAmigos: 'Invitar a amigos',
    recibirAlertasViajeAmigo: 'Recibir alertas de viaje de este amigo',
    detenerAlertasViajeAmigo: 'Dejar de recibir alertas de viaje de este amigo',
    aceptarPedidosAmigosAutomaticamente:
        'Aceptar pedidos de asiento de amigos automáticamente',
    queresInvitarTusAmigos: '¿Querés invitar a tus amigos a este viaje?',
    invitarATodosMisAmigos: 'Invitar a todos mis amigos',
    invitarAmigosAlViaje: 'Invitar amigos al viaje',
    viajesDeMisAmigos: 'Viajes de mis amigos',
    otrosViajes: 'Otros viajes',
    tenesInvitacionesAmigosClickParaVerlas:
        'Tenés invitaciones a amigos, click acá para verlas',
    noVolverAMostrarInvitarAmigos: 'No volver a mostrar invitar amigos',
    solicitudAmistadEnviada: 'Enviada',
    solicitudesDeAmigoPendientes: 'Solicitudes de amigo pendientes',
    quitarSolicitudAmigo: 'Quitar'
};

const FRIENDS_OVERHAUL_LABELS_BY_LOCALE = {
    arg: FRIENDS_OVERHAUL_LABELS_ES,
    chl: FRIENDS_OVERHAUL_LABELS_ES,
    en: {
        invitarAmigos: 'Invite friends',
        recibirAlertasViajeAmigo: 'Receive trip alerts from this friend',
        detenerAlertasViajeAmigo: 'Stop receiving trip alerts from this friend',
        aceptarPedidosAmigosAutomaticamente:
            'Automatically accept seat requests from friends',
        queresInvitarTusAmigos: 'Do you want to invite your friends to this trip?',
        invitarATodosMisAmigos: 'Invite all my friends',
        invitarAmigosAlViaje: 'Invite friends to the trip',
        viajesDeMisAmigos: 'My friends trips',
        otrosViajes: 'Other trips',
        tenesInvitacionesAmigosClickParaVerlas:
            'You have friend invitations, click here to see them',
        noVolverAMostrarInvitarAmigos: 'Do not show invite friends again',
        solicitudAmistadEnviada: 'Sent',
        solicitudesDeAmigoPendientes: 'Pending friend requests sent',
        quitarSolicitudAmigo: 'Remove'
    }
};

describe('friends overhaul labels (i18n)', () => {
    it.each(Object.entries(FRIENDS_OVERHAUL_LABELS_BY_LOCALE))(
        '%s locale exposes friends overhaul copy',
        (locale, expected) => {
            Object.entries(expected).forEach(([key, label]) => {
                expect(messages[locale][key]).toBe(label);
            });
        }
    );
});
