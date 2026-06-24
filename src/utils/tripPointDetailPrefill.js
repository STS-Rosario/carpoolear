export function restoreTripPointDetailsFromTrip(targetTrip, sourceTrip) {
    /* eslint-disable camelcase -- trip API fields use snake_case */
    targetTrip.punto_partida = sourceTrip?.punto_partida || '';
    targetTrip.punto_llegada = sourceTrip?.punto_llegada || '';
    /* eslint-enable camelcase */
    return targetTrip;
}

export function syncReturnTripPointDetailsFromOutbound(outboundTrip, returnTrip) {
    /* eslint-disable camelcase -- trip API fields use snake_case */
    returnTrip.punto_partida = outboundTrip?.punto_llegada || '';
    returnTrip.punto_llegada = outboundTrip?.punto_partida || '';
    /* eslint-enable camelcase */
    return returnTrip;
}
