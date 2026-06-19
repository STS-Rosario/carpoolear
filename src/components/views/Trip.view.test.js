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
        expect(viewSource).toContain('closeCarpoodatosModals');
        expect(viewSource).toMatch(
            /closeCarpoodatosModals\(\)[\s\S]*?this\.toUserMessages\(this\.trip\.user\);/
        );
    });

    it('uses the pricing modal confirm flow when forcing message navigation', () => {
        expect(viewSource).toContain('resolvePricingModalConfirm');
        expect(viewSource).toMatch(
            /toMessageForce\(\)[\s\S]*?resolvePricingModalConfirm\(\)[\s\S]*?this\.toMessages\(true\);/
        );
    });
});

describe('Trip.vue carpoodatos mesa de ayuda contact', () => {
    const mesaAyudaLinkPattern =
        /<span>\{\{\s*\$t\('mesaAyudaContactoLead'\)\s*\}\}<\/span>\s*<router-link\s+:to="\{\s*name:\s*'tickets'\s*\}">\{\{\s*\$t\('mesaAyuda'\)\s*\}\}<\/router-link>\{\{\s*\$t\('mesaAyudaContactoTail'\)\s*\}\}/;

    it('links the request-seat carpoodatos modal to mesa de ayuda', () => {
        const requestSeatModal = viewSource.match(
            /showModalRequestSeat[\s\S]*?showModalPricing/
        )[0];

        expect(requestSeatModal).toMatch(mesaAyudaLinkPattern);
        expect(requestSeatModal).not.toContain('carpoodatosContactoEmail');
    });

    it('links the pricing carpoodatos modal to mesa de ayuda', () => {
        const pricingModal = viewSource.match(
            /showModalPricing[\s\S]*?matcheosDelViaje/
        )[0];

        expect(pricingModal).toMatch(mesaAyudaLinkPattern);
        expect(pricingModal).not.toContain('carpoodatosContactoRedes');
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
