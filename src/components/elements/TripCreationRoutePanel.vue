<template>
    <div v-if="hasRoute" class="trip-creation-route-panel">
        <h4 class="trip-creation-route-panel__title">
            {{ $t('tripCreationRouteDetails') }}
        </h4>
        <div class="trip-creation-route-panel__stats">
            <div class="trip-creation-route-panel__stat">
                <span class="trip-creation-route-panel__stat-label">{{
                    $t('distanciaARecorrer')
                }}</span>
                <span class="trip-creation-route-panel__stat-value">{{
                    distanceString
                }}</span>
            </div>
            <span class="trip-creation-route-panel__stats-sep" aria-hidden="true"
                >&middot;</span
            >
            <div class="trip-creation-route-panel__stat">
                <span class="trip-creation-route-panel__stat-label">{{
                    $t('tiempoEstimado')
                }}</span>
                <span class="trip-creation-route-panel__stat-value">{{
                    estimatedTimeString
                }}</span>
            </div>
            <span class="trip-creation-route-panel__stats-sep" aria-hidden="true"
                >&middot;</span
            >
            <div class="trip-creation-route-panel__stat">
                <span class="trip-creation-route-panel__stat-label">{{
                    $t('huellaCarbono')
                }}</span>
                <span class="trip-creation-route-panel__stat-value">{{
                    co2String
                }}</span>
            </div>
        </div>
        <div
            ref="mapEl"
            class="trip-creation-route-panel__map"
            data-testid="trip-creation-route-map"
        ></div>
    </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { appLocaleToRoutingLanguage } from '../../main';
import { leafletOsrmServiceUrl } from '../../utils/osrmRouting';
import {
    ensureLeafletDefaultIconImages,
    tripWaypointIcon
} from '../../utils/leafletIcons';
import 'leaflet-routing-machine';

export default {
    name: 'trip-creation-route-panel',

    props: {
        points: {
            type: Array,
            required: true
        },
        distanceString: {
            type: String,
            default: ''
        },
        estimatedTimeString: {
            type: String,
            default: ''
        },
        co2String: {
            type: String,
            default: ''
        },
        center: {
            type: Array,
            required: true
        },
        zoom: {
            type: Number,
            default: 6
        },
        url: {
            type: String,
            required: true
        },
        attribution: {
            type: String,
            default: ''
        }
    },

    data() {
        return {
            map: null,
            routingControl: null
        };
    },

    computed: {
        hasRoute() {
            if (!Array.isArray(this.points) || this.points.length < 2) {
                return false;
            }
            const origin = this.points[0];
            const destination = this.points[this.points.length - 1];
            return Boolean(
                origin &&
                    destination &&
                    origin.json &&
                    destination.json &&
                    origin.location &&
                    destination.location
            );
        },
        routeLatLngs() {
            if (!this.hasRoute) {
                return [];
            }
            return this.points
                .filter((point) => point && point.location)
                .map((point) =>
                    L.latLng(
                        parseFloat(point.location.lat),
                        parseFloat(point.location.lng)
                    )
                );
        }
    },

    watch: {
        routeLatLngs: {
            deep: true,
            handler() {
                this.$nextTick(() => this.syncRouteMap());
            }
        }
    },

    mounted() {
        this.$nextTick(() => this.syncRouteMap());
    },

    beforeUnmount() {
        this.destroyRouteMap();
    },

    methods: {
        destroyRouteMap() {
            if (this.routingControl && this.map) {
                try {
                    this.map.removeControl(this.routingControl);
                } catch (_) {
                    /* noop */
                }
                this.routingControl = null;
            }
            if (this.map) {
                try {
                    this.map.remove();
                } catch (_) {
                    /* noop */
                }
                this.map = null;
            }
        },
        syncRouteMap() {
            const el = this.$refs.mapEl;
            if (!el || !this.hasRoute || this.routeLatLngs.length < 2) {
                this.destroyRouteMap();
                return;
            }

            this.destroyRouteMap();

            const mapCenter = this.center || [
                this.routeLatLngs[0].lat,
                this.routeLatLngs[0].lng
            ];
            const map = L.map(el).setView(mapCenter, this.zoom);
            L.tileLayer(this.url, { attribution: this.attribution }).addTo(map);
            this.map = map;

            const routingLang =
                appLocaleToRoutingLanguage[this.$i18n.locale] || 'es';
            const osrmServiceUrl = leafletOsrmServiceUrl();
            ensureLeafletDefaultIconImages();
            const waypointCount = this.routeLatLngs.length;

            this.routingControl = L.Routing.control({
                router: L.Routing.osrmv1({
                    serviceUrl: osrmServiceUrl,
                    language: routingLang,
                    suppressDemoServerWarning: true
                }),
                waypoints: this.routeLatLngs,
                language: routingLang,
                draggableWaypoints: false,
                addWaypoints: false,
                createMarker(i, wp) {
                    return L.marker(wp.latLng, {
                        draggable: false,
                        icon: tripWaypointIcon(i, waypointCount)
                    });
                }
            });
            this.routingControl.addTo(map);
            map.invalidateSize();
        }
    }
};
</script>

<style scoped>
.trip-creation-route-panel {
    margin-top: 1.25rem;
}

.trip-creation-route-panel__title {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
}

.trip-creation-route-panel__stats {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 0.75rem;
}

.trip-creation-route-panel__stat {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    min-width: 0;
}

.trip-creation-route-panel__stat-label {
    font-size: 0.75rem;
    font-weight: 700;
    line-height: 1.2;
    color: var(--ds-text-secondary, #666);
}

.trip-creation-route-panel__stat-value {
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25;
    color: var(--ds-text-primary, #333);
}

.trip-creation-route-panel__stats-sep {
    color: #bbb;
    font-size: 1rem;
    line-height: 1;
}

.trip-creation-route-panel__map {
    width: 100%;
    height: 280px;
    margin-top: 1rem;
    border-radius: 8px;
    overflow: hidden;
    z-index: 0;
}
</style>
