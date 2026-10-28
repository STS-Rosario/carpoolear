import { describe, expect, it } from 'vitest';
import {
    patchLibertyStyleForSpanishLabels,
    patchTextFieldExpression,
    spanishPlaceNameExpression
} from './mapStyleSpanishLabels.js';

const LIBERTY_LABEL_COUNTRY = [
    'case',
    ['has', 'name:nonlatin'],
    ['concat', ['get', 'name:latin'], '\n', ['get', 'name:nonlatin']],
    ['coalesce', ['get', 'name_en'], ['get', 'name']]
];

describe('mapStyleSpanishLabels', () => {
    it('spanishPlaceNameExpression prefers name:es and maps Stanley to Puerto Argentino', () => {
        expect(spanishPlaceNameExpression()[0]).toBe('case');
        expect(JSON.stringify(spanishPlaceNameExpression())).toContain('name:es');
        expect(JSON.stringify(spanishPlaceNameExpression())).toContain('Puerto Argentino');
        expect(JSON.stringify(spanishPlaceNameExpression())).toContain('Stanley');
    });

    it('patchTextFieldExpression replaces Liberty name_en/name coalesce branch', () => {
        const patched = patchTextFieldExpression(LIBERTY_LABEL_COUNTRY);
        expect(patched[3]).toEqual(spanishPlaceNameExpression());
    });

    it('patchLibertyStyleForSpanishLabels updates symbol layers only', () => {
        const style = {
            layers: [
                {
                    id: 'label_country_1',
                    type: 'symbol',
                    layout: { 'text-field': LIBERTY_LABEL_COUNTRY }
                },
                {
                    id: 'highway-shield',
                    type: 'symbol',
                    layout: { 'text-field': ['to-string', ['get', 'ref']] }
                },
                { id: 'park', type: 'fill' }
            ]
        };
        const patched = patchLibertyStyleForSpanishLabels(style);
        expect(patched.layers[0].layout['text-field'][3]).toEqual(spanishPlaceNameExpression());
        expect(patched.layers[1].layout['text-field']).toEqual(['to-string', ['get', 'ref']]);
    });
});
