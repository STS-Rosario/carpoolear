import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TripDisplay.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('TripDisplay profile navigation', () => {
    it('uses router-link with a shared visible-link class instead of plain click handlers', () => {
        expect(source).toContain('trip-display-profile-link');
        expect(source).toContain('<router-link');
        expect(source).toContain(':to="{ name: \'profile\', params: { id:');
        expect(source).not.toMatch(/v-on:click="openProfile/);
    });

    it('styles profile links with pointer cursor and underline', () => {
        expect(source).toMatch(
            /\.trip-display-profile-link\s*\{[\s\S]*?cursor:\s*pointer/
        );
        expect(source).toMatch(/text-decoration:\s*underline/);
    });

    it('groups passenger request links via a helper', () => {
        expect(source).toContain('passengerRequestsByState');
    });
});
