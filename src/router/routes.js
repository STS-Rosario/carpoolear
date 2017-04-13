/*jshint esversion: 6 */
import m from './middleware.js';

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
    name: 'login',
    component: require('../Components/Login')
  },
  {
    path: '/register',
    name: 'register',
    component: require('../Components/Register')
  },
  {
    path: '/activate/:token',
    name: 'activate',
    component: require('../Components/Activate'),
    props: true
  },
  {
    path: '/trips',
    name: 'trips',
    component: require('../Components/Trips')
  },
  {
    path: '/trips/:trip',
    name: 'detail_trip',
    component: require('../Components/Trip'),
    props: true
  },
  {
    path: '/*',
    redirect: '/trips'
  }
];
