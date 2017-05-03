/* jshint esversion: 6 */
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
        path: '/my-trips',
        name: 'my-trips',
        component: require('../components/views/MyTrips'),
        beforeEnter: auth
    },
    {
        path: '/trips',
        name: 'trips',
        component: require('../components/views/Trips')
    },
    {
        path: '/trips/create',
        name: 'new-trip',
        component: require('../components/views/NewTrip'),
        beforeEnter: auth
    },
    {
        path: '/trips/update/:id',
        name: 'update-trip',
        component: require('../components/views/NewTrip'),
        beforeEnter: auth,
        props: true
    },
    {
        path: '/trips/:id',
        name: 'detail_trip',
        component: require('../components/views/Trip'),
        beforeEnter: auth,
        props: true
    },
    {
        path: '/*',
        redirect: '/trips'
    }
];
