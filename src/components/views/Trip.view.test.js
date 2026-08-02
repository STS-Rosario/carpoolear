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

    it('relies on Modal header close only and uses primary Enviar mensaje AppButtons', () => {
        expect(viewSource).not.toContain('float-right-close');
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?enviarMensaje[\s\S]*?<\/AppButton>/
        );
        expect(viewSource).not.toMatch(
            /showModalRequestSeat[\s\S]*?class="btn btn-primary"[\s\S]*?enviarMensaje/
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
            /showModalPricing[\s\S]*?trip-detail__stack/
        )[0];

        const pricingMesaAyudaLinkPattern =
            /<span>\{\{\s*\$t\('carpoodatosAntesConfirmarDudaLead'\)\s*\}\}<\/span>\s*<router-link\s+:to="\{\s*name:\s*'tickets'\s*\}">\{\{\s*\$t\('carpoodatosAntesConfirmarDudaLink'\)\s*\}\}<\/router-link>\{\{\s*\$t\('carpoodatosAntesConfirmarDudaTail'\)\s*\}\}/;

        expect(pricingModal).toMatch(pricingMesaAyudaLinkPattern);
        expect(pricingModal).not.toContain('carpoodatosContactoRedes');
        expect(pricingModal).not.toMatch(mesaAyudaLinkPattern);
    });

    it('lists coordination topics in the pricing carpoodatos modal', () => {
        const pricingModal = viewSource.match(
            /showModalPricing[\s\S]*?trip-detail__stack/
        )[0];

        expect(pricingModal).toContain("$t('carpoodatosAntesConfirmarBullet1')");
        expect(pricingModal).toContain("$t('carpoodatosAntesConfirmarBullet5')");
        expect(pricingModal).toContain("$t('carpoodatosContribucionComprobantes')");
        expect(pricingModal).toMatch(/<ul>[\s\S]*?<\/ul>/);
    });

    it('styles carpoodatos bullets as visible list items matching modal body text size', () => {
        const cssPath = path.resolve(__dirname, '../../styles/base.css');
        const css = fs.readFileSync(cssPath, 'utf8');
        const carpoodatosBlock = css.match(/\.carpoodatos\s+ul\s*\{[\s\S]*?\}/);

        expect(carpoodatosBlock).not.toBeNull();
        expect(carpoodatosBlock[0]).toMatch(/list-style(?:-type)?:\s*disc/);
        expect(carpoodatosBlock[0]).toMatch(/padding-left:\s*1\.25rem/);
        expect(css).not.toMatch(
            /\.carpoodatos\s+p\s*,\s*\.carpoodatos\s+ul\s*\{[\s\S]*?font-size:\s*11px/
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

describe('Trip.vue shared trip-detail stack', () => {
    it('binds mobile and desktop trip-detail modifiers', () => {
        expect(viewSource).toContain("'trip-detail--mobile': isMobile");
        expect(viewSource).toContain("'trip-detail--desktop': !isMobile");
    });

    it('shows a desktop-only white page title as the first band inside the trip card', () => {
        expect(viewSource).toContain('trip-detail__page-header');
        expect(viewSource).toContain("$t('tripDetailPageTitle')");
        expect(viewSource).toMatch(
            /trip-detail__card[\s\S]*?v-if="!isMobile"[\s\S]*?trip-detail__page-header[\s\S]*?tripDetailPageTitle[\s\S]*TripDriver/
        );
        const card = viewSource.match(
            /trip-detail__card[\s\S]*?TripDriver/
        )[0];
        expect(card.indexOf('trip-detail__page-header')).toBeLessThan(
            card.indexOf('TripDriver')
        );
    });

    it('shows the redesign stack for any breakpoint when trip is loaded', () => {
        expect(viewSource).toMatch(
            /v-if="trip\s*&&\s*!isPassengersView"[\s\S]*?trip-detail__stack|trip-detail__stack[\s\S]*?v-if="trip\s*&&\s*!isPassengersView"/
        );
        expect(viewSource).not.toMatch(
            /v-if="isMobile\s*&&\s*trip\s*&&\s*!isPassengersView"/
        );
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


    it('renders TripDetailRoute in DETALLE and a seats pill in the desktop lugares band', () => {
        const stack = viewSource.match(
            /trip-detail__stack[\s\S]*?trip-route-map/
        )[0];
        expect(stack).toContain('<TripDetailRoute');
        expect(stack).toContain('trip-detail__lugares');
        expect(stack).toContain('trip-detail__seats-pill');
        expect(stack).toContain('seatsLabel');
        expect(stack).not.toMatch(/trip-detail__lugares[\s\S]*?<TripSeats/);
        expect(stack).not.toMatch(/<TripLocation\s*\/>/);
        expect(stack).not.toMatch(/<TripDate\s*\/>/);
    });

    it('shows Viaje finalizado as a grey pill under seats when the trip is expired', () => {
        const stack = viewSource.match(
            /trip-detail__stack[\s\S]*?trip-route-map/
        )[0];
        expect(stack).toContain('isTripExpired');
        expect(stack).toContain('trip-detail__finished-pill');
        expect(stack).toContain("$t('viajeFinalizado')");
        expect(stack).toMatch(
            /trip-detail__seats-pill[\s\S]*trip-detail__finished-pill[\s\S]*viajeFinalizado/
        );
    });

    it('does not include TripShare in the trip-detail stack', () => {
        const stack = viewSource.match(
            /trip-detail__stack[\s\S]*?trip-route-map/
        )[0];
        expect(stack).not.toContain('<TripShare');
        expect(stack).not.toContain('trip-detail__share');
        expect(viewSource).not.toMatch(/import TripShare from/);
        expect(stack.indexOf('TripPassengers')).toBeLessThan(
            stack.indexOf('trip-detail__cta')
        );
    });

    it('does not render the legacy desktop column-tree form row', () => {
        expect(viewSource).not.toMatch(/class="row form"/);
        expect(viewSource).not.toContain('white-background');
        expect(viewSource).not.toContain('legacy desktop removed');
        expect(viewSource).not.toContain('<TripLocation');
        expect(viewSource).not.toContain('columnComponent');
        expect(viewSource).not.toContain('columnClass');
        expect(viewSource).not.toContain('themeClasses');
        expect(viewSource).toContain('showModalRequestSeat');
        expect(viewSource).toContain('showModalPricing');
    });
});

describe('Trip.vue desktop column bands', () => {
    it('uses a three-column actions band before the map', () => {
        const stack = viewSource.match(
            /trip-detail__stack[\s\S]*?trip-route-map/
        )[0];
        const actionsIdx = stack.indexOf('trip-detail__actions-grid');
        const mapIdx = stack.indexOf('trip-route-map');
        expect(actionsIdx).toBeGreaterThan(-1);
        expect(mapIdx).toBeGreaterThan(actionsIdx);
        expect(stack).toMatch(
            /trip-detail__actions-grid[\s\S]*trip-detail__lugares-col[\s\S]*trip-detail__seats-pill[\s\S]*trip-detail__joined[\s\S]*TripPassengers[\s\S]*trip-detail__contribucion[\s\S]*TripPrice[\s\S]*trip-detail__cta[\s\S]*TripButtons/
        );
        expect(stack).not.toContain('trip-detail__seats-passengers');
        expect(stack).not.toContain('trip-detail__price-cta');
    });

    it('splits DETALLE into route, stats, and condiciones columns', () => {
        const stack = viewSource.match(
            /trip-detail__stack[\s\S]*?trip-route-map/
        )[0];
        expect(stack).toContain('trip-detail__detalle-grid');
        expect(stack).toContain('trip-detail__detalle-main');
        expect(stack).toContain('trip-detail__detalle-stats');
        expect(stack).toContain('trip-detail__detalle-aside');
        expect(stack).toMatch(
            /trip-detail__detalle-main[\s\S]*TripDetailRoute[\s\S]*trip-detail__detalle-stats[\s\S]*TripStats[\s\S]*trip-detail__detalle-aside/
        );
        const main = stack.match(
            /trip-detail__detalle-main[\s\S]*?(?=trip-detail__detalle-stats)/
        )[0];
        expect(main).toContain('TripDetailRoute');
        expect(main).not.toContain('TripStats');
        const aside = stack.match(
            /trip-detail__detalle-aside[\s\S]*?(?=trip-detail__section|<\/section>)/
        )[0];
        expect(aside).not.toContain('TripStats');
    });

    it('hides the desktop lugares heading/column when TripSeats would render nothing', () => {
        const stack = viewSource.match(
            /trip-detail__stack[\s\S]*?trip-route-map/
        )[0];
        const desktopBlock = stack.match(
            /<template v-else>[\s\S]*?<\/template>/
        )[0];
        expect(desktopBlock).toMatch(
            /v-if="tripCardTheme === 'light' \|\| !trip\.is_passenger"\s*\n\s*class="trip-detail__lugares"/
        );
    });

    it('keeps mobile condiciones with price; desktop puts TripData in DETALLE aside and TripPrice in the actions grid', () => {
        expect(viewSource).toMatch(
            /v-if="isMobile"[\s\S]*tripDetailConditions[\s\S]*TripPrice[\s\S]*TripData/
        );
        expect(viewSource).toMatch(
            /trip-detail__detalle-aside[\s\S]*TripData|v-if="!isMobile"[\s\S]*trip-detail__detalle-aside[\s\S]*TripData/
        );
        expect(viewSource).toMatch(
            /trip-detail__actions-grid[\s\S]*TripPrice[\s\S]*TripButtons/
        );
    });
});
