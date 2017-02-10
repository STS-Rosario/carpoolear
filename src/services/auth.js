export default {

  // User object will let us check authentication status
  user: null,

  authenticated: false,

  token: null,

  setUser (user) {
    this.user = user
    localStorage.setItem('user', JSON.stringify(user))
  },

  getUser () {
    if (!this.user) {
      this.user = localStorage.getItem('user')
    }
    return this.user
  },

  checkAuth () {
    if (this.getAuthToken()) {
      this.authenticated = true
    } else {
      this.authenticated = false
    }
    return this.authenticated
  },

  getAuthToken () {
    if (!this.token) {
      this.token = localStorage.getItem('id_token')
    }
    return this.token
  },

  setAuthToken (token) {
    this.token = token
    localStorage.setItem('id_token', token)
  },

  // The object to be passed as a header for authenticated requests
  getAuthHeader () {
    var token = this.getAuthToken()
    if (token) {
      return {
        'Authorization': 'Bearer ' + this.getAuthToken()
      }
    } else {
      return {}
    }
  },

  logout () {
    this.token = null
    this.user = null
    this.authenticated = null
    localStorage.removeItem('id_token')
    localStorage.removeItem('user')
  }

}
