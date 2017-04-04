import network from '../network.js'
import ApiWithTags from './ApiWithTags'

class Auth extends ApiWithTags {

  login (creds) {
    return this.get('login', creds)
  }

  register () {

  }

  logout () {

  }

  retoken () {

  }
}

export { Auth as default }