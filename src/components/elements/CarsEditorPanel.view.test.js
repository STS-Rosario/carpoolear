import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const componentPath = path.join(__dirname, 'CarsEditorPanel.vue');
const source = fs.readFileSync(componentPath, 'utf8');

describe('CarsEditorPanel', () => {
    it('provides shared cars CRUD for profile and create trip flows', () => {
        expect(source).toContain('carIndex');
        expect(source).toContain('openEditCar');
        expect(source).toContain('openAddCar');
        expect(source).toContain('deleteCar');
        expect(source).toContain('CarForm');
    });

    it('reloads cars when panel becomes active', () => {
        expect(source).toContain('active');
        expect(source).toMatch(/watch:\s*\{[\s\S]*active/s);
    });
});
