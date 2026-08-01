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
});
