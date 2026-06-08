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
});
