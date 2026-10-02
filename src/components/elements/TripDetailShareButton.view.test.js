import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'TripDetailShareButton.vue');
const componentSource = fs.readFileSync(componentPath, 'utf8');

describe('TripDetailShareButton.vue', () => {
    it('renders a secondary share button with share icon and trip share label', () => {
        expect(componentSource).toContain('class="trip-detail__share"');
        expect(componentSource).toContain('data-testid="trip-detail-share"');
        expect(componentSource).toMatch(
            /variant="secondary"[\s\S]*?data-testid="trip-detail-share"[\s\S]*?icon-left="fa fa-share-alt"/
        );
        expect(componentSource).toContain("$t('tripCreationShareTrip')");
    });

    it('shares trip url and localized message through shareContent', () => {
        expect(componentSource).toContain('buildTripShareMessage');
        expect(componentSource).toContain('shareContent');
        expect(componentSource).toContain('detail_trip');
        expect(componentSource).toMatch(
            /onShare\(\)[\s\S]*?buildTripShareMessage[\s\S]*?shareContent/
        );
    });
});
