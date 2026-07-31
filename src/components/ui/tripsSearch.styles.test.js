import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'AppSegmentToggle.vue');
const fieldPath = path.resolve(__dirname, 'AppField.vue');
const searchTripPath = path.resolve(
    __dirname,
    '../sections/SearchTrip.vue'
);
const tripsPath = path.resolve(__dirname, '../views/Trips.vue');
const tripsSearchCssPath = path.resolve(
    __dirname,
    '../../styles/components/trips-search.css'
);

const toggleSource = fs.readFileSync(componentPath, 'utf8');
const fieldSource = fs.readFileSync(fieldPath, 'utf8');
const searchTripSource = fs.readFileSync(searchTripPath, 'utf8');
const tripsSource = fs.readFileSync(tripsPath, 'utf8');
const tripsSearchCss = fs.readFileSync(tripsSearchCssPath, 'utf8');

describe('AppSegmentToggle', () => {
    it('supports option list and v-model updates', () => {
        expect(toggleSource).toContain('app-segment-toggle');
        expect(toggleSource).toContain("emits: ['update:modelValue']");
        expect(toggleSource).toContain('app-segment-toggle__option--active');
    });
});

describe('AppField', () => {
    it('supports labels, optional marker, icons, and slotted controls', () => {
        expect(fieldSource).toContain('app-field__optional');
        expect(fieldSource).toContain('iconLeft');
        expect(fieldSource).toContain('actionRight');
    });
});

describe('trips search redesign integration', () => {
    it('uses reusable toggle and field components in SearchTrip', () => {
        expect(searchTripSource).toContain('AppSegmentToggle');
        expect(searchTripSource).toContain('AppField');
        expect(searchTripSource).toContain('AppButton');
        expect(searchTripSource).toContain('comoConductor');
        expect(searchTripSource).toContain('comoPasajero');
        expect(searchTripSource).toContain('setPassengerMode');
    });

    it('shows mobile home role cards that open search', () => {
        expect(tripsSource).toContain('trips-mobile-home__role-grid');
        expect(tripsSource).toContain('openMobileSearch');
        expect(tripsSource).toContain('viajesPublicados');
    });

    it('styles the trips search shell and mobile home', () => {
        expect(tripsSearchCss).toContain('.trips-search__hero-title');
        expect(tripsSearchCss).toContain('.trips-mobile-home__role-card');
        expect(tripsSearchCss).toContain('.trips-search__foreign-box');
    });

    it('keeps the desktop search card aligned with the trips list width', () => {
        expect(tripsSearchCss).toMatch(
            /\.trips\.container\s*>\s*\.trips-search,\s*\.trips\.container\s*>\s*\.trips-list\s*\{[^}]*padding-left:\s*0/
        );
        expect(tripsSearchCss).toMatch(
            /\.trips\.container\s*>\s*\.trips-search,\s*\.trips\.container\s*>\s*\.trips-list\s*\{[^}]*padding-right:\s*0/
        );
    });
});
