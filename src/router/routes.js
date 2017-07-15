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
        component: require('../components/views/Login'),
        meta: {
            actionbar: {
                header: {
                    logo: {
                        show: false
                    }
                }
            },
            background: {
                style: 'blue'
            }
        }
    },
    {
        path: '/register',
        name: 'register',
        component: require('../components/views/Register'),
        meta: {
            actionbar: {
                header: {
                    logo: {
                        show: false
                    }
                }
            },
            background: {
                style: 'blue'
            }
        }
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
        props: true,
        meta: {
            actionbar: {
                header: {
                    logo: {
                        show: false
                    }
                }
            },
            background: {
                style: 'blue'
            }
        }
    },
    {
        path: '/reset-password/:token',
        name: 'reset-password-confirm',
        component: require('../components/views/ResetPassword'),
        props: true
    },
    {
        path: '/profile/:id',
        name: 'profile',
        component: require('../components/views/Profile.vue'),
        props: true,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'profile'
                },
                header: {
                    title: 'Mi Perfil',
                    buttons: []
                }
            }
        }
    },
    {
        path: '/my-trips',
        name: 'my-trips',
        component: require('../components/views/MyTrips'),
        beforeEnter: auth,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'profile'
                },
                header: {
                    title: 'Mis Viajes',
                    buttons: []
                }
            }
        }
    },
    {
        path: '/trips',
        name: 'trips',
        component: require('../components/views/Trips'),
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'home'
                },
                header: {
                    buttons: ['search']
                }
            }
        }
    },
    {
        path: '/trips/create',
        name: 'new-trip',
        component: require('../components/views/NewTrip'),
        beforeEnter: auth,
        meta: {
            actionbar: {
                header: {
                    title: 'Crear viaje',
                    buttons: ['clear']
                }
            }
        }
    },
    {
        path: '/trips/update/:id',
        name: 'update-trip',
        component: require('../components/views/NewTrip'),
        beforeEnter: auth,
        props: true,
        meta: {
            actionbar: {
                header: {
                    title: 'Editar viaje',
                    buttons: ['clear']
                }
            }
        }
    },
    {
        path: '/trips/:id',
        name: 'detail_trip',
        component: require('../components/views/Trip'),
        beforeEnter: auth,
        props: true,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'home'
                },
                header: {
                    title: 'Viaje',
                    buttons: ['back']
                }
            }
        }
    },
    {
        path: '/notifications',
        name: 'notifications',
        component: require('../components/views/Notifications.vue'),
        beforeEnter: auth,
        props: true,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'notifications'
                },
                header: {
                    title: 'Notificaciones'
                }
            }
        }
    },
    {
        path: '/setting',
        component: require('../components/views/Settings.vue'),
        beforeEnter: auth,
        children: [
            {
                path: 'profile',
                name: 'profile_update',
                component: require('../components/sections/UpdateProfile.vue'),
                meta: { tab: 'profile' }
            },
            {
                path: 'friends',
                name: 'friends_setting',
                component: require('../components/sections/FriendsSetting.vue'),
                meta: { tab: 'friends' }
            },
            {
                path: 'friends/search',
                name: 'friends_search',
                component: require('../components/sections/FriendsRequest.vue'),
                meta: { tab: 'friends' }
            }
        ]
    },
    {
        path: '/conversations',
        name: 'conversations-list',
        component: require('../components/views/ConversationList'),
        beforeEnter: auth,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'conversations'
                },
                header: {
                    title: 'Mensajes'
                }
            }
        },
        children: [
            {
                path: ':id',
                name: 'conversation-chat',
                component: require('../components/views/ConversationChat'),
                props: true,
                meta: {
                    hide: true,
                    actionbar: {
                        footer: {
                            show: true,
                            active_id: 'conversations'
                        }
                    }
                }
            }
        ]
    },
    {
        path: '/*',
        redirect: '/trips'
    }
];
