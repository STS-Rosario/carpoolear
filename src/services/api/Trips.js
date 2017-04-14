import network from '../network.js'
import TaggedApi from '../../classes/TaggedApi'

class TripApi extends TaggedApi { 

  search(data) {
    return this.get('/api/trips', data)
  }

}

export { TripApi as default }