import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const componentPath = path.join(__dirname, 'TripCarsModal.vue');

describe('TripCarsModal', () => {
    it('defines modal component for editing cars without leaving create trip', () => {
        expect(fs.existsSync(componentPath)).toBe(true);
    });

    it('provides cars CRUD inside a modal', () => {
        const source = fs.readFileSync(componentPath, 'utf8');

        expect(source).toContain('carIndex');
        expect(source).toContain('openEditCar');
        expect(source).toContain('openAddCar');
        expect(source).toContain('deleteCar');
        expect(source).toContain('CarForm');
        expect(source).toContain("@close=\"$emit('close')\"");
    });
});
