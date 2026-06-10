import { describe, expect, it } from 'vitest';
import {
    filterTripPointsForSave,
    getIntermediatePoints,
    removeEmptyIntermediatePoints
} from './tripCreationPoints.js';

describe('tripCreationPoints', () => {
    const origin = {
        id: 0,
        name: 'Rosario',
        json: { country: 'AR' },
        location: { lat: 1, lng: 2 },
        place: { id: 1 }
    };
    const destination = {
        id: 2,
        name: 'Buenos Aires',
        json: { country: 'AR' },
        location: { lat: 3, lng: 4 },
        place: { id: 2 }
    };
    const filledStop = {
        id: 1,
        name: 'San Nicolas',
        json: { country: 'AR' },
        location: { lat: 5, lng: 6 },
        place: { id: 3 }
    };
    const emptyStop = {
        id: 99,
        name: '',
        json: null,
        location: null,
        place: null
    };

    it('returns only middle points between origin and destination', () => {
        expect(
            getIntermediatePoints([origin, filledStop, destination])
        ).toEqual([filledStop]);
        expect(getIntermediatePoints([origin, destination])).toEqual([]);
    });

    it('removes empty intermediate placeholders while keeping endpoints', () => {
        expect(
            removeEmptyIntermediatePoints([origin, emptyStop, destination])
        ).toEqual([origin, destination]);
        expect(
            removeEmptyIntermediatePoints([
                origin,
                filledStop,
                emptyStop,
                destination
            ])
        ).toEqual([origin, filledStop, destination]);
    });

    it('filters out incomplete points before saving a trip', () => {
        expect(
            filterTripPointsForSave([origin, emptyStop, filledStop, destination])
        ).toEqual([origin, filledStop, destination]);
    });
});
