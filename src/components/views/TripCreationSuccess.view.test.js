import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'TripCreationSuccess.vue');
const componentSource = fs.readFileSync(componentPath, 'utf8');

describe('TripCreationSuccess.vue', () => {
    it('offers a return-trip button for driver trips', () => {
        expect(componentSource).toContain('data-testid="trip-creation-return-trip"');
        expect(componentSource).toContain("$t('cargarViajeRegreso')");
        expect(componentSource).toContain("@start-return-trip");
        expect(componentSource).toContain('!trip.is_passenger');
    });
});
