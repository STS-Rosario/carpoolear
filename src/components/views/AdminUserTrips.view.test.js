import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminUserTrips.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('AdminUserTrips view', () => {
    it('loads trips for the routed user with admin trip modal', () => {
        expect(source).toContain('AdminLayout');
        expect(source).toContain("name: 'admin-users-user'");
        expect(source).toContain('tripAsDriver');
        expect(source).toContain('oldTripsAsPassenger');
        expect(source).toContain(':clickModal="true"');
    });

    it('uses Trip clickModal for admin trip inspection', () => {
        expect(source).toContain("import Trip from '../sections/Trip.vue'");
        expect(source).toMatch(/<Trip[\s\S]*:clickModal="true"/);
    });
});
