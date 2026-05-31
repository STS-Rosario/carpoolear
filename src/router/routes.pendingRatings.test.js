import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const routesPath = path.resolve(__dirname, 'routes.js');
const routesSource = fs.readFileSync(routesPath, 'utf8');

describe('routes pending ratings enforcement', () => {
    it('imports requirePendingRatingsSubmission middleware', () => {
        expect(routesSource).toContain('requirePendingRatingsSubmission');
    });

    it('chains pending ratings check after identity validation on restricted routes', () => {
        expect(routesSource).toContain(
            'requireIdentityValidation(to, from, () => {\n                requirePendingRatingsSubmission(to, from, () => {'
        );
    });
});

describe('restricted action components pending ratings redirect', () => {
    const componentPaths = [
        '../components/views/Trip.vue',
        '../components/views/NewTrip.vue',
        '../components/views/ConversationChat.vue',
        '../components/elements/CoordinateTrip.vue',
        '../components/PendingRequest.vue'
    ];

    it.each(componentPaths)('%s checks pending ratings before restricted actions', (relativePath) => {
        const source = fs.readFileSync(
            path.resolve(__dirname, relativePath),
            'utf8'
        );
        expect(source).toContain(
            '$redirectToMyTripsIfPendingRatingsRequired()'
        );
    });
});
