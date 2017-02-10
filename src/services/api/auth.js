import Network from '../network.js'

export default {

  login (creds) {
    return Network.get('login', creds)
  },

  register () {

  },

  logout () {

  },

  retoken () {

  }
}
