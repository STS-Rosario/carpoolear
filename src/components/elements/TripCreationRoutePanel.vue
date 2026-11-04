<template>
    <div v-if="hasRoute" class="trip-creation-route-panel">
        <h4 class="trip-creation-route-panel__title">
            {{ $t('tripCreationRouteDetails') }}
        </h4>
        <div
            class="trip-creation-route-panel__stats"
            aria-live="polite"
        >
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
        <p
            v-if="hasMultipleRouteOptions"
            class="trip-creation-route-panel__hint"
        >
            {{ $t('tripCreationRouteAlternativesHint') }}
        </p>
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
import { addVectorTileLayer } from '../../utils/mapTiles';
import { bindRoutingWaypointFitOnError } from '../../utils/leafletTripMap';

const PRIMARY_ROUTE_STYLES = [
    { color: 'black', opacity: 0.15, weight: 9 },
    { color: 'white', opacity: 0.85, weight: 6 },
    { color: '#c0392b', opacity: 1, weight: 4 }
];

const ALTERNATE_ROUTE_STYLES = [
    { color: 'black', opacity: 0.08, weight: 7 },
    { color: 'white', opacity: 0.55, weight: 4 },
    { color: '#e57373', opacity: 0.75, weight: 3 }
];

export default {
    name: 'trip-creation-route-panel',

    beforeCreate() {
        this._routeMapGeneration = 0;
    },

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
        selectedRouteIndex: {
            type: Number,
            default: 0
        },
        hasMultipleRouteOptions: {
            type: Boolean,
            default: false
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

    emits: ['route-index-selected'],

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
        },
        selectedRouteIndex() {
            this.applySelectedRouteOnMap();
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
            this._routeMapGeneration += 1;
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
        bindRoutingSelectionEvents() {
            if (!this.routingControl) {
                return;
            }
            this.routingControl.on('routesfound', (event) => {
                this.applySelectedRouteOnMap(event.routes);
            });
            this.routingControl.on('routeselected', (event) => {
                const index =
                    event.route && typeof event.route.routesIndex === 'number'
                        ? event.route.routesIndex
                        : 0;
                this.$emit('route-index-selected', index);
            });
        },
        applySelectedRouteOnMap(routes) {
            if (!this.routingControl || !this.routingControl._routes) {
                return;
            }
            const available = routes || this.routingControl._routes;
            if (!Array.isArray(available) || available.length === 0) {
                return;
            }
            const index = Math.max(
                0,
                Math.min(this.selectedRouteIndex, available.length - 1)
            );
            if (index === 0 || !available[index]) {
                return;
            }
            const alts = available.slice();
            const selected = alts.splice(index, 1)[0];
            this.routingControl._routeSelected({
                route: selected,
                alternatives: alts
            });
        },
        async syncRouteMap() {
            const el = this.$refs.mapEl;
            if (!el || !this.hasRoute || this.routeLatLngs.length < 2) {
                this.destroyRouteMap();
                return;
            }

            this.destroyRouteMap();

            const gen = this._routeMapGeneration;
            const mapCenter = this.center || [
                this.routeLatLngs[0].lat,
                this.routeLatLngs[0].lng
            ];
            const map = L.map(el).setView(mapCenter, this.zoom);
            await addVectorTileLayer(map);
            if (gen !== this._routeMapGeneration) {
                try {
                    map.remove();
                } catch (_) {
                    /* noop */
                }
                return;
            }
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
                show: false,
                showAlternatives: true,
                fitSelectedRoutes: 'smart',
                lineOptions: {
                    styles: PRIMARY_ROUTE_STYLES
                },
                altLineOptions: {
                    styles: ALTERNATE_ROUTE_STYLES
                },
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
            this.bindRoutingSelectionEvents();
            bindRoutingWaypointFitOnError(
                this.routingControl,
                map,
                this.routeLatLngs
            );
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

.trip-creation-route-panel__hint {
    margin: 0.75rem 0 0;
    font-size: 0.8125rem;
    line-height: 1.35;
    color: var(--ds-text-secondary, #666);
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
