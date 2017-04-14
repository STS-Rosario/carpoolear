/*jshint esversion: 6 */
import {auth} from './middleware.js';

export default [
  {
    path: '/about',
    component: require('../components/views/About')
  },
  {
    path: '/admin',
    component: require('../components/views/About'),
    beforeEnter: auth
  },
  {
    path: '/login',
    name: 'login',
    component: require('../components/views/Login')
  },
  {
    path: '/register',
    name: 'register',
    component: require('../components/views/Register')
  },
  {
    path: '/activate/:token',
    name: 'activate',
    component: require('../components/views/Activate'),
    props: true
  },
  {
    path: '/trips',
    name: 'trips',
    component: require('../components/views/Trips')
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
];
