import axios from 'axios';

const CancelToken = axios.CancelToken;

class OsmApi {
    constructor () {
        this.requestSource = null;
    }
    search (data = {}) {
        if (this.requestSource) {
            this.requestSource.cancel();
        }
        this.requestSource = CancelToken.source();
        let url = `https://nominatim.openstreetmap.org/search/?city=${data.input}&limit=20&format=json&addressdetails=1&accept-language=es`; // &countrycodes=ar
        if (data.country) {
            url += '&countrycodes=' + data.country;
        }
        return axios.get(url, { cancelToken: this.requestSource.token }).then((result) => {
            if (result.status === 200) {
                return Promise.resolve(result.data);
            } else {
                console.log('osm api error then', result);
                return Promise.reject(result);
            }
        }).catch((err) => {
            console.log('osm api error', axios.isCancel(err));
        });
    }
    route (data = {}) {
        let coords = '';
        data.points.forEach( point => {
            if (coords) {
                coords += ';';
            }
            coords += point.lng + ',';
            coords += point.lat;
        });
        console.log('coords', coords);
        let url = 'https://router.project-osrm.org/route/v1/driving/' + coords + '?overview=false&alternatives=true&steps=true&hints='; // &countrycodes=ar
        return axios.get(url).then((result) => {
            if (result.status === 200) {
                return Promise.resolve(result.data);
            } else {
                return Promise.reject(result);
            }
        });
    }
}

export { OsmApi as default };
