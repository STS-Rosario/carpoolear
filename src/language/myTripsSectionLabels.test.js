import { describe, expect, it } from 'vitest';
import messages from './i18n';

/** My-trips / profile-trip section headings (upcoming vs past, driver vs passenger). */
const SECTION_LABELS_BY_LOCALE = {
    arg: {
        misProximosViajes: 'Mis próximos viajes como conductor',
        viajesEstoySubido: 'Mis próximos viajes como pasajero',
        misViajesPasados: 'Mis viajes pasados como conductor',
        viajesMeSubi: 'Mis viajes pasados como pasajero'
    },
    chl: {
        misProximosViajes: 'Mis próximos viajes como conductor',
        viajesEstoySubido: 'Mis próximos viajes como pasajero',
        misViajesPasados: 'Mis viajes pasados como conductor',
        viajesMeSubi: 'Mis viajes pasados como pasajero'
    },
    en: {
        misProximosViajes: 'My upcoming trips as driver',
        viajesEstoySubido: 'My upcoming trips as passenger',
        misViajesPasados: 'My past trips as driver',
        viajesMeSubi: 'My past trips as passenger'
    }
};

describe('my trips section labels (i18n)', () => {
    it.each(Object.entries(SECTION_LABELS_BY_LOCALE))(
        '%s locale distinguishes driver and passenger for upcoming and past trips',
        (locale, expected) => {
            Object.entries(expected).forEach(([key, label]) => {
                expect(messages[locale][key]).toBe(label);
            });
        }
    );
});
