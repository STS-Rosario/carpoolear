import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'TripCreationRoutePanel.vue');
const componentSource = fs.readFileSync(componentPath, 'utf8');

describe('TripCreationRoutePanel.vue', () => {
    it('shows route details without a collapsible toggle', () => {
        expect(componentSource).toContain('tripCreationRouteDetails');
        expect(componentSource).not.toContain('collapse-toggle');
        expect(componentSource).not.toContain('v-show');
    });

    it('renders map when route points are available', () => {
        expect(componentSource).toContain('hasRoute');
        expect(componentSource).toContain('data-testid="trip-creation-route-map"');
        expect(componentSource).toContain('L.Routing.control');
    });

    it('enables OSRM route alternatives on the map', () => {
        expect(componentSource).toContain('showAlternatives: true');
        expect(componentSource).toContain('selectedRouteIndex');
        expect(componentSource).toContain('$emit(\'route-index-selected\'');
        expect(componentSource).toContain('routesfound');
    });

    it('fits the map to the trip route instead of a fixed app zoom', () => {
        expect(componentSource).toContain('fitSelectedRoutes: true');
        expect(componentSource).not.toContain("fitSelectedRoutes: 'smart'");
        expect(componentSource).toContain('fitLeafletMapToLatLngs');
        expect(componentSource).toContain('bindRoutingMapFitOnRoutesFound');
    });

    it('shows a hint when multiple routes are available', () => {
        expect(componentSource).toContain('hasMultipleRouteOptions');
        expect(componentSource).toContain('tripCreationRouteAlternativesHint');
    });

    it('lays out distance, duration and carbon stats on one horizontal row', () => {
        expect(componentSource).toContain('trip-creation-route-panel__stats');
    });
});
