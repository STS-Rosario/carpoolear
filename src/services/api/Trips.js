import network from '../network.js'
import ApiWithTags from './ApiWithTags'

class Trips extends ApiWithTags { 

  getTrips(data) {
    return this.get('/api/trips', data)
  }

}

export { Trips as default }