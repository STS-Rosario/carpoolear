import store from '../store'

export default {
  auth (to, from, next) {
    if (store.getters['auth/checkLogin']) {
      next()
    } else {
      next('/')
    }
  }
}
