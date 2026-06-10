import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TripDriver.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('TripDriver profile navigation', () => {
    it('uses router-link with a shared visible-link class instead of click handlers', () => {
        expect(source).toContain('trip-driver-profile-link');
        expect(source).toContain('<router-link');
        expect(source).toContain(':to="driverProfileRoute"');
        expect(source).not.toMatch(/@click="goToProfile/);
        expect(source).not.toMatch(/v-on:click="goToProfile/);
    });

    it('links the driver profile image in the light theme card heading', () => {
        expect(source).toMatch(
            /trip_driver_img_container[\s\S]*?<router-link[\s\S]*?trip_driver_img/
        );
    });

    it('links the driver name in the light theme card heading', () => {
        expect(source).toMatch(
            /trip_driver_details[\s\S]*?<router-link[\s\S]*?trip_driver_name/
        );
    });

    it('links the driver profile image and name in the sidebar driver-profile layout', () => {
        expect(source).toMatch(
            /driver-profile[\s\S]*?<router-link[\s\S]*?trip_driver_img/
        );
        expect(source).toMatch(
            /driver-data[\s\S]*?<router-link[\s\S]*?trip\.user\.name/
        );
    });

    it('styles profile links with pointer cursor', () => {
        expect(source).toMatch(
            /\.trip-driver-profile-link\s*\{[\s\S]*?cursor:\s*pointer/
        );
    });
});
