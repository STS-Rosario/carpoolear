import { describe, expect, it } from 'vitest';
import messages from './i18n';

const FRIENDS_OVERHAUL_LABELS_ES = {
    invitarAmigos: 'Invitar a amigos',
    recibirAlertasViajeAmigo: 'Recibir alertas de viaje de {name}',
    detenerAlertasViajeAmigo: 'No recibir más alertas de viaje de {name}',
    alertasViajeAmigoActivadas: 'Ahora recibirás alertas de viaje de {name}',
    alertasViajeAmigoDesactivadas:
        'Ya no recibirás alertas de viaje de {name}',
    errorAlertasViajeAmigo:
        'No pudimos actualizar las alertas de viaje. Intentá de nuevo.',
    aceptarPedidosAmigosAutomaticamente:
        'Aceptar pedidos de asiento de amigos automáticamente',
    queresInvitarTusAmigos: '¿Querés invitar a tus amigos a este viaje?',
    invitarATodosMisAmigos: 'Invitar a todos mis amigos',
    invitarAmigosAlViaje: 'Invitar amigos al viaje',
    viajesDeMisAmigos: 'Viajes de mis amigos',
    otrosViajes: 'Otros viajes',
    tenesInvitacionesAmigosClickParaVerlas:
        'Tenés invitaciones a amigos, click acá para verlas',
    tenesInvitacionesAmigosAntesClick: 'Tenés invitaciones de amigos,',
    clickAca: 'click acá',
    paraVerlasInvitacionesAmigos: 'para verlas',
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
        recibirAlertasViajeAmigo: 'Receive trip alerts from {name}',
        detenerAlertasViajeAmigo: 'Stop receiving trip alerts from {name}',
        alertasViajeAmigoActivadas:
            'You will now receive trip alerts from {name}',
        alertasViajeAmigoDesactivadas:
            'You will no longer receive trip alerts from {name}',
        errorAlertasViajeAmigo:
            'Could not update trip alerts. Please try again.',
        aceptarPedidosAmigosAutomaticamente:
            'Automatically accept seat requests from friends',
        queresInvitarTusAmigos: 'Do you want to invite your friends to this trip?',
        invitarATodosMisAmigos: 'Invite all my friends',
        invitarAmigosAlViaje: 'Invite friends to the trip',
        viajesDeMisAmigos: 'My friends trips',
        otrosViajes: 'Other trips',
        tenesInvitacionesAmigosClickParaVerlas:
            'You have friend invitations, click here to see them',
        tenesInvitacionesAmigosAntesClick: 'You have friend invitations,',
        clickAca: 'click here',
        paraVerlasInvitacionesAmigos: 'to see them',
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
