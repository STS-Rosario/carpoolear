<template>
    <div>
        <Loading class="container" :data="notifications">
            <div
                v-if="isPWA() && !hasNotificationPermission && showNotificationWarning"
                class="alert alert-warning ios-notification-warning"
                style="text-align: center"
                role="alert"
            >
                <h4>⚠️ {{ $t('notificacionesNoHabilitadas') }}</h4>
                <p>
                    {{ $t('notificacionesNoAceptastePermisos') }}
                </p>
                <br/>
                <div class="notification-warning-buttons">
                    <button
                        class="btn btn-success"
                        @click="requestNotificationPermission"
                    >
                        {{ $t('otorgarPermisos') }}
                    </button>
                    <button
                        class="btn btn-default"
                        @click="dismissNotificationWarning"
                        style="margin-left: 10px"
                    >
                        {{ $t('noMostrarDeNuevo') }}
                    </button>
                </div>
            </div>
            <div class="notifications-list list-group">
                <div
                    class="list-group-item"
                    v-for="n in notifications"
                    :class="{ unread: !n.readed }"
                    @click="onNotificationClick(n)"
                >
                    <div class="row">
                        <div class="col-xs-22">
                            <i
                                class="fa fa-bell-o"
                                aria-hidden="true"
                                v-show="!n.readed"
                            ></i>
                            <strong>{{ n.text }}</strong>
                            <em>{{ n.created_at | moment('calendar') }}</em>
                        </div>
                        <span class="col-xs-2 text-right">
                            <i
                                class="fa fa-chevron-right"
                                aria-hidden="true"
                            ></i>
                        </span>
                    </div>
                </div>
            </div>
            <div class="text-right">
                <button class="btn btn-primary" v-on:click="nextPage()">
                    {{ $t('siguiente') }}
                </button>
            </div>
            <p slot="no-data" class="alert alert-warning" role="alert">
                {{ $t('noHayNotificaciones') }}
            </p>
            <p slot="loading" class="alert alert-info" role="alert">
                <img
                    src="https://carpoolear.com.ar/static/img/loader.gif"
                    alt=""
                    class="ajax-loader"
                />
                {{ $t('cargandoNotificaciones') }}
            </p>
        </Loading>
    </div>
</template>

<script>
import Loading from '../Loading';
import { mapActions, mapGetters } from 'vuex';
import router from '../../router';
import dialogs from '../../services/dialogs.js';
import push from '../../cordova/push-capacitor.js';


export default {
    name: 'notifications',

    data() {
        return {
            query: {
                page: 1,
                page_size: 25,
                mark: true
            },
            hasNotificationPermission: false,
            showNotificationWarning: false
        };
    },

    methods: {
        ...mapActions({
            search: 'notifications/index'
        }),
        isPWA() {
            return !window.Capacitor || window.Capacitor.getPlatform() === 'web';
        },
        checkNotificationPermission() {
            if (window.Notification && window.Notification.permission) {
                if (window.Notification.permission === 'granted') {
                    this.hasNotificationPermission = true;
                    this.showNotificationWarning = false;
                } else {
                    this.hasNotificationPermission = false;
                    const dismissedAt = parseInt(localStorage.getItem('pwa_notification_dismiss'));
                    this.showNotificationWarning = !dismissedAt || Date.now() - dismissedAt > 14 * 24 * 3600 * 1000;
                }
            }
        },
        requestNotificationPermission() {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    this.hasNotificationPermission = true;
                    this.showNotificationWarning = false;
                    // Initialize push-capacitor.js after permission is granted
                    try {
                        setTimeout(() => {
                            push.init();
                        }, 3000);
                    } catch (error) {
                        console.log(
                            'Error initializing push notifications:',
                            error
                        );
                    }
                    dialogs.message(this.$t('notificacionesPermitidas'), {
                        duration: 10,
                        estado: 'success'
                    });
                } else {
                    dialogs.message(this.$t('notificacionesDenegadas'), {
                        duration: 10,
                        estado: 'error'
                    });
                }
            });
        },
        dismissNotificationWarning() {
            this.showNotificationWarning = false;
            localStorage.setItem('pwa_notification_dismiss', Date.now());
        },
        onNotificationClick(n) {
            console.log('onNotificationClick', n);
            if (n.extras) {
                console.log(n.extras);
                switch (n.extras.type) {
                    case 'trip':
                        router.push({
                            name: 'detail_trip',
                            params: { id: n.extras.trip_id }
                        });
                        break;
                    case 'friends':
                        router.push({ name: 'friends_setting' });
                        break;
                    case 'subscription':
                        router.push({
                            name: 'my-trips',
                            query: { loc: 'suscriptions' }
                        });
                        break;
                    case 'my-trips':
                        router.push({ name: 'my-trips' });
                        break;
                    case 'conversation':
                        router.push({
                            name: 'conversation-chat',
                            params: { id: n.extras.conversation_id }
                        });
                        break;
                    case 'announcement':
                        // open external url
                        if (n.extras.external_url) {
                            window.open(n.extras.external_url);
                        }
                        break;
                }
            }
        },
        nextPage() {
            this.query.page += 1;
            this.search(this.query);
        }
    },

    computed: {
        ...mapGetters({
            notifications: 'notifications/index',
            appConfig: 'auth/appConfig'
        })
    },

    mounted() {
        this.search(this.query);

        if (this.appConfig.web_push_notification && this.isPWA()) {
            this.checkNotificationPermission();
        }
    },

    components: {
        Loading
    }
};
</script>

<style scoped>
.container {
    padding: 3em 2em;
}
.notifications-list .list-group-item {
    cursor: pointer;
}
.notifications-list .list-group-item:hover {
    background: #eee;
}
.notifications-list .list-group-item.unread {
    background: rgba(254, 153, 0, 0.25);
}
.notifications-list .list-group-item.unread:hover {
    background: rgba(254, 222, 0, 0.1);
}
</style>
