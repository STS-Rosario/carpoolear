
import m from './middleware.js'

export default [
  {
    path: '/about',
    component: require('../components/About')
  },
  {
    path: '/admin',
    component: require('../components/About'),
    beforeEnter: m.auth
  },
  {
    path: '/login',
    component: require('../components/Login')
  },
  {
    path: '/trips',
    component: require('../components/Trips'),
  },
  {
    path: '/trips/:id',
    component: require('../components/Trip'),
  },
  {
    path: '/*',
    redirect: '/trips'
  }
]
