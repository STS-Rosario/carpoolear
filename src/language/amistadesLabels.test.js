import { describe, expect, it } from 'vitest';
import messages from './i18n';

const AMISTADES_LABELS_ES = {
    amigos: 'Amistades',
    buscarAmigos: 'Buscar amistades',
    misAmigos: 'Mis amistades',
    verAmigos: 'Ver amistades',
    invitarAmigos: 'Invitar a amistades',
    queresInvitarTusAmigos: '¿Querés invitar a tus amistades a este viaje?',
    invitarATodosMisAmigos: 'Invitar a todas mis amistades',
    invitarAmigosAlViaje: 'Invitar amistades al viaje',
    invitarAmigosSelladoPendiente:
        'Una vez que pagues el sellado vas a poder invitar a tus amistades',
    viajesDeMisAmigos: 'Viajes de mis amistades',
    tenesInvitacionesAmigosClickParaVerlas:
        'Tenés invitaciones a amistades, click acá para verlas',
    tenesInvitacionesAmigosAntesClick: 'Tenés invitaciones de amistades,',
    noVolverAMostrarInvitarAmigos: 'No volver a mostrar invitar amistades',
    cargandoAmigos: 'Cargando amistades ...',
    noTienesNingunAmigoAun: 'No tienes ninguna amistad aún.',
    solicitudesDeAmigoPendientes: 'Solicitudes de amistad pendientes',
    quitarAmigo: 'Quitar amistad',
    buscarNuevosAmigos: 'Buscar nuevas amistades',
    deseaSerTuAmigo: 'desea ser tu amistad.',
    soloAmigos: 'Solo amistades',
    amigosamigos: 'Amistades de amistades',
    amigosDeAmigos: 'Amistades de amistades',
    visibilidadSoloAmigos: 'Visibilidad: Solo amistades',
    soloAmigosTooltip: 'Solo amistades.',
    visibilidadAmigosDeAmigos: 'Visibilidad: Amistades de amistades'
};

describe('amistades inclusive labels', () => {
    it.each(['arg', 'chl'])(
        '%s locale uses Amistades instead of Amigos in user-facing copy',
        (locale) => {
            Object.entries(AMISTADES_LABELS_ES).forEach(([key, label]) => {
                if (messages[locale][key] !== undefined) {
                    expect(messages[locale][key]).toBe(label);
                }
            });
        }
    );
});
