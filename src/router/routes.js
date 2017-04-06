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
    path: '/trips',
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
