import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const footerPath = path.resolve(__dirname, 'FooterApp.vue');
const footerSource = fs.readFileSync(footerPath, 'utf8');

describe('FooterApp mobile navigation', () => {
    it('renders a text label under each footer icon', () => {
        expect(footerSource).toContain('actionbar_item_label');
        expect(footerSource).toContain("$t(item.labelKey)");
    });

    it('shows a badge on my trips when there are pending requests', () => {
        expect(footerSource).toContain('myTripsBadgeCount');
        expect(footerSource).toContain("item.id === 'my-trips'");
    });
});
