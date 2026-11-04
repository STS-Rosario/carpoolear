export function clampRouteIndex(routeIndex, routeCount) {
    const count = Number(routeCount) || 0;
    if (count <= 0) {
        return 0;
    }
    const index = Number(routeIndex) || 0;
    return Math.max(0, Math.min(index, count - 1));
}

/**
 * @param {object|null|undefined} tripInfoData - trip-info `data` payload
 * @param {number} routeIndex
 * @returns {object|null}
 */
export function routeOptionAtIndex(tripInfoData, routeIndex) {
    if (!tripInfoData || !Array.isArray(tripInfoData.route_options)) {
        return null;
    }
    const idx = clampRouteIndex(routeIndex, tripInfoData.route_options.length);
    return tripInfoData.route_options[idx] || null;
}

/**
 * @param {object} ctx - NewTrip component instance (`this`)
 * @param {object} option - route option metrics
 * @param {number} routeIndex
 * @param {'trip'|'returnTrip'} type
 */
export function applyRouteOptionToTripForm(ctx, option, routeIndex, type = 'trip') {
    if (!option || !ctx) {
        return;
    }

    const tripRoot = type === 'trip' ? ctx : ctx.otherTrip;
    tripRoot.trip.distance = option.distance;
    tripRoot.duration = option.duration;
    tripRoot.trip.co2 = option.co2;

    if (type === 'trip') {
        ctx.routeOptions = ctx.routeOptions || [];
        ctx.selectedRouteIndex = clampRouteIndex(
            routeIndex,
            ctx.routeOptions.length || 1
        );
        ctx.trip.selected_route_index = ctx.selectedRouteIndex;
        ctx.route_needs_payment = Boolean(option.route_needs_payment);
        ctx.maximum_trip_price_cents = option.maximum_trip_price_cents;
        ctx.recommended_trip_price_cents = option.recommended_trip_price_cents;
        ctx.pricing_breakdown = option.pricing_breakdown || null;
        ctx.recalculateRecommendedPrice();
    } else {
        ctx.maximum_return_trip_price_cents = option.maximum_trip_price_cents;
        ctx.recommended_return_trip_price_cents =
            option.recommended_trip_price_cents;
        ctx.recalculateRecommendedReturnPrice();
    }
}

/**
 * @param {object} ctx
 * @param {object} tripInfoData
 * @param {number} routeIndex
 * @param {'trip'|'returnTrip'} type
 */
export function applyTripInfoDataForRouteIndex(
    ctx,
    tripInfoData,
    routeIndex,
    type = 'trip'
) {
    if (!tripInfoData) {
        return;
    }

    if (type === 'trip' && Array.isArray(tripInfoData.route_options)) {
        ctx.routeOptions = tripInfoData.route_options;
    }

    const option =
        routeOptionAtIndex(tripInfoData, routeIndex) || tripInfoData;
    applyRouteOptionToTripForm(ctx, option, routeIndex, type);
}
