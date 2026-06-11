import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'AdminUserTrips.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('AdminUserTrips view', () => {
    it('loads trips for the routed user in admin tables', () => {
        expect(source).toContain('AdminLayout');
        expect(source).toContain("name: 'admin-users-user'");
        expect(source).toContain('tripAsDriver');
        expect(source).toContain('oldTripsAsPassenger');
        expect(source).toContain('AdminUserTripsTable');
    });

    it('uses AdminUserTripsTable for each trip section', () => {
        expect(source).toContain("import AdminUserTripsTable from '../elements/AdminUserTripsTable.vue'");
        expect(source).toMatch(/<AdminUserTripsTable[\s\S]*:trips="driverTrips"/);
        expect(source).toMatch(/<AdminUserTripsTable[\s\S]*:trips="passengerTrips"/);
        expect(source).toMatch(/<AdminUserTripsTable[\s\S]*:trips="oldDriverTrips"/);
        expect(source).toMatch(/<AdminUserTripsTable[\s\S]*:trips="oldPassengerTrips"/);
    });

    it('reloads trips after admin cancels one', () => {
        expect(source).toContain('onTripCanceled');
        expect(source).toContain('remove');
        expect(source).toContain('fetchTripLists');
    });

    it('opens trip detail in admin popup modal', () => {
        expect(source).toContain("import tripDisplay from '../sections/TripDisplay'");
        expect(source).toContain('<tripDisplay');
        expect(source).toContain('openTripDetail');
        expect(source).toContain('closeTripDetail');
        expect(source).toContain('v-on:open-detail="openTripDetail"');
    });
});
