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

    it('does not pull the account verification banner under the fixed header', () => {
        expect(viewSource).not.toMatch(
            /\.banner\s*\{[^}]*margin:\s*-1em/
        );
    });

    it('resolves banner image URL for Capacitor bundled host', () => {
        expect(viewSource).toContain('bannerImageSrc');
        expect(viewSource).toContain('resolveCapacitorBundledHostUrl');
        expect(viewSource).toContain(':src="bannerImageSrc"');
    });

    it('uses resolveAppBannerAsset to pick mobile banner image and url', () => {
        expect(viewSource).toContain('resolveAppBannerAsset');
        expect(viewSource).toContain("from '../../utils/appBanner.js'");
        expect(viewSource).toMatch(/resolveAppBannerAsset\([^)]*isMobile[^)]*\)/);
    });

    it('passes isMobile into the banner asset resolution', () => {
        const assetBlock = viewSource.match(
            /appBannerAsset\(\)\s*\{[\s\S]*?\n\s*\},/
        );
        expect(assetBlock).not.toBeNull();
        expect(assetBlock[0]).toContain('isMobile');
        expect(assetBlock[0]).toContain('resolveAppBannerAsset');
    });

    it('derives banner image and href from the shared banner asset', () => {
        const imageBlock = viewSource.match(
            /bannerImageSrc\(\)\s*\{[\s\S]*?\n\s*\},/
        );
        expect(imageBlock).not.toBeNull();
        expect(imageBlock[0]).toContain('this.appBannerAsset');

        const hrefBlock = viewSource.match(
            /bannerHref\(\)\s*\{[\s\S]*?\n\s*\},/
        );
        expect(hrefBlock).not.toBeNull();
        expect(hrefBlock[0]).toContain('this.appBannerAsset');
    });

    it('uses the resolved url for the banner href and click handler', () => {
        expect(viewSource).toContain('bannerHref');
        const clickBlock = viewSource.match(
            /onBannerClick\(\)\s*\{[\s\S]*?\n\s*\},/
        );
        expect(clickBlock).not.toBeNull();
        expect(clickBlock[0]).toContain('this.bannerHref');
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

describe('Trips.vue incomplete trip draft card', () => {
    it('shows trip creation draft card for logged-in users', () => {
        expect(viewSource).toContain('TripCreationDraftCard');
        expect(viewSource).toContain('ref="tripCreationDraftCard"');
        expect(viewSource).toContain('refreshTripCreationDraftCard');
        expect(viewSource).toMatch(
            /OngoingTripCard[\s\S]*TripCreationDraftCard[\s\S]*PendingFriendRequestsCard/
        );
    });
});

describe('Trips.vue pending friend invitations card', () => {
    it('shows pending friend requests card linking to friends settings', () => {
        expect(viewSource).toContain('PendingFriendRequestsCard');
        expect(viewSource).toContain('fetchPendingFriends');
        expect(viewSource).toMatch(/OngoingTripCard[\s\S]*PendingFriendRequestsCard/);
    });
});

describe('Trips.vue notification permission prompt', () => {
    it('renders the warning for logged-in users on any supported platform', () => {
        expect(viewSource).toContain(
            'v-if="user && notificationsEnabledForPlatform && !hasNotificationPermission && showNotificationWarning"'
        );
        expect(viewSource).toContain("$t('notificacionesNoHabilitadas')");
        expect(viewSource).toContain('requestNotificationPermission');
        expect(viewSource).toContain('dismissNotificationWarning');
        expect(viewSource).toContain('checkNotificationPermission');
        expect(viewSource).toContain('pwa_notification_dismiss');
    });

    it('delegates permission check/request to the shared platform-aware util', () => {
        expect(viewSource).toContain(
            "from '../../utils/notificationPermission.js'"
        );
        expect(viewSource).toContain('getNotificationPermissionStatus');
        expect(viewSource).toContain('requestNotificationPermission');
    });

    it('enables push for native Capacitor and installed PWA, excluding plain web in /trips', () => {
        expect(viewSource).toContain('notificationsEnabledForPlatform');
        expect(viewSource).toContain('isNativePlatform');
        expect(viewSource).toContain('isPWA');
        const computedBlock = viewSource.match(
            /notificationsEnabledForPlatform\(\)\s*\{[\s\S]*?\n\s*\},/
        );
        expect(computedBlock).not.toBeNull();
        expect(computedBlock[0]).toContain('isNativePlatform()');
        expect(computedBlock[0]).toContain('isPWA()');
        // Plain web (non-PWA, non-native) must NOT enable the banner in /trips.
        expect(computedBlock[0]).toContain('return false');
    });
});

describe('Trips.vue friend-first trip sections', () => {
    it('splits logged-in trip list into friend and other sections', () => {
        expect(viewSource).toContain('splitFriendTrips');
        expect(viewSource).toContain("$t('viajesDeMisAmigos')");
        expect(viewSource).toContain("$t('viajesPublicados')");
        expect(viewSource).not.toContain("$t('otrosViajes')");
        expect(viewSource).toContain('friendTripsList');
        expect(viewSource).toContain('otherTripsList');
    });

    it('renders section headings as block elements above trip rows', () => {
        expect(viewSource).toMatch(
            /<section[\s\S]*?trips-section-heading[\s\S]*?trips-section__list row/s
        );
    });

    it('left-aligns trip lists with fewer than 4 cards, otherwise space-between', () => {
        expect(viewSource).toMatch(
            /trips-section__list--start['"]?\s*:\s*friendTripsList\.length\s*<\s*4/
        );
        expect(viewSource).toMatch(
            /trips-section__list--start['"]?\s*:\s*otherTripsList\.length\s*<\s*4/
        );
        expect(viewSource).toMatch(
            /trips-section__list--start['"]?\s*:\s*exactTrips\.length\s*<\s*4/
        );
    });

    it('hides the mobile Viajes publicados heading above the donation card', () => {
        expect(viewSource).toMatch(
            /v-if="isMobile && !lookSearch && !showSplitDonationPanel"/
        );
        expect(viewSource).toContain('trips-mobile-home__heading');
    });

    it('shows the donation banner before friend and other sections', () => {
        expect(viewSource).toContain('shouldShowSplitDonationPanel');
        expect(viewSource).toContain('trips-donation-banner');
        expect(viewSource).toMatch(
            /showSplitDonationPanel[\s\S]*?showFriendTripSections[\s\S]*?viajesDeMisAmigos/s
        );
        expect(viewSource).not.toMatch(
            /friendTripsList[\s\S]*?panel-donar[\s\S]*?viajesPublicados/s
        );
    });

    it('renders the logged-out donation panel full-width so trip cards do not wrap beside it', () => {
        const loggedOutDonation = viewSource.match(
            /isDonationTime\(\)[\s\S]*?<div\s+class="panel panel-default panel-donar"/
        )?.[0];
        expect(loggedOutDonation).toBeTruthy();
        expect(loggedOutDonation).toContain('class="col-xs-24"');
    });

    it('hides section headings when there are no friend trips', () => {
        expect(viewSource).toContain('showFriendTripSections');
        expect(viewSource).toMatch(
            /v-if="showFriendTripSections"[\s\S]*?viajesDeMisAmigos[\s\S]*?viajesPublicados/s
        );

        const flatTripsListBlock = viewSource.match(
            /v-else-if="otherTripsList\.length"[\s\S]*?class="trips-section__list row"[\s\S]*?<\/div>\s*<\/template>/
        )?.[0];

        expect(flatTripsListBlock).toBeTruthy();
        expect(flatTripsListBlock).not.toContain('trips-section-heading');
        expect(flatTripsListBlock).not.toContain("$t('viajesDeMisAmigos')");
        expect(flatTripsListBlock).not.toContain("$t('viajesPublicados')");
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

    it('restores from_date and to_date from the route query', () => {
        expect(viewSource).toContain(
            "const textFields = ['origin_name', 'destination_name', 'date', 'from_date', 'to_date']"
        );
    });
});

describe('Trips.vue donation modal', () => {
    it('uses shared donation picker and Mercado Pago helpers', () => {
        expect(viewSource).toContain('DonationAmountPicker');
        expect(viewSource).toMatch(
            /components:\s*\{[^}]*DonationAmountPicker/s
        );
        expect(viewSource).toContain('getDonationOnceUrl');
        expect(viewSource).toContain('getDonationMonthlyUrl');
        expect(viewSource).not.toContain('value="2000"');
        expect(viewSource).not.toContain('value="10000"');
    });
});

describe('Trips.vue search alert and install modal CTAs', () => {
    it('hides the PWA install prompt on native platforms', () => {
        expect(viewSource).toContain('shouldShowPwaInstallModal');
        expect(viewSource).toContain("from '../../utils/pwaInstallModal.js'");

        const shouldShowBlock = viewSource.match(
            /shouldShowInstallModal\(\)\s*\{[\s\S]*?\n\s*\},/
        );
        expect(shouldShowBlock).not.toBeNull();
        expect(shouldShowBlock[0]).toContain('shouldShowPwaInstallModal');
        expect(shouldShowBlock[0]).toContain('isNativePlatform');
        expect(shouldShowBlock[0]).toContain('this.isIOS()');

        expect(viewSource).toMatch(
            /shouldShowPwaInstallModal\([\s\S]*?isNativePlatform[\s\S]*?this\.isIOS\(\)/
        );
    });

    it('uses this.$t inside getInstallModalContent', () => {
        expect(viewSource).toContain("this.$t('instalarApp')");
        expect(viewSource).toContain("this.$t('instalarWebAppPWA')");
        expect(viewSource).toContain("this.$t('instalarAppEnIos')");
        expect(viewSource).not.toContain('title: $t(');
        expect(viewSource).not.toContain('message: $t(');
    });

    it('uses primary Instalar, secondary Entendido, tertiary No mostrar in install modal', () => {
        const installModal = viewSource.match(
            /showModalInstallApp[\s\S]*?<\/modal>/
        )?.[0];
        expect(installModal).toBeTruthy();
        expect(installModal).toMatch(
            /variant="primary"[\s\S]*?\$t\('instalar'\)/
        );
        expect(installModal).toMatch(
            /variant="secondary"[\s\S]*?\$t\('entendido'\)/
        );
        expect(installModal).toMatch(
            /variant="tertiary"[\s\S]*?\$t\('noMostrarDeNuevo'\)/
        );
    });
});

describe('Trips.vue empty search and nearby section', () => {
    it('shows loupe empty state and reuses nearby trips without refetch', () => {
        expect(viewSource).toContain('loupe-car.svg');
        expect(viewSource).toContain("$t('searchNoResultsTitle')");
        expect(viewSource).toContain("$t('searchSeeNearbyTrips')");
        expect(viewSource).toContain("$t('viajesCercanos')");
        expect(viewSource).toContain('splitTripsBySearchDate');
        expect(viewSource).toContain('showNearbyTrips');
        expect(viewSource).toContain('nearbyTrips');
        expect(viewSource).toContain('exactTrips');
        expect(viewSource).not.toContain('isComplementary(');
    });
});

describe('Trips.vue search box when the ref is missing', () => {
    it('clears the search box through a helper that tolerates a missing ref', () => {
        expect(viewSource).toContain('clearSearchBox');
        expect(viewSource).toContain("from '../../utils/searchBox.js'");
        expect(viewSource).not.toMatch(/this\.\$refs\.searchBox\.clear\(\)/);
    });
});
