/* jshint esversion: 6 */
import { auth, guest, profileComplete, authAdmin, requireIdentityValidation } from './middleware.js';
import store from '../store/index';

const getters = store.getters;

export default [
    {
        path: '/login',
        name: 'login',
        beforeEnter: guest,
        component: require('../components/views/Login').default,
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
        component: require('../components/views/Register').default,
        meta: {
            actionbar: {
                header: {
                    logo: {
                        show:
                            getters &&
                            getters['auth/appConfig'] &&
                            getters['auth/appConfig'].trip_card_design ===
                                'light'
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
        component: require('../components/views/Activate').default,
        props: true
    },
    {
        path: '/reset-password',
        name: 'reset-password',
        beforeEnter: guest,
        component: require('../components/views/ResetPassword').default,
        props: true,
        meta: {
            actionbar: {
                header: {
                    logo: {
                        show:
                            getters &&
                            getters['auth/appConfig'] &&
                            getters['auth/appConfig'].trip_card_design ===
                                'light'
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
        component: require('../components/views/ResetPassword').default,
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
        component: require('../components/views/Profile.vue').default,
        props: true,
        beforeEnter: auth,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'profile'
                },
                header: {
                    titleKey: 'miPerfil',
                    buttons: ['back', 'menu']
                }
            }
        }
    },
    {
        path: '/my-trips',
        name: 'my-trips',
        component: require('../components/views/MyTrips').default,
        beforeEnter: (to, from, next) => {
            if (!store.getters['auth/checkLogin']) {
                auth(to, from, next);
                return;
            }
            requireIdentityValidation(to, from, next);
        },
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'profile'
                },
                header: {
                    titleKey: 'misViajes',
                    buttons: []
                }
            }
        }
    },
    {
        path: '/trips',
        name: 'trips',
        component: require('../components/views/Trips').default,
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
        component: require('../components/views/NewTrip').default,
        beforeEnter: (to, from, next) => {
            if (!store.getters['auth/checkLogin']) {
                auth(to, from, next);
                return;
            }
            requireIdentityValidation(to, from, ()=> {
                profileComplete(to, from, next);
            });
        },
        meta: {
            actionbar: {
                header: {
                    titleKey: 'crearViaje',
                    buttons: ['clear']
                }
            }
        }
    },
    {
        path: '/trips/update/:id',
        name: 'update-trip',
        component: require('../components/views/NewTrip').default,
        beforeEnter: auth,
        props: true,
        meta: {
            actionbar: {
                header: {
                    titleKey: 'editarViaje',
                    buttons: ['clear']
                }
            }
        }
    },
    {
        path: '/trips/:id',
        name: 'detail_trip',
        component: require('../components/views/Trip').default,
        beforeEnter: (to, from, next) => {
            if (!store.getters['auth/checkLogin']) {
                auth(to, from, next);
                return;
            }
            requireIdentityValidation(to, from, next);
        },
        props: true,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'home'
                },
                header: {
                    titleKey: 'viaje',
                    buttons: ['back']
                }
            }
        }
    },
    {
        path: '/trips/:id/:location',
        name: 'detail_trip_location',
        component: require('../components/views/Trip'),
        beforeEnter: (to, from, next) => {
            if (!store.getters['auth/checkLogin']) {
                auth(to, from, next);
                return;
            }
            requireIdentityValidation(to, from, next);
        },
        props: true,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'home'
                },
                header: {
                    titleKey: 'viaje',
                    buttons: ['back']
                }
            }
        }
    },
    {
        path: '/notifications',
        name: 'notifications',
        component: require('../components/views/Notifications.vue').default,
        beforeEnter: auth,
        props: true,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'notifications'
                },
                header: {
                    titleKey: 'notificaciones'
                }
            }
        }
    },
    {
        path: '/setting',
        component: require('../components/views/Settings.vue').default,
        beforeEnter: auth,
        children: [
            {
                path: 'profile',
                name: 'profile_update',
                component: require('../components/sections/UpdateProfile.vue')
                    .default,
                meta: {
                    tab: 'profile',
                    actionbar: {
                        footer: {
                            show: true,
                            active_id: 'profile'
                        },
                        header: {
                            titleKey: 'editarPerfil',
                            buttons: ['menu']
                        }
                    }
                }
            },
            {
                path: 'friends',
                name: 'friends_setting',
                component: require('../components/sections/FriendsSetting.vue')
                    .default,
                meta: {
                    tab: 'friends',
                    actionbar: {
                        footer: {
                            show: true,
                            active_id: 'profile'
                        },
                        header: {
                            titleKey: 'amigos',
                            buttons: ['menu']
                        }
                    }
                }
            },
            {
                path: 'friends/search',
                name: 'friends_search',
                component: require('../components/sections/FriendsRequest.vue')
                    .default,
                meta: {
                    tab: 'friends',
                    actionbar: {
                        header: {
                            titleKey: 'buscarAmigos',
                            buttons: ['back']
                        }
                    }
                }
            },
            {
                path: 'identity-validation',
                name: 'identity_validation',
                component:
                    require('../components/sections/IdentityValidation.vue')
                        .default,
                meta: {
                    tab: 'identity_validation',
                    actionbar: {
                        footer: {
                            show: true,
                            active_id: 'profile'
                        },
                        header: {
                            titleKey: 'validarIdentidad',
                            buttons: ['menu']
                        }
                    }
                }
            },
            {
                path: 'identity-validation/manual',
                name: 'identity_validation_manual',
                component:
                    require('../components/sections/ManualIdentityValidation.vue')
                        .default,
                meta: {
                    tab: 'identity_validation',
                    actionbar: {
                        footer: {
                            show: true,
                            active_id: 'profile'
                        },
                        header: {
                            titleKey: 'validacionManual',
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
        component: require('../components/views/ConversationList').default,
        beforeEnter: (to, from, next) => {
            if (!store.getters['auth/checkLogin']) {
                auth(to, from, next);
                return;
            }
            requireIdentityValidation(to, from, next);
        },
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'conversations'
                },
                header: {
                    titleKey: 'mensajes'
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
                component: require('../components/views/ConversationChat')
                    .default,
                props: true,
                meta: {
                    hide: true,
                    actionbar: {
                        footer: {
                            active_id: 'conversations'
                        },
                        header: {
                            titleKey: 'conversacion',
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
        component: require('../components/views/About').default,
        meta: {
            actionbar: {
                header: {
                    titleKey: 'acercaDe',
                    buttons: ['back']
                }
            }
        }
    },
    {
        path: '/transactions',
        name: 'transacciones',
        component: require('../components/views/transactions').default,
        meta: {
            actionbar: {
                header: {
                    titleKey: 'transacciones',
                    buttons: ['back']
                }
            }
        }
    },
    {
        path: '/terminos',
        name: 'terms',
        component: require('../components/views/TermsAndConditions').default,
        meta: {
            actionbar: {
                header: {
                    titleKey: 'terminos',
                    buttons: ['back']
                }
            }
        }
    },
    {
        path: '/admin',
        name: 'admin-page',
        component: require('../components/views/AdminPage').default,
        beforeEnter: authAdmin,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'admin'
                },
                header: {
                    titleKey: 'adminPage',
                    buttons: []
                }
            }
        }
    },
    {
        path: '/admin/users',
        name: 'admin-users',
        component: require('../components/views/UsersCrud').default,
        beforeEnter: authAdmin,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'admin'
                },
                header: {
                    titleKey: 'adminUsers',
                    buttons: []
                }
            }
        }
    },
    {
        path: '/admin/trips',
        name: 'admin-trips',
        component: require('../components/views/AdminTrips.vue').default,
        beforeEnter: authAdmin,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'admin'
                },
                header: {
                    titleKey: 'adminTrips',
                    buttons: []
                }
            }
        }
    },
    {
        path: '/admin/users-delete-list',
        name: 'admin-users-delete-list',
        component: require('../components/views/UsersDeleteList.vue').default,
        beforeEnter: authAdmin,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'admin'
                },
                header: {
                    titleKey: 'pedidosDeEliminacionDeCuenta',
                    buttons: []
                }
            }
        }
    },
    {
        path: '/admin/banned-users',
        name: 'admin-banned-users',
        component: require('../components/views/BannedUsersList.vue').default,
        beforeEnter: authAdmin,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'admin'
                },
                header: {
                    titleKey: 'usuariosBloqueados',
                    buttons: []
                }
            }
        }
    },
    {
        path: '/admin/manual-identity-validations',
        name: 'admin-manual-identity-validations',
        component:
            require('../components/views/AdminManualIdentityValidations.vue')
                .default,
        beforeEnter: authAdmin,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'admin'
                },
                header: {
                    titleKey: 'validacionesManuales',
                    buttons: []
                }
            }
        }
    },
    {
        path: '/admin/manual-identity-validations/:id',
        name: 'admin-manual-identity-validation-review',
        component:
            require('../components/views/AdminManualIdentityValidationReview.vue')
                .default,
        props: true,
        beforeEnter: authAdmin,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'admin'
                },
                header: {
                    titleKey: 'revisarSolicitud',
                    buttons: ['back']
                }
            }
        }
    },
    {
        path: '/admin/mercado-pago-rejected-validations',
        name: 'admin-mp-rejected-validations',
        component: require('../components/views/AdminMpRejectedValidations.vue')
            .default,
        beforeEnter: authAdmin,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'admin'
                },
                header: {
                    titleKey: 'rechazosMercadoPago',
                    buttons: []
                }
            }
        }
    },
    {
        path: '/admin/mercado-pago-rejected-validations/:id',
        name: 'admin-mp-rejected-validation-detail',
        component:
            require('../components/views/AdminMpRejectedValidationDetail.vue')
                .default,
        props: true,
        beforeEnter: authAdmin,
        meta: {
            actionbar: {
                footer: {
                    show: true,
                    active_id: 'admin'
                },
                header: {
                    titleKey: 'detalleRechazoMp',
                    buttons: ['back']
                }
            }
        }
    },
    {
        path: '/*',
        redirect: '/trips'
    }
];
