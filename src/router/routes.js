/*jshint esversion: 6 */
import m from './middleware.js' 

export default [
  {
    path: '/about',
    component: require('../Components/About')
  },
  {
    path: '/admin',
    component: require('../Components/About'),
    beforeEnter: m.auth
  },
  {
    path: '/login',
    component: require('../Components/Login')
  },
  {
    path: '/trips',
    component: require('../Components/Trips')
  },
  {
    path: '/trips/:id',
    component: require('../Components/Trip')
  },
  {
    path: '/*',
    redirect: '/trips'
  }
];
