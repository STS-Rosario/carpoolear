<template>
    <div>
        <Loading class="container" :data="notifications">
            <div
                v-if="isPWA() && !hasNotificationPermission && showNotificationWarning"
                class="alert alert-warning ios-notification-warning"
                style="text-align: center"
                role="alert"
            >
                <h4>{{ t('notificacionesNoHabilitadas') }}</h4>
                <p>
                    {{ t('notificacionesNoAceptastePermisos') }}
                </p>
                <br/>
                <div class="notification-warning-buttons">
                    <button
                        class="btn btn-success"
                        @click="requestNotificationPermission"
                    >
                        {{ t('otorgarPermisos') }}
                    </button>
                    <button
                        class="btn btn-default"
                        @click="dismissNotificationWarning"
                        style="margin-left: 10px"
                    >
                        {{ t('noMostrarDeNuevo') }}
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
                            <em>{{ formatDate(n.created_at, 'calendar') }}</em>
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
                    {{ t('siguiente') }}
                </button>
            </div>
            <template #no-data>
                <p class="alert alert-warning" role="alert">
                    {{ t('noHayNotificaciones') }}
                </p>
            </template>
            <template #loading>
                <p class="alert alert-info" role="alert">
                    <img
                        src="https://carpoolear.com.ar/static/img/loader.gif"
                        alt=""
                        class="ajax-loader"
                    />
                    {{ t('cargandoNotificaciones') }}
                </p>
            </template>
        </Loading>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useNotificationsStore } from '@/stores/notifications';
import { useAuthStore } from '@/stores/auth';
import { formatDate } from '@/composables/useFormatters';
import Loading from '../Loading';
import dialogs from '../../services/dialogs.js';
import push from '../../cordova/push-capacitor.js';

const { t } = useI18n();
const router = useRouter();
const notificationsStore = useNotificationsStore();
const authStore = useAuthStore();

const query = reactive({
    page: 1,
    page_size: 25,
    mark: true
});
const hasNotificationPermission = ref(false);
const showNotificationWarning = ref(false);

const notifications = computed(() => notificationsStore.list);
const appConfig = computed(() => authStore.appConfig);

const isPWA = () => {
    return !window.Capacitor || window.Capacitor.getPlatform() === 'web';
};

const checkNotificationPermission = () => {
    if (window.Notification && window.Notification.permission) {
        if (window.Notification.permission === 'granted') {
            hasNotificationPermission.value = true;
            showNotificationWarning.value = false;
        } else {
            hasNotificationPermission.value = false;
            const dismissedAt = parseInt(localStorage.getItem('pwa_notification_dismiss'));
            showNotificationWarning.value = !dismissedAt || Date.now() - dismissedAt > 14 * 24 * 3600 * 1000;
        }
    }
};

const requestNotificationPermission = () => {
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            hasNotificationPermission.value = true;
            showNotificationWarning.value = false;
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
            dialogs.message(t('notificacionesPermitidas'), {
                duration: 10,
                estado: 'success'
            });
        } else {
            dialogs.message(t('notificacionesDenegadas'), {
                duration: 10,
                estado: 'error'
            });
        }
    });
};

const dismissNotificationWarning = () => {
    showNotificationWarning.value = false;
    localStorage.setItem('pwa_notification_dismiss', Date.now());
};

const onNotificationClick = (n) => {
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
                if (n.extras.external_url) {
                    window.open(n.extras.external_url);
                }
                break;
        }
    }
};

const nextPage = () => {
    query.page += 1;
    notificationsStore.index(query);
};

onMounted(() => {
    notificationsStore.index(query);

    if (appConfig.value.web_push_notification && isPWA()) {
        checkNotificationPermission();
    }
});
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
