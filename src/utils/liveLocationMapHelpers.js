export function createLiveLocationMarkerUpdater(map, getMarker) {
    return (lat, lng) => {
        const marker = getMarker();
        if (!marker) {
            return;
        }
        marker.setLatLng([lat, lng]);
        map.panTo([lat, lng]);
    };
}
