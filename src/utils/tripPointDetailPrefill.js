export function restoreTripPointDetailsFromTrip(targetTrip, sourceTrip) {
    targetTrip.punto_partida = sourceTrip?.punto_partida || '';
    targetTrip.punto_llegada = sourceTrip?.punto_llegada || '';
    return targetTrip;
}

export function syncReturnTripPointDetailsFromOutbound(outboundTrip, returnTrip) {
    returnTrip.punto_partida = outboundTrip?.punto_llegada || '';
    returnTrip.punto_llegada = outboundTrip?.punto_partida || '';
    return returnTrip;
}
