import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'Trips.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('Trips.vue app banner', () => {
    it('uses shouldShowAppBanner for verification-aware banner visibility', () => {
        expect(viewSource).toContain('shouldShowAppBanner');
        expect(viewSource).toContain('showAppBanner');
        expect(viewSource).toContain('v-if="showAppBanner"');
    });

    it('resolves banner image URL for Capacitor bundled host', () => {
        expect(viewSource).toContain('bannerImageSrc');
        expect(viewSource).toContain('resolveCapacitorBundledHostUrl');
        expect(viewSource).toContain(':src="bannerImageSrc"');
    });
});

describe('Trips.vue ongoing trip card', () => {
    it('loads and shows the ongoing trip card for logged-in users', () => {
        expect(viewSource).toContain('OngoingTripCard');
        expect(viewSource).toContain('ongoingTrip');
        expect(viewSource).toContain('fetchOngoingTrip');
        expect(viewSource).toContain('v-if="ongoingTrip"');
    });
});

describe('Trips.vue pending friend invitations card', () => {
    it('shows pending friend requests card linking to friends settings', () => {
        expect(viewSource).toContain('PendingFriendRequestsCard');
        expect(viewSource).toContain('fetchPendingFriends');
        expect(viewSource).toMatch(/OngoingTripCard[\s\S]*PendingFriendRequestsCard/);
    });
});

describe('Trips.vue friend-first trip sections', () => {
    it('splits logged-in trip list into friend and other sections', () => {
        expect(viewSource).toContain('splitFriendTrips');
        expect(viewSource).toContain("$t('viajesDeMisAmigos')");
        expect(viewSource).toContain("$t('otrosViajes')");
        expect(viewSource).toContain('friendTripsList');
        expect(viewSource).toContain('otherTripsList');
    });

    it('renders section headings as block elements above trip rows', () => {
        expect(viewSource).toContain('class="trips-section"');
        expect(viewSource).toContain('class="trips-section-heading"');
        expect(viewSource).toContain('class="trips-section__list row"');
        expect(viewSource).toMatch(
            /<section[\s\S]*?trips-section-heading[\s\S]*?trips-section__list row/s
        );
    });

    it('shows the donation banner before friend and other sections', () => {
        expect(viewSource).toContain('shouldShowSplitDonationPanel');
        expect(viewSource).toContain('trips-donation-banner');
        expect(viewSource).toMatch(
            /showSplitDonationPanel[\s\S]*?showFriendTripSections[\s\S]*?viajesDeMisAmigos/s
        );
        expect(viewSource).not.toMatch(
            /friendTripsList[\s\S]*?panel-donar[\s\S]*?otrosViajes/s
        );
    });

    it('hides section headings when there are no friend trips', () => {
        expect(viewSource).toContain('showFriendTripSections');
        expect(viewSource).toMatch(
            /v-if="showFriendTripSections"[\s\S]*?viajesDeMisAmigos[\s\S]*?otrosViajes/s
        );

        const flatTripsListBlock = viewSource.match(
            /v-else-if="otherTripsList\.length"[\s\S]*?class="trips-section__list row"[\s\S]*?<\/div>\s*<\/template>/
        )?.[0];

        expect(flatTripsListBlock).toBeTruthy();
        expect(flatTripsListBlock).not.toContain('trips-section-heading');
        expect(flatTripsListBlock).not.toContain("$t('viajesDeMisAmigos')");
        expect(flatTripsListBlock).not.toContain("$t('otrosViajes')");
    });
});

describe('Trips.vue persisted search state', () => {
    it('does not run default search when URL already has search params', () => {
        expect(viewSource).toContain('hasRouteSearchParams()');
        expect(viewSource).toContain('if (!this.clearSearch && !this.keepSearch && !this.hasRouteSearchParams()) {');
    });

    it('stores search filters in the route query when searching', () => {
        expect(viewSource).toContain('updateTripsQuery(params = {}, scroll)');
        expect(viewSource).toContain('this.$router.replace({');
        expect(viewSource).toContain('name: \'trips\'');
        expect(viewSource).toContain('query: nextQuery');
    });

    it('hydrates search params from the route query on mount', () => {
        expect(viewSource).toContain('getSearchParamsFromQuery()');
        expect(viewSource).toContain('const queryParams = this.getSearchParamsFromQuery();');
        expect(viewSource).toContain('this.$refs.searchBox.loadParams(queryParams);');
        expect(viewSource).toContain('this.search(queryParams);');
    });

    it('restores scroll from query only after trips have loaded', () => {
        expect(viewSource).toContain('pendingScrollRestore: null');
        expect(viewSource).toContain('maybeRestoreScroll()');
        expect(viewSource).toContain('this.pendingScrollRestore = Number.parseInt(this.getRouteQuery().scroll, 10);');
        expect(viewSource).toContain('window.scrollTo(0, this.pendingScrollRestore);');
        expect(viewSource).toContain('this.pendingScrollRestore = null;');
    });

    it('persists hide_carpooleado in route query when searching', () => {
        expect(viewSource).toContain('hide_carpooleado');
        expect(viewSource).toContain('parseBooleanQueryValue(query.hide_carpooleado)');
        expect(viewSource).toContain('params.hide_carpooleado = true');
    });

    it('persists allow preference filters in route query when searching', () => {
        expect(viewSource).toContain('readAllowPreferenceParamsFromQuery');
        expect(viewSource).toContain("from '../../utils/searchAdvancedFilters.js'");
    });
});
