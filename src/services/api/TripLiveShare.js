import TaggedApi from '../../classes/TaggedApi';

class TripLiveShareApi extends TaggedApi {
    start(tripId) {
        return this.post(`/api/trips/${tripId}/live-share/start`);
    }

    updateLocation(tripId, lat, lng) {
        return this.put(`/api/trips/${tripId}/live-share/location`, { lat, lng });
    }

    stop(tripId) {
        return this.post(`/api/trips/${tripId}/live-share/stop`);
    }

    status(tripId) {
        return this.get(`/api/trips/${tripId}/live-share`);
    }

    tripView(tripId) {
        return this.get(`/api/trips/${tripId}/live-share/view`);
    }

    publicView(token) {
        return this.get(`/api/live/${token}`);
    }
}

export default TripLiveShareApi;
