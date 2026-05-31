import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'ProfileTrip.vue');
const source = fs.readFileSync(viewPath, 'utf8');

function getTripComponentTags() {
    return source.match(/<Trip[\s\S]*?(?:\/>|<\/Trip>)/g) || [];
}

describe('ProfileTrip trip card navigation', () => {
    it('disables trip info modal on every trip card including past passenger trips', () => {
        const tripTags = getTripComponentTags();

        expect(tripTags.length).toBe(4);

        tripTags.forEach((tag) => {
            expect(tag).toContain(':clickModal="false"');
        });
    });

    it('does not open admin trip modal when viewing another user profile', () => {
        expect(source).not.toContain(':clickModal="user.is_admin"');
        expect(source).not.toContain(':clickModal="true"');
    });

    it('still loads extra trip sections for admins without using the trip modal', () => {
        expect(source).toContain('if (this.user.is_admin)');
        expect(source).toContain('oldTripsAsPassenger');
        expect(source).toContain('$t(\'viajesMeSubi\')');
    });
});
