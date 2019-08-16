/* jshint esversion: 6 */
import {auth, guest, profileComplete, authAdmin} from './middleware.js';

export default [
    {
        path: '/login',
        name: 'login',
        beforeEnter: guest,
        component: require('../components/views/Login'),
        meta: {
            actionbar: {
                header: {
                    logo: {
                        show: false
                    },
                    buttons: ['clear']
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
        beforeEnter: guest,
        component: require('../components/views/Register'),
        meta: {
            actionbar: {
                header: {
                    logo: {
                        show: false
                    },
                    buttons: ['back']
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
        beforeEnter: guest,
        component: require('../components/views/Activate'),
        props: true
    },
    {
        path: '/reset-password',
        name: 'reset-password',
        beforeEnter: guest,
        component: require('../components/views/ResetPassword'),
        props: true,
        meta: {
            actionbar: {
                header: {
                    logo: {
                        show: false
                    },
                    buttons: ['back']
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
        beforeEnter: guest,
        component: require('../components/views/ResetPassword'),
        props: true,
        meta: {
            actionbar: {
                header: {
                    logo: {
                        show: false
                    },
                    buttons: ['back']
                }
            },
            background: {
                style: 'blue'
            }
        }
    },
    {
        path: '/profile/:id',
        name: 'profile',
        component: require('../components/views/Profile.vue'),
        props: true,
        beforeEnter: auth,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'profile'
                },
                header: {
                    title: 'Mi Perfil',
                    buttons: ['menu']
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
        props: true,
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
        beforeEnter: (to, from, next) => {
            auth(to, from, next);
            profileComplete(to, from, next);
        },
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
        path: '/trips/:id/:location',
        name: 'detail_trip_location',
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
                meta: {
                    tab: 'profile',
                    actionbar: {
                        footer: {
                            show: true,
                            active_id: 'profile'
                        },
                        header: {
                            title: 'Editar perfil',
                            buttons: ['menu']
                        }
                    }
                }
            },
            {
                path: 'friends',
                name: 'friends_setting',
                component: require('../components/sections/FriendsSetting.vue'),
                meta: {
                    tab: 'friends',
                    actionbar: {
                        footer: {
                            show: true,
                            active_id: 'profile'
                        },
                        header: {
                            title: 'Amigos',
                            buttons: ['menu']
                        }
                    }
                }
            },
            {
                path: 'friends/search',
                name: 'friends_search',
                component: require('../components/sections/FriendsRequest.vue'),
                meta: {
                    tab: 'friends',
                    actionbar: {
                        header: {
                            title: 'Buscar Amigos',
                            buttons: ['back']
                        }
                    }
                }
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
            },
            background: {
                style: 'white'
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
                            active_id: 'conversations'
                        },
                        header: {
                            title: 'Conversación',
                            buttons: ['back']
                        }
                    },
                    background: {
                        style: 'white'
                    }
                }
            }
        ]
    },
    {
        path: '/about',
        name: 'acerca_de',
        component: require('../components/views/About'),
        meta: {
            actionbar: {
                header: {
                    title: 'Acerca de',
                    buttons: ['back']
                }
            }
        }
    },
    {
        path: '/terminos',
        name: 'terms',
        component: require('../components/views/TermsAndConditions'),
        meta: {
            actionbar: {
                header: {
                    title: 'Términos',
                    buttons: ['back']
                }
            }
        }
    },
    {
        path: '/admin',
        name: 'admin-page',
        component: require('../components/views/AdminPage'),
        beforeEnter: authAdmin,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'admin'
                },
                header: {
                    title: 'Admin Page',
                    buttons: []
                }
            }
        }
    },
    {
        path: '/admin/users',
        name: 'admin-users',
        component: require('../components/views/UsersCrud'),
        beforeEnter: authAdmin,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'admin'
                },
                header: {
                    title: 'Admin users',
                    buttons: []
                }
            }
        }
    },
    {
        path: '/*',
        redirect: '/trips'
    }
];
