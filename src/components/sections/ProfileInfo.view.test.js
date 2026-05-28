import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'ProfileInfo.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('ProfileInfo cars display', () => {
    it('lists all active patentes when viewing a profile', () => {
        expect(viewSource).toContain('activeCarsWithPlate');
        expect(viewSource).toContain('visibleCars');
        expect(viewSource).toContain('v-for="car in visibleCars"');
        expect(viewSource).toContain('profile-car-patente');
        expect(viewSource).not.toContain('profile.cars[0].patente');
    });
});
