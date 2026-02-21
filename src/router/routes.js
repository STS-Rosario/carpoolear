import { auth, guest, profileComplete, authAdmin } from './middleware.js';

export default [
    {
        path: '/login',
        name: 'login',
        beforeEnter: guest,
        component: () => import('../components/views/Login.vue'),
        meta: {
            actionbar: {
                header: {
                    logo: { show: false },
                    buttons: ['clear']
                }
            },
            background: { style: 'blue' }
        }
    },
    {
        path: '/register',
        name: 'register',
        beforeEnter: guest,
        component: () => import('../components/views/Register.vue'),
        meta: {
            actionbar: {
                header: {
                    logo: { show: false },
                    buttons: ['back']
                }
            },
            background: { style: 'blue' }
        }
    },
    {
        path: '/activate/:token',
        name: 'activate',
        beforeEnter: guest,
        component: () => import('../components/views/Activate.vue'),
        props: true
    },
    {
        path: '/reset-password',
        name: 'reset-password',
        beforeEnter: guest,
        component: () => import('../components/views/ResetPassword.vue'),
        props: true,
        meta: {
            actionbar: {
                header: {
                    logo: { show: false },
                    buttons: ['back']
                }
            },
            background: { style: 'blue' }
        }
    },
    {
        path: '/reset-password/:token',
        name: 'reset-password-confirm',
        beforeEnter: guest,
        component: () => import('../components/views/ResetPassword.vue'),
        props: true,
        meta: {
            actionbar: {
                header: {
                    logo: { show: false },
                    buttons: ['back']
                }
            },
            background: { style: 'blue' }
        }
    },
    {
        path: '/profile/:id',
        name: 'profile',
        component: () => import('../components/views/Profile.vue'),
        props: true,
        beforeEnter: auth,
        meta: {
            actionbar: {
                footer: { show: true, active_id: 'profile' },
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
        component: () => import('../components/views/MyTrips.vue'),
        beforeEnter: auth,
        meta: {
            actionbar: {
                footer: { show: true, active_id: 'profile' },
                header: { titleKey: 'misViajes', buttons: [] }
            }
        }
    },
    {
        path: '/trips',
        name: 'trips',
        component: () => import('../components/views/Trips.vue'),
        props: true,
        meta: {
            actionbar: {
                footer: { show: true, active_id: 'home' },
                header: { buttons: ['search'] }
            }
        }
    },
    {
        path: '/trips/create',
        name: 'new-trip',
        component: () => import('../components/views/NewTrip.vue'),
        beforeEnter: (to, from, next) => {
            auth(to, from, next);
            profileComplete(to, from, next);
        },
        meta: {
            actionbar: {
                header: { titleKey: 'crearViaje', buttons: ['clear'] }
            }
        }
    },
    {
        path: '/trips/update/:id',
        name: 'update-trip',
        component: () => import('../components/views/NewTrip.vue'),
        beforeEnter: auth,
        props: true,
        meta: {
            actionbar: {
                header: { titleKey: 'editarViaje', buttons: ['clear'] }
            }
        }
    },
    {
        path: '/trips/:id',
        name: 'detail_trip',
        component: () => import('../components/views/Trip.vue'),
        beforeEnter: auth,
        props: true,
        meta: {
            actionbar: {
                footer: { show: true, active_id: 'home' },
                header: { titleKey: 'viaje', buttons: ['back'] }
            }
        }
    },
    {
        path: '/trips/:id/:location',
        name: 'detail_trip_location',
        component: () => import('../components/views/Trip.vue'),
        beforeEnter: auth,
        props: true,
        meta: {
            actionbar: {
                footer: { show: true, active_id: 'home' },
                header: { titleKey: 'viaje', buttons: ['back'] }
            }
        }
    },
    {
        path: '/notifications',
        name: 'notifications',
        component: () => import('../components/views/Notifications.vue'),
        beforeEnter: auth,
        props: true,
        meta: {
            actionbar: {
                footer: { show: true, active_id: 'notifications' },
                header: { titleKey: 'notificaciones' }
            }
        }
    },
    {
        path: '/setting',
        component: () => import('../components/views/Settings.vue'),
        beforeEnter: auth,
        children: [
            {
                path: 'profile',
                name: 'profile_update',
                component: () => import('../components/sections/UpdateProfile.vue'),
                meta: {
                    tab: 'profile',
                    actionbar: {
                        footer: { show: true, active_id: 'profile' },
                        header: { titleKey: 'editarPerfil', buttons: ['menu'] }
                    }
                }
            },
            {
                path: 'friends',
                name: 'friends_setting',
                component: () => import('../components/sections/FriendsSetting.vue'),
                meta: {
                    tab: 'friends',
                    actionbar: {
                        footer: { show: true, active_id: 'profile' },
                        header: { titleKey: 'amigos', buttons: ['menu'] }
                    }
                }
            },
            {
                path: 'friends/search',
                name: 'friends_search',
                component: () => import('../components/sections/FriendsRequest.vue'),
                meta: {
                    tab: 'friends',
                    actionbar: {
                        header: { titleKey: 'buscarAmigos', buttons: ['back'] }
                    }
                }
            },
            {
                path: 'identity-validation',
                name: 'identity_validation',
                component: () => import('../components/sections/IdentityValidation.vue'),
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
                component: () => import('../components/sections/ManualIdentityValidation.vue'),
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
        component: () => import('../components/views/ConversationList.vue'),
        beforeEnter: auth,
        meta: {
            actionbar: {
                footer: { show: true, active_id: 'conversations' },
                header: { titleKey: 'mensajes' }
            },
            background: { style: 'white' }
        },
        children: [
            {
                path: ':id',
                name: 'conversation-chat',
                component: () => import('../components/views/ConversationChat.vue'),
                props: true,
                meta: {
                    hide: true,
                    actionbar: {
                        footer: { active_id: 'conversations' },
                        header: {
                            titleKey: 'conversacion',
                            buttons: ['back']
                        }
                    },
                    background: { style: 'white' }
                }
            }
        ]
    },
    {
        path: '/about',
        name: 'acerca_de',
        component: () => import('../components/views/About.vue'),
        meta: {
            actionbar: {
                header: { titleKey: 'acercaDe', buttons: ['back'] }
            }
        }
    },
    {
        path: '/transactions',
        name: 'transacciones',
        component: () => import('../components/views/transactions.vue'),
        meta: {
            actionbar: {
                header: { titleKey: 'transacciones', buttons: ['back'] }
            }
        }
    },
    {
        path: '/terminos',
        name: 'terms',
        component: () => import('../components/views/TermsAndConditions.vue'),
        meta: {
            actionbar: {
                header: { titleKey: 'terminos', buttons: ['back'] }
            }
        }
    },
    {
        path: '/admin',
        name: 'admin-page',
        component: () => import('../components/views/AdminPage.vue'),
        beforeEnter: authAdmin,
        meta: {
            actionbar: {
                footer: { show: true, active_id: 'admin' },
                header: { titleKey: 'adminPage', buttons: [] }
            }
        }
    },
    {
        path: '/admin/users',
        name: 'admin-users',
        component: () => import('../components/views/UsersCrud.vue'),
        beforeEnter: authAdmin,
        meta: {
            actionbar: {
                footer: { show: true, active_id: 'admin' },
                header: { titleKey: 'adminUsers', buttons: [] }
            }
        }
    },
    {
        path: '/admin/trips',
        name: 'admin-trips',
        component: () => import('../components/views/AdminTrips.vue'),
        beforeEnter: authAdmin,
        meta: {
            actionbar: {
                footer: { show: true, active_id: 'admin' },
                header: { titleKey: 'adminTrips', buttons: [] }
            }
        }
    },
    {
        path: '/admin/users-delete-list',
        name: 'admin-users-delete-list',
        component: () => import('../components/views/UsersDeleteList.vue'),
        beforeEnter: authAdmin,
        meta: {
            actionbar: {
                footer: { show: true, active_id: 'admin' },
                header: { titleKey: 'pedidosDeEliminacionDeCuenta', buttons: [] }
            }
        }
    },
    {
        path: '/admin/banned-users',
        name: 'admin-banned-users',
        component: () => import('../components/views/BannedUsersList.vue'),
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
        component: () => import('../components/views/AdminManualIdentityValidations.vue'),
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
        component: () => import('../components/views/AdminManualIdentityValidationReview.vue'),
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
        component: () => import('../components/views/AdminMpRejectedValidations.vue'),
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
        component: () => import('../components/views/AdminMpRejectedValidationDetail.vue'),
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
        path: '/:pathMatch(.*)*',
        redirect: '/trips'
    }
];
