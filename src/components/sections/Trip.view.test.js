import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'Trip.vue');
const source = fs.readFileSync(viewPath, 'utf8');

describe('Trip card quick actions', () => {
    it('does not link My Trips cards to the passenger-only trip detail route', () => {
        expect(source).not.toContain("location: 'passenger'");
        expect(source).not.toContain("$t('verPasajerosSubidos')");
        expect(source).not.toContain('detail_trip_location');
    });
});

describe('Trip public visibility tooltip', () => {
    it('uses visibilidadPublico title for friendship_type_id 2', () => {
        expect(source).toMatch(
            /friendship_type_id === 2[\s\S]*?:title="\$t\('visibilidadPublico'\)"/s
        );
        expect(source).not.toMatch(
            /friendship_type_id === 2[\s\S]*?:title="\$t\('visibilidadAmigosDeAmigos'\)"/s
        );
    });
});

describe('Trip sellado pending display', () => {
    it('uses showSelladoPending instead of needs_sellado for card styling and legend', () => {
        expect(source).toMatch(
            /:class="\[tripCardCountClass, \{ 'trip-needs-sellado': showSelladoPending \}\]"/
        );
        expect(source).toMatch(/v-if="showSelladoPending"/);
        expect(source).not.toMatch(
            /:class="\[tripCardCountClass, \{ 'trip-needs-sellado': trip\.needs_sellado \}\]"/
        );
        expect(source).not.toMatch(/v-if="trip\.needs_sellado"/);
    });

    it('derives showSelladoPending from shouldShowSelladoPending helper', () => {
        expect(source).toContain("from '../../utils/tripSelladoDisplay'");
        expect(source).toMatch(/showSelladoPending\(\)\s*\{[\s\S]*shouldShowSelladoPending/);
    });
});

describe('Trip clickModal', () => {
    it('declares clickModal as a boolean prop defaulting to false', () => {
        expect(source).toMatch(
            /clickModal:\s*\{[\s\S]*?type:\s*Boolean,[\s\S]*?default:\s*false/
        );
    });

    it('opens modal or navigates to detail via the shell detail-click handler', () => {
        const wrapperOpen = source.match(
            /:class="\[tripCardCountClass, \{ 'trip-needs-sellado': showSelladoPending \}\]"\s*\n\s*v-on:click="clickModal/
        );
        expect(wrapperOpen).toBeNull();

        expect(source).toContain('@detail-click="onShellDetailClick"');
        expect(source).toMatch(
            /onShellDetailClick\([^)]*\)\s*\{[\s\S]*?this\.clickModal[\s\S]*?openModal\(\)[\s\S]*?else[\s\S]*?goToDetail\(false\)/
        );
    });

    it('stops click propagation on trip display so dismiss does not reopen', () => {
        expect(source).toMatch(
            /<tripDisplay[\s\S]*@click\.stop/
        );
    });
});

describe('Trip card seat request limit warning', () => {
    it('shows driver limit warning on my-trips cards', () => {
        expect(source).toContain('shouldShowDriverSeatRequestLimitWarning');
        expect(source).toContain("$t('tripSeatRequestLimitDriverWarning')");
        expect(source).toContain('seat_request_limit_reached');
    });
});

describe('Trip card redesign shell', () => {
    it('composes TripCardShell for the list card layout', () => {
        expect(source).toContain('TripCardShell');
        expect(source).toContain("from '../elements/TripCardShell.vue'");
        expect(source).toContain('getTripLocationLabels');
        expect(source).toContain('formatTripCardDate');
        expect(source).toContain('formatTripCardTime');
        expect(source).toContain('normalizeTripsCount');
    });

    it('removes the light/default theme forks from the card layout', () => {
        expect(source).not.toMatch(/tripCardTheme === 'light'/);
        expect(source).not.toMatch(/tripCardTheme !== 'light'/);
        expect(source).not.toContain('tripCardTheme');
    });

    it('does not render star ratings on the card', () => {
        expect(source).not.toContain('trip_stars');
        expect(source).not.toContain('SvgItem');
        expect(source).not.toContain('icon="\'star\'');
    });

    it('routes profile clicks and detail clicks through the shell events', () => {
        expect(source).toContain('@profile-click="goToProfile"');
        expect(source).toContain('@detail-click="onShellDetailClick"');
    });

    it('guards goToProfile against being called without a native event', () => {
        expect(source).toMatch(
            /goToProfile[^{]*\{\s*if\s*\(event[\s\S]*?event\.stopPropagation\(\)/
        );
    });

    it('passes a shellUser computed with the resolved avatar image to the shell', () => {
        expect(source).toContain(':user="shellUser"');
        expect(source).toMatch(/shellUser\(\)\s*\{[\s\S]*?getUserImage/);
    });

    it('passes ratings, trips count and route/date labels to the shell', () => {
        expect(source).toContain(':ratings="driverRatings"');
        expect(source).toContain(':trips-count-label="driverTripsLabel"');
        expect(source).toContain(':from-city="locationLabels.fromCity"');
        expect(source).toContain(':from-region="locationLabels.fromRegion"');
        expect(source).toContain(':to-city="locationLabels.toCity"');
        expect(source).toContain(':to-region="locationLabels.toRegion"');
        expect(source).toContain(':date-label="cardDateLabel"');
        expect(source).toContain(':time-label="cardTimeLabel"');
    });

    it('keeps visibility, sellado legend, seat warning and seat controls as shell extras', () => {
        expect(source).toContain('name="body-extra"');
        expect(source).toMatch(/friendship_type_id === 2[\s\S]*?body-extra|body-extra[\s\S]*?friendship_type_id === 2/);
        expect(source).toMatch(/#body-extra[\s\S]*?showSelladoPending[\s\S]*?faltaPagarSellado/);
        expect(source).toMatch(/#body-extra[\s\S]*?showSeatRequestLimitWarning/);
        expect(source).toContain('name="footer-extra"');
        expect(source).toContain('changeSeatsNumber');
    });
});
