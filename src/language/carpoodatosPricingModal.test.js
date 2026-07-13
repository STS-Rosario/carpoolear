import { describe, expect, it } from 'vitest';
import messages from './i18n';

const SPANISH_LOCALES = ['arg', 'chl'];

const EXPECTED_COPY = {
    carpoodatosAntesConfirmar:
        'Antes de solicitar asiento, revisá el detalle del viaje y coordiná :',
    carpoodatosAntesConfirmarBullet1:
        'Punto de encuentro para la salida y la llegada.',
    carpoodatosAntesConfirmarBullet2: 'Horario de salida.',
    carpoodatosAntesConfirmarBullet3: 'Tamaño del equipaje.',
    carpoodatosAntesConfirmarBullet4:
        'Contribución para combustible y peajes.',
    carpoodatosAntesConfirmarBullet5:
        'Cualquier otra cuestión que consideren importante para compartir el viaje.',
    carpoodatosContribucionMaxima:
        'La contribución máxima es el costo del combustible y los peajes dividido por la cantidad de asientos del vehículo.',
    carpoodatosContribucionComprobantes:
        'Durante la coordinación previa al viaje, cualquiera de las personas participantes puede solicitar que ese cálculo se realice con los comprobantes de combustible y peajes.',
    carpoodatosAntesConfirmarDudaLead:
        'Si tenés alguna duda o surge algún inconveniente, ',
    carpoodatosAntesConfirmarDudaLink: 'escribinos a la Mesa de Ayuda',
    carpoodatosAntesConfirmarDudaTail: ''
};

describe('carpoodatos pricing modal copy', () => {
    it.each(SPANISH_LOCALES)(
        '%s locale uses the updated seat-request coordination copy',
        (locale) => {
            Object.entries(EXPECTED_COPY).forEach(([key, value]) => {
                expect(messages[locale][key]).toBe(value);
            });
        }
    );

    it('does not keep the old confirm-trip intro copy in Spanish locales', () => {
        const oldCopy =
            'Antes de confirmar el viaje y para evitar sorpresas, tené en cuenta de coordinar y acordar el punto de encuentro, el horario, la disponibilidad de espacio para equipaje, la cantidad total de pasajeros y la contribución por los gastos de combustible y peaje.';

        SPANISH_LOCALES.forEach((locale) => {
            expect(messages[locale].carpoodatosAntesConfirmar).not.toBe(
                oldCopy
            );
        });
    });

    it('en locale defines the pricing modal coordination keys', () => {
        const keys = Object.keys(EXPECTED_COPY);

        keys.forEach((key) => {
            expect(messages.en[key]).toBeTruthy();
        });
    });
});
