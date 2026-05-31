import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'MyTrips.vue');
const source = fs.readFileSync(viewPath, 'utf8');

function getTripComponentTags() {
    return source.match(/<Trip[\s\S]*?(?:\/>|<\/Trip>)/g) || [];
}

describe('MyTrips trip card navigation', () => {
    it('disables trip info modal on every trip card so clicks go to detail page', () => {
        const tripTags = getTripComponentTags();

        expect(tripTags.length).toBe(4);

        tripTags.forEach((tag) => {
            expect(tag).toContain(':clickModal="false"');
        });
    });

    it('does not use admin-only trip modal pattern from profile or admin views', () => {
        expect(source).not.toContain(':clickModal="true"');
        expect(source).not.toContain(':clickModal="user.is_admin"');
    });
});
