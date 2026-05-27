import { describe, expect, it } from 'vitest';
import messages from './i18n';

const SECTION_LABELS_ES = {
    misProximosViajes: 'Próximos viajes como conductor',
    viajesEstoySubido: 'Próximos viajes como pasajero',
    misViajesPasados: 'Viajes pasados como conductor',
    viajesMeSubi: 'Viajes pasados como pasajero'
};

/** My-trips / profile-trip section headings (upcoming vs past, driver vs passenger). */
const SECTION_LABELS_BY_LOCALE = {
    arg: SECTION_LABELS_ES,
    chl: SECTION_LABELS_ES,
    en: {
        misProximosViajes: 'Upcoming trips as driver',
        viajesEstoySubido: 'Upcoming trips as passenger',
        misViajesPasados: 'Past trips as driver',
        viajesMeSubi: 'Past trips as passenger'
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
