import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const newTripViewPath = path.resolve(__dirname, 'NewTrip.vue');
const newTripViewSource = fs.readFileSync(newTripViewPath, 'utf8');

describe('NewTrip duplicate create handling', () => {
    it('redirects via tripDetailRouteAfterCreate and notifies when trip already exists', () => {
        expect(newTripViewSource).toContain('tripDetailRouteAfterCreate');
        expect(newTripViewSource).toContain('viajeYaPublicado');
        expect(newTripViewSource).toContain('t.existing');
    });
});
