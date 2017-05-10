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
        path: '/reset-password',
        name: 'reset-password',
        component: require('../components/views/ResetPassword'),
        props: true
    },
    {
        path: '/reset-password/:token',
        name: 'reset-password-confirm',
        component: require('../components/views/ResetPassword'),
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
        path: '/profile/update',
        name: 'profile_update',
        component: require('../components/views/UpdateProfile.vue'),
        beforeEnter: auth
    },
    {
        path: '/conversations',
        name: 'conversations-list',
        component: require('../components/views/ConversationList'),
        beforeEnter: auth,
        children: [
            {
                path: ':id',
                name: 'conversation-chat',
                component: require('../components/views/ConversationChat'),
                props: true,
                meta: {
                    hide: true
                }
            }
        ]
    },
    {
        path: '/*',
        redirect: '/trips'
    }
];
