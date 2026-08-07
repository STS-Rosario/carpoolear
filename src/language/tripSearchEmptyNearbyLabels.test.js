import { describe, expect, it } from 'vitest';
import messages from './i18n';

const KEYS = [
    'searchNoResultsTitle',
    'searchNoResultsAlertQuestion',
    'searchCreateAlertNow',
    'searchOr',
    'searchSeeNearbyTrips',
    'viajesCercanos',
    'viajesCercanosSubtitle'
];

describe('trip search empty and nearby labels', () => {
    it.each(['arg', 'chl', 'en'])('%s has empty/nearby search copy', (locale) => {
        KEYS.forEach((key) => {
            expect(messages[locale][key]).toBeTruthy();
        });
    });

    it('uses Viajes cercanos heading in Spanish', () => {
        expect(messages.arg.viajesCercanos).toBe('Viajes cercanos');
        expect(messages.arg.searchNoResultsTitle).toBe(
            'No encontramos resultados para tu búsqueda'
        );
        expect(messages.arg.searchSeeNearbyTrips).toBe(
            'Ver viajes cercanos (+- 3 días)'
        );
    });
});
