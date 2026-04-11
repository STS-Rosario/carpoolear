/* jshint esversion: 6 */
import { auth, guest, profileComplete, authAdmin, requireIdentityValidation } from './middleware.js';
import { useAuthStore } from '../stores/auth';

function getAuthStore () {
    return useAuthStore();
}

const Login = () => import('../components/views/Login.vue');
const Register = () => import('../components/views/Register.vue');
const Activate = () => import('../components/views/Activate.vue');
const ResetPassword = () => import('../components/views/ResetPassword.vue');
const Profile = () => import('../components/views/Profile.vue');
const MyTrips = () => import('../components/views/MyTrips.vue');
const Trips = () => import('../components/views/Trips.vue');
const NewTrip = () => import('../components/views/NewTrip.vue');
const Trip = () => import('../components/views/Trip.vue');
const Notifications = () => import('../components/views/Notifications.vue');
const Settings = () => import('../components/views/Settings.vue');
const ConversationList = () => import('../components/views/ConversationList.vue');
const ConversationChat = () => import('../components/views/ConversationChat.vue');
const About = () => import('../components/views/About.vue');
const Transactions = () => import('../components/views/transactions.vue');
const TermsAndConditions = () => import('../components/views/TermsAndConditions.vue');
const AdminPage = () => import('../components/views/AdminPage.vue');
const UsersCrud = () => import('../components/views/UsersCrud.vue');
const AdminTrips = () => import('../components/views/AdminTrips.vue');
const UsersDeleteList = () => import('../components/views/UsersDeleteList.vue');
const BannedUsersList = () => import('../components/views/BannedUsersList.vue');
const AdminManualIdentityValidations = () => import('../components/views/AdminManualIdentityValidations.vue');
const AdminManualIdentityValidationReview = () => import('../components/views/AdminManualIdentityValidationReview.vue');
const AdminMpRejectedValidations = () => import('../components/views/AdminMpRejectedValidations.vue');
const AdminMpRejectedValidationDetail = () => import('../components/views/AdminMpRejectedValidationDetail.vue');

const UpdateProfile = () => import('../components/sections/UpdateProfile.vue');
const FriendsSetting = () => import('../components/sections/FriendsSetting.vue');
const FriendsRequest = () => import('../components/sections/FriendsRequest.vue');
const IdentityValidation = () => import('../components/sections/IdentityValidation.vue');
const ManualIdentityValidation = () => import('../components/sections/ManualIdentityValidation.vue');
const Debug = () => import('../components/sections/Debug.vue');

export default [
    {
        path: '/login',
        name: 'login',
        beforeEnter: guest,
        component: Login,
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
        component: Register,
        meta: {
            actionbar: {
                header: {
                    logo: {
                        get show () {
                            const config = getAuthStore().appConfig;
                            return config && config.trip_card_design === 'light';
                        }
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
        component: Activate,
        props: true
    },
    {
        path: '/reset-password',
        name: 'reset-password',
        beforeEnter: guest,
        component: ResetPassword,
        props: true,
        meta: {
            actionbar: {
                header: {
                    logo: {
                        get show () {
                            const config = getAuthStore().appConfig;
                            return config && config.trip_card_design === 'light';
                        }
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
        component: ResetPassword,
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
        component: Profile,
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
        component: MyTrips,
        beforeEnter: (to, from, next) => {
            if (!getAuthStore().checkLogin) {
                auth(to, from, next);
                return;
            }
            requireIdentityValidation(to, from, () => {
                profileComplete(to, from, next);
            });
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
        component: Trips,
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
        component: NewTrip,
        beforeEnter: (to, from, next) => {
            if (!getAuthStore().checkLogin) {
                auth(to, from, next);
                return;
            }
            requireIdentityValidation(to, from, () => {
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
        component: NewTrip,
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
        component: Trip,
        beforeEnter: (to, from, next) => {
            if (!getAuthStore().checkLogin) {
                auth(to, from, next);
                return;
            }
            requireIdentityValidation(to, from, () => {
                profileComplete(to, from, next);
            });
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
        component: Trip,
        beforeEnter: (to, from, next) => {
            if (!getAuthStore().checkLogin) {
                auth(to, from, next);
                return;
            }
            requireIdentityValidation(to, from, () => {
                profileComplete(to, from, next);
            });
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
        component: Notifications,
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
        component: Settings,
        beforeEnter: auth,
        children: [
            {
                path: 'profile',
                name: 'profile_update',
                component: UpdateProfile,
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
                component: FriendsSetting,
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
                component: FriendsRequest,
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
                component: IdentityValidation,
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
                component: ManualIdentityValidation,
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
            },
            {
                path: 'debug',
                name: 'debug_setting',
                component: Debug,
                meta: {
                    tab: 'debug',
                    actionbar: {
                        footer: {
                            show: true,
                            active_id: 'profile'
                        },
                        header: {
                            titleKey: 'debug',
                            buttons: ['menu']
                        }
                    }
                }
            }
        ]
    },
    {
        path: '/conversations',
        name: 'conversations-list',
        component: ConversationList,
        beforeEnter: (to, from, next) => {
            if (!getAuthStore().checkLogin) {
                auth(to, from, next);
                return;
            }
            requireIdentityValidation(to, from, () => {
                profileComplete(to, from, next);
            });
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
                component: ConversationChat,
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
        component: About,
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
        component: Transactions,
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
        component: TermsAndConditions,
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
        component: AdminPage,
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
        component: UsersCrud,
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
        component: AdminTrips,
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
        component: UsersDeleteList,
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
        component: BannedUsersList,
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
        component: AdminManualIdentityValidations,
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
        component: AdminManualIdentityValidationReview,
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
        component: AdminMpRejectedValidations,
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
        component: AdminMpRejectedValidationDetail,
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
