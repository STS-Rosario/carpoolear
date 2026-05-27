import { describe, expect, it } from 'vitest';
import messages from './i18n';

const EXPECTED_ARG = {
    misProximosViajes: 'Mis próximos viajes como conductor',
    viajesEstoySubido: 'Mis próximos viajes como pasajero',
    misViajesPasados: 'Mis viajes pasados como conductor',
    viajesMeSubi: 'Mis viajes pasados como pasajero'
};

const EXPECTED_EN = {
    misProximosViajes: 'My upcoming trips as driver',
    viajesEstoySubido: 'My upcoming trips as passenger',
    misViajesPasados: 'My past trips as driver',
    viajesMeSubi: 'My past trips as passenger'
};

function expectMyTripsSectionLabels(localeMessages, expected) {
    Object.entries(expected).forEach(([key, label]) => {
        expect(localeMessages[key]).toBe(label);
    });
}

describe('my trips section labels (i18n)', () => {
    it('arg locale distinguishes driver and passenger for upcoming and past trips', () => {
        expectMyTripsSectionLabels(messages.arg, EXPECTED_ARG);
    });

    it('chl locale matches arg for my trips section headings', () => {
        expectMyTripsSectionLabels(messages.chl, EXPECTED_ARG);
    });

    it('en locale distinguishes driver and passenger for upcoming and past trips', () => {
        expectMyTripsSectionLabels(messages.en, EXPECTED_EN);
    });
});
