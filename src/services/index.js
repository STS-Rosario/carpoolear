/*
    Vue Plugin
    Install all services on Vue System
*/

import Network from './network.js'
import Auth from './auth.js'
import Api from './api'

function plugin (Vue) {
  if (plugin.installed) {
    return
  }

  Vue.prototype.$network = Network
  Vue.prototype.$auth = Auth
  Vue.prototype.$api = Api
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export default plugin
