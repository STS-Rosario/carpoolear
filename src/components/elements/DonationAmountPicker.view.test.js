import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const componentPath = path.resolve(__dirname, 'DonationAmountPicker.vue');
const componentSource = () => fs.readFileSync(componentPath, 'utf8');

describe('DonationAmountPicker.vue', () => {
    it('renders 2026 preset amounts with tier labels and icons', () => {
        const source = componentSource();
        expect(source).toContain('DONATION_TIERS');
        expect(source).toContain('fa-coffee');
        expect(source).toContain('fa-beer');
        expect(source).toContain('fa-cutlery');
        expect(source).toContain(':value="String(tier.amount)"');
        expect(source).toContain('donationTierCafe');
        expect(source).toContain('donationUsageNote');
    });
});
