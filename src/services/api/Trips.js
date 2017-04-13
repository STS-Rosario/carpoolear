import network from '../network.js'
import ApiWithTags from './ApiWithTags'

class Trips extends ApiWithTags { 

  search(data) {
    return this.get('/api/trips', data)
  }

}

export { Trips as default }