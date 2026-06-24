export function restoreTripPointDetailsFromTrip(targetTrip, sourceTrip) {
    targetTrip.punto_partida = sourceTrip?.punto_partida || '';
    targetTrip.punto_llegada = sourceTrip?.punto_llegada || '';
    return targetTrip;
}
