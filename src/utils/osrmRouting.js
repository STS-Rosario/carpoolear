/**
 * Base URL for Leaflet Routing Machine OSRMv1 client (must match OSRM API: …/route/v1).
 * Proxied through Laravel for caching + fallback; see OsrmProxyController.
 */
export function leafletOsrmServiceUrl() {
    const raw = process.env.API_URL || '';
    const base = String(raw).replace(/\/$/, '');
    return `${base}/api/osrm/route/v1`;
}
