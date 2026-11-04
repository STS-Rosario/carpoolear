import { describe, expect, it } from 'vitest';
import {
    applyRouteOptionToTripForm,
    applyTripInfoDataForRouteIndex,
    clampRouteIndex,
    routeOptionAtIndex
} from './tripRouteOptions.js';

describe('tripRouteOptions', () => {
    it('clamps route index to available options', () => {
        expect(clampRouteIndex(0, 2)).toBe(0);
        expect(clampRouteIndex(1, 2)).toBe(1);
        expect(clampRouteIndex(9, 2)).toBe(1);
        expect(clampRouteIndex(-1, 2)).toBe(0);
        expect(clampRouteIndex(0, 0)).toBe(0);
    });

    it('returns route option by index', () => {
        const data = {
            route_options: [
                { route_index: 0, distance: 100 },
                { route_index: 1, distance: 200 }
            ]
        };
        expect(routeOptionAtIndex(data, 1).distance).toBe(200);
    });

    it('applyRouteOptionToTripForm updates distance and pricing on outbound trip', () => {
        const ctx = {
            trip: { distance: 0, co2: 0, selected_route_index: 0 },
            duration: 0,
            routeOptions: [{ route_index: 0 }, { route_index: 1 }],
            selectedRouteIndex: 0,
            route_needs_payment: false,
            maximum_trip_price_cents: 0,
            recommended_trip_price_cents: 0,
            pricing_breakdown: null,
            recalculateRecommendedPrice: () => {}
        };

        applyRouteOptionToTripForm(
            ctx,
            {
                distance: 120000,
                duration: 3600,
                co2: 18000,
                route_needs_payment: true,
                maximum_trip_price_cents: 50000,
                recommended_trip_price_cents: 40000,
                pricing_breakdown: { total_cents: 40000 }
            },
            1,
            'trip'
        );

        expect(ctx.trip.distance).toBe(120000);
        expect(ctx.duration).toBe(3600);
        expect(ctx.selectedRouteIndex).toBe(1);
        expect(ctx.trip.selected_route_index).toBe(1);
        expect(ctx.maximum_trip_price_cents).toBe(50000);
    });

    it('applyTripInfoDataForRouteIndex uses route_options when present', () => {
        const ctx = {
            trip: { distance: 0, co2: 0, selected_route_index: 0 },
            duration: 0,
            routeOptions: [],
            selectedRouteIndex: 0,
            route_needs_payment: false,
            maximum_trip_price_cents: 0,
            recommended_trip_price_cents: 0,
            pricing_breakdown: null,
            recalculateRecommendedPrice: () => {}
        };

        applyTripInfoDataForRouteIndex(
            ctx,
            {
                distance: 100,
                duration: 10,
                co2: 15,
                route_needs_payment: false,
                maximum_trip_price_cents: 1,
                recommended_trip_price_cents: 1,
                pricing_breakdown: null,
                route_options: [
                    {
                        route_index: 0,
                        distance: 100,
                        duration: 10,
                        co2: 15,
                        route_needs_payment: false,
                        maximum_trip_price_cents: 1,
                        recommended_trip_price_cents: 1,
                        pricing_breakdown: null
                    },
                    {
                        route_index: 1,
                        distance: 200,
                        duration: 20,
                        co2: 30,
                        route_needs_payment: false,
                        maximum_trip_price_cents: 2,
                        recommended_trip_price_cents: 2,
                        pricing_breakdown: null
                    }
                ]
            },
            1,
            'trip'
        );

        expect(ctx.routeOptions).toHaveLength(2);
        expect(ctx.trip.distance).toBe(200);
        expect(ctx.selectedRouteIndex).toBe(1);
    });
});
