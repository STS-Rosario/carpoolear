import axios from 'axios';

class OsmApi {
    search (data = {}) {
        let url = `https://nominatim.openstreetmap.org/search/?city=${data.input}&limit=20&format=json&addressdetails=1&accept-language=es`; // &countrycodes=ar
        if (data.country) {
            url += '&countrycodes=' + data.country;
        }
        return axios.get(url).then((result) => {
            if (result.status === 200) {
                return Promise.resolve(result.data);
            } else {
                return Promise.reject(result);
            }
        });
    }
    route (data = {}) {
        let url = `https://router.project-osrm.org/route/v1/driving/${data.origin.lng},${data.origin.lat};${data.destiny.lng},${data.destiny.lat}?overview=false&alternatives=true&steps=true&hints=`; // &countrycodes=ar
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
