import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'Trip.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('Trip.vue passenger message carpoodatos flow', () => {
    it('closes the request-seat modal before showing the pricing hint', () => {
        expect(viewSource).toContain('resolveRequestSeatModalConfirm');
        expect(viewSource).toContain('shouldShowPricingHint');
        expect(viewSource).toMatch(
            /shouldShowPricingHint\([\s\S]*?\)[\s\S]*?this\.showModalRequestSeat = false;[\s\S]*?this\.showModalPricing = true;/
        );
    });

    it('closes carpoodatos modals before opening the trip conversation', () => {
        expect(viewSource).toContain('resolveOpenConversationModalState');
        expect(viewSource).toMatch(
            /resolveOpenConversationModalState\(\)[\s\S]*?this\.toUserMessages\(this\.trip\.user\);/
        );
    });
});

describe('Trip.vue driver seat requests warning', () => {
    it('shows a warning link to my-trips when the driver has pending seat requests', () => {
        expect(viewSource).toContain('shouldShowTripSeatRequestsWarning');
        expect(viewSource).toContain("$t('tripSeatRequestsDriverWarning')");
        expect(viewSource).toMatch(
            /class="alert alert-warning trip-seat-requests-warning"[\s\S]*?name: 'my-trips'/s
        );
        expect(viewSource).toContain('passengerPending_count');
        expect(viewSource).toContain('fa-exclamation-triangle');
        expect(viewSource).toContain('trip-seat-requests-warning__icon');
        expect(viewSource).toContain('.trip-seat-requests-warning a');
    });
});
