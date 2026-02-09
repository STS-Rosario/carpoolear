/* jshint esversion: 6 */
import store from '../store';
import * as types from '../store/mutation-types';
import { onMessage, getMessaging, getToken } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { Capacitor } from '@capacitor/core';

class Notification {
    constructor(e) {
        this.foreground = false;
        this.sound = '';
        this.title = '';
        this.content = '';
        this.type = '';
        this.url = '';
        this._original = {};
        this.coldstart = false;

        if (e) {
            // Handle both Capacitor and web notification formats
            if (e.notification) {
                // Web notification format
                this.foreground = true;
                this.title = e.notification.title || '';
                this.content = e.notification.body || '';
                this.data = e.notification.data || e.data || {};
                this.type = this.data.type || '';
                this.url = this.data.url || '';
            } else if (e.data) {
                // Capacitor native notification format
                this.foreground = e.actionId === 'tap';
                this.title = e.title || '';
                this.content = e.body || '';
                this.data = e.data || {};
                this.type = this.data.type || '';
                this.url = this.data.url || '';
                this.coldstart = e.actionId !== 'tap';
            } else {
                // Legacy Cordova format (fallback)
                this.foreground = e.additionalData
                    ? e.additionalData.foreground
                    : false;
                this.sound = e.additionalData
                    ? e.additionalData.sound || ''
                    : '';
                this.title = e.title || '';
                this.content = e.body || e.message || '';
                this.type = e.additionalData ? e.additionalData.type || '' : '';
                this.url = e.additionalData ? e.additionalData.url || '' : '';
                this.data = e.additionalData
                    ? e.additionalData.extras || ''
                    : '';
                this.coldstart = e.additionalData
                    ? e.additionalData.coldstart
                    : false;
            }
            this._original = e;
        }
    }
}

export default {
    async init() {
        if (Capacitor.getPlatform() === 'web') {
            // Web/PWA push notifications using Firebase
            await this.initWebPush();
        } else {
            // Native push notifications using Capacitor
            await this.initNativePush();
        }
    },

    async initWebPush() {
        if (
            process.env.FIREBASE_PARAMS !== undefined &&
            window.Notification &&
            window.Notification.requestPermission
        ) {
            try {
                const firebaseParamsString = new URLSearchParams(
                    process.env.FIREBASE_PARAMS
                ).toString();

                // Get service worker path based on environment
                let serviceWorkerPath =
                    process.env.NODE_ENV === 'production'
                        ? process.env.ROUTE_BASE + 'firebase-messaging-sw.js'
                        : '/static/firebase-messaging-sw.js';

                // Append firebase params as query since service workers can't access process.env
                serviceWorkerPath += '?' + firebaseParamsString;

                const serviceWorker = navigator.serviceWorker
                    .register(serviceWorkerPath)
                    .catch((error) => {
                        console.error(
                            'Service worker registration failed:',
                            error
                        );
                    });

                const reg = await serviceWorker;

                const firebaseApp = initializeApp(process.env.FIREBASE_PARAMS);
                const messaging = getMessaging(firebaseApp);

                // Get FCM token
                const currentToken = await getToken(messaging, {
                    vapidKey: process.env.FIRABASE_VAPID_KEY,
                    serviceWorkerRegistration: reg
                });

                if (currentToken) {
                    store.commit(
                        'cordova/' + types.CORDOVA_DEVICE_REGISTER,
                        currentToken
                    );
                    store.dispatch('device/register').catch((error) => {
                        console.error('❌ Device registration failed:', error);
                    });
                }

                const handleNotification = (payload, isBackgroundMessage) => {
                    const notification = new Notification({
                        notification: payload.notification,
                        data: payload.data
                    });

                    store.dispatch('cordova/notificationArrive', notification);
                    // store.dispatch('conversations/getUnreaded');
                    // store.dispatch('notifications/count');

                    // Background messages already open a notification
                    if (isBackgroundMessage) {
                        return;
                    }

                    // Show native notification for web
                    const notificationTitle = payload.notification.title;
                    const notificationOptions = {
                        body: payload.notification.body,
                        data: payload.data,
                        icon: payload.notification.icon // process.env.ROUTE_BASE + 'static/img/icon-192.png'
                    };

                    if (payload.data.url !== window.location.pathname) {
                        reg.showNotification(
                            notificationTitle,
                            notificationOptions
                        );
                    }
                };

                navigator.serviceWorker.addEventListener('message', (event) => {
                    if (event.data.type === 'firebase-background-message') {
                        handleNotification(event.data.payload, true);
                    }
                });

                // Listen for foreground messages
                onMessage(messaging, handleNotification);
            } catch (error) {
                console.error('Web push initialization error:', error);
            }
        }
    },

    async initNativePush() {
        try {
            // Import push notifications plugin dynamically
            let PushNotifications;
            try {
                const module = await import('@capacitor/push-notifications');
                PushNotifications = module.PushNotifications;
            } catch (error) {
                console.error(
                    '❌ Push Notifications plugin not available:',
                    error
                );

                return;
            }

            // IMPORTANTE: Configurar listeners ANTES de registrar
            PushNotifications.addListener('registration', (token) => {
                store.commit(
                    'cordova/' + types.CORDOVA_DEVICE_REGISTER,
                    token.value
                );

                // Add a small delay to ensure Vuex state is updated before registering with backend
                setTimeout(() => {
                    store
                        .dispatch('device/register')
                        .then(() => {})
                        .catch((error) => {
                            console.error(
                                '❌ Device registration failed:',
                                error
                            );
                        });
                }, 100); // 100ms delay to ensure state is updated
            });

            // Listener para errores de registro - DEBE estar antes del register()
            PushNotifications.addListener('registrationError', (error) => {
                console.error('💥 Push registration error:', error);
                console.error(
                    '📄 Error message:',
                    error.message || 'No message'
                );
            });

            // Listener para notificaciones recibidas
            PushNotifications.addListener(
                'pushNotificationReceived',
                (notification) => {
                    try {
                        const n = new Notification({
                            title: notification.title || '',
                            body: notification.body || '',
                            data: notification.data || {}
                        });
                        n.foreground = true;
                        store.dispatch('cordova/notificationArrive', n);

                        // Try to show a system notification as well
                        if (Capacitor.isNativePlatform()) {
                            // The push notification should automatically appear as a system notification
                            // when the app is in background, but when in foreground we need to handle it
                        }
                    } catch (error) {
                        console.error(
                            '💥 === ERROR HANDLING PUSH NOTIFICATION ==='
                        );
                        console.error('❌ Error details:', error);
                        console.error('🔍 Error stack:', error.stack);
                        console.error(
                            '💥 === PUSH NOTIFICATION ERROR LOGGED ==='
                        );
                    }
                }
            );

            // Listener para taps en notificaciones
            PushNotifications.addListener(
                'pushNotificationActionPerformed',
                (notification) => {
                    try {
                        const n = new Notification({
                            title:
                                (notification.notification &&
                                    notification.notification.title) ||
                                '',
                            body:
                                (notification.notification &&
                                    notification.notification.body) ||
                                '',
                            data:
                                (notification.notification &&
                                    notification.notification.data) ||
                                {},
                            actionId: notification.actionId
                        });
                        n.foreground = false;
                        n.coldstart = true;

                        store.dispatch('cordova/notificationArrive', n);
                    } catch (error) {
                        console.error('💥 === ERROR HANDLING PUSH TAP ===');
                        console.error('❌ Tap error details:', error);
                        console.error('🔍 Tap error stack:', error.stack);
                        console.error('💥 === PUSH TAP ERROR LOGGED ===');
                    }
                }
            );

            // Request permission to use push notifications
            const result = await PushNotifications.requestPermissions();

            if (result.receive === 'granted') {
                try {
                    await PushNotifications.register();
                } catch (registrationError) {
                    console.error(
                        '❌ Push notification registration failed:',
                        registrationError
                    );
                    return;
                }
            } else {
                return;
            }
        } catch (error) {
            console.error('Native push initialization error:', error);
        }
    }
};
