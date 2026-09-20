import { afterEach, describe, expect, it } from 'vitest';
import { leafletOsrmServiceUrl } from './osrmRouting.js';

describe('leafletOsrmServiceUrl', () => {
    afterEach(() => {
        delete import.meta.env.VITE_API_URL;
    });

    it('appends the proxied OSRM path to the API URL', () => {
        import.meta.env.VITE_API_URL = 'https://api.example.com';
        expect(leafletOsrmServiceUrl()).toBe(
            'https://api.example.com/api/osrm/route/v1'
        );
    });

    it('strips a trailing slash from the API URL', () => {
        import.meta.env.VITE_API_URL = 'https://api.example.com/';
        expect(leafletOsrmServiceUrl()).toBe(
            'https://api.example.com/api/osrm/route/v1'
        );
    });

    it('defaults to a relative base when the API URL is missing', () => {
        import.meta.env.VITE_API_URL = '';
        expect(leafletOsrmServiceUrl()).toBe('/api/osrm/route/v1');
    });
});
