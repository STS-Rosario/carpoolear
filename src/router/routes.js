
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
    name: 'login',
    component: require('../components/Login')
  },
  {
    path: '/register',
    name: 'register',
    component: require('../components/Register')
  },
  {
    path: '/trips',
    component: require('../components/Trips'),
  },
  {
    path: '/trips/:trip',
    name: 'detail_trip',
    component: require('../components/Trip'),
    props: true
  },
  {
    path: '/*',
    redirect: '/trips'
  }
]
