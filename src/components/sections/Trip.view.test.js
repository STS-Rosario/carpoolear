import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'Trip.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('Trip card quick actions', () => {
    it('does not link My Trips cards to the passenger-only trip detail route', () => {
        expect(source).not.toContain("location: 'passenger'");
        expect(source).not.toContain("$t('verPasajerosSubidos')");
        expect(source).not.toContain('detail_trip_location');
    });
});

describe('Trip clickModal', () => {
    it('opens modal from the trip card only, not the modal wrapper', () => {
        const wrapperOpen = source.match(
            /:class="\[tripCardCountClass, \{ 'trip-needs-sellado': trip\.needs_sellado \}\]"\s*\n\s*v-on:click="clickModal/
        );
        expect(wrapperOpen).toBeNull();

        expect(source).toMatch(
            /class="trip"[\s\S]*?v-on:click="clickModal \? openModal\(\) : goToDetail\(false\)"/
        );
    });

    it('stops click propagation on trip display so dismiss does not reopen', () => {
        expect(source).toMatch(
            /<tripDisplay[\s\S]*@click\.stop/
        );
    });
});
