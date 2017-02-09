
import m from './middleware.js'

export default [
  {
    path: '/hello',
    component: require('../components/Hello')
        // beforeEnter: auth
  },
  {
    path: '/admin',
    component: require('../components/Hello'),
    beforeEnter: m.auth
  },
  {
    path: '/*',
    redirect: '/hello'
  }
]
