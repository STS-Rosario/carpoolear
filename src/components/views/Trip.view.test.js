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

        const pricingMesaAyudaLinkPattern =
            /<span>\{\{\s*\$t\('carpoodatosAntesConfirmarDudaLead'\)\s*\}\}<\/span>\s*<router-link\s+:to="\{\s*name:\s*'tickets'\s*\}">\{\{\s*\$t\('carpoodatosAntesConfirmarDudaLink'\)\s*\}\}<\/router-link>\{\{\s*\$t\('carpoodatosAntesConfirmarDudaTail'\)\s*\}\}/;

        expect(pricingModal).toMatch(pricingMesaAyudaLinkPattern);
        expect(pricingModal).not.toContain('carpoodatosContactoRedes');
        expect(pricingModal).not.toMatch(mesaAyudaLinkPattern);
    });

    it('lists coordination topics in the pricing carpoodatos modal', () => {
        const pricingModal = viewSource.match(
            /showModalPricing[\s\S]*?matcheosDelViaje/
        )[0];

        expect(pricingModal).toContain("$t('carpoodatosAntesConfirmarBullet1')");
        expect(pricingModal).toContain("$t('carpoodatosAntesConfirmarBullet5')");
        expect(pricingModal).toContain("$t('carpoodatosContribucionComprobantes')");
        expect(pricingModal).toMatch(/<ul>[\s\S]*?<\/ul>/);
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

describe('Trip.vue driver seat request limit warning', () => {
    it('prefers limit warning with my-trips link when limit reached', () => {
        expect(viewSource).toContain('shouldShowDriverSeatRequestLimitWarning');
        expect(viewSource).toContain("$t('tripSeatRequestLimitDriverWarning')");
        expect(viewSource).toMatch(
            /tripSeatRequestLimitDriverWarning[\s\S]*?name: 'my-trips'|name: 'my-trips'[\s\S]*?tripSeatRequestLimitDriverWarning/s
        );
        expect(viewSource).toContain('seat_request_limit_reached');
    });
});

describe('Trip.vue mobile trip-detail stack', () => {
    it('uses trip-detail root and mobile stack section labels', () => {
        expect(viewSource).toContain('trip-detail');
        expect(viewSource).toContain('trip-detail__stack');
        expect(viewSource).toContain("$t('tripDetailSection')");
        expect(viewSource).toContain("$t('tripDetailDriverMessage')");
        expect(viewSource).toContain("$t('tripDetailConditions')");
        expect(viewSource).toContain("$t('tripDetailJoined')");
    });

    it('keeps map after CTAs in mobile markup', () => {
        const mobileStack = viewSource.match(
            /trip-detail__stack[\s\S]*?trip-route-map/
        );
        expect(mobileStack).not.toBeNull();
        expect(mobileStack[0].indexOf('TripButtons')).toBeLessThan(
            mobileStack[0].indexOf('trip-route-map')
        );
    });

    it('adds trip-detail root classes with mobile modifier binding', () => {
        expect(viewSource).toContain("'trip-detail--mobile': isMobile");
    });

    it('gates the mobile stack on isMobile, trip and not passengers view', () => {
        expect(viewSource).toMatch(
            /v-if="isMobile[^"]*trip[^"]*!isPassengersView"[\s\S]*?trip-detail__stack|trip-detail__stack[\s\S]*?v-if="isMobile/
        );
    });

    it('renders TripDetailRoute in DETALLE and keeps seats in the driver header', () => {
        const stack = viewSource.match(
            /trip-detail__stack[\s\S]*?trip-route-map/
        )[0];
        expect(stack).toContain('<TripDetailRoute');
        expect(stack).not.toMatch(/<TripSeats\s*\/>/);
        expect(stack).not.toMatch(/<TripLocation\s*\/>/);
        expect(stack).not.toMatch(/<TripDate\s*\/>/);
    });

    it('includes TripShare between passengers and CTAs in the mobile stack', () => {
        const stack = viewSource.match(
            /trip-detail__stack[\s\S]*?trip-route-map/
        )[0];
        expect(stack).toContain('<TripShare');

        const passengersIdx = stack.indexOf('TripPassengers');
        const shareIdx = stack.indexOf('TripShare');
        const ctaIdx = stack.indexOf('trip-detail__cta"');

        expect(passengersIdx).toBeGreaterThan(-1);
        expect(shareIdx).toBeGreaterThan(passengersIdx);
        expect(ctaIdx).toBeGreaterThan(shareIdx);
    });

    it('gates the desktop white-background form wrapper off mobile while keeping carpoodatos modals available on mobile too', () => {
        expect(viewSource).toMatch(/class="row form"[\s\S]{0,40}v-if="!isMobile"/);

        const whiteBackgroundIdx = viewSource.indexOf(
            'class="white-background"'
        );
        const tripButtonsDesktopIdx = viewSource.indexOf(
            '<TripButtons',
            whiteBackgroundIdx
        );
        const betweenWhiteBackgroundAndTripButtons = viewSource.slice(
            whiteBackgroundIdx,
            tripButtonsDesktopIdx
        );

        expect(betweenWhiteBackgroundAndTripButtons).not.toContain(
            'showModalRequestSeat'
        );
        expect(betweenWhiteBackgroundAndTripButtons).not.toContain(
            'showModalPricing'
        );
        expect(viewSource).toContain('showModalRequestSeat');
        expect(viewSource).toContain('showModalPricing');
    });
});
