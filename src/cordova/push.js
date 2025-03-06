/* jshint esversion: 6 */
import store from '../store';
import * as types from '../store/mutation-types';
import { onMessage, getMessaging, getToken } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';

class Notification {
    constructor (e) {
        this.foreground = false;
        this.sound = '';
        this.title = '';
        this.content = '';
        this.type = '';
        this.url = '';
        this._original = {};
        this.coldstart = false;

        if (e) {
            // La aplicacion esta abierta y en pantalla
            this.foreground = e.additionalData.foreground; // Coercion
            this.sound = e.additionalData.sound ? e.additionalData.sound : '';
            this.title = e.title ? e.title : '';
            this.content = e.body ? e.body : (e.message ? e.message : '');
            this.type = e.additionalData.type ? e.additionalData.type : '';
            this.url = e.additionalData.url ? e.additionalData.url : '';
            this.data = e.additionalData.extras ? e.additionalData.extras : '';
            this.coldstart = e.additionalData.coldstart;
            this._original = e;
        }
    }
}

export default {
    init () {
        console.log('push init', window.cordova.platformId);
        if (window.cordova.platformId === 'browser') {
            if (process.env.FIREBASE_PARAMS !== undefined && window.Notification && window.Notification.requestPermission) { // process.env.ROUTE_BASE
                const serviceWorker = navigator.serviceWorker.register('/app/' + 'firebase-messaging-sw.js', {
                    // scope: '/static/'
                });
                const permissionNotification = window.Notification.requestPermission().then((permission) => {
                    if (permission === 'granted') {
                        return true;
                    }
                    return Promise.reject(new Error());
                }).catch(() => {
                    return Promise.reject(new Error());
                });

                Promise.all([serviceWorker, permissionNotification]).then(([reg]) => {
                    const firebaseApp = initializeApp(process.env.FIREBASE_PARAMS);
                    const messaging = getMessaging(firebaseApp);
                    getToken(messaging, { vapidKey: process.env.FIRABASE_VAPID_KEY, serviceWorkerRegistration: reg }).then((currentToken) => {
                        if (currentToken) {
                            store.commit('cordova/' + types.CORDOVA_DEVICE_REGISTER, currentToken);
                        } else {
                            console.log('No registration token available. Request permission to generate one.');
                        }
                    }).catch((err) => {
                        console.log('An error occurred while retrieving token. ', err);
                        // ...
                    });

                    onMessage(messaging, (payload) => {
                        const notification = payload.notification;
                        notification.data = payload.data && payload.data['gcm.notification.data'] && JSON.parse(payload.data['gcm.notification.data']);
                        notification.url = payload.fcmOptions && payload.fcmOptions.link;

                        // [PENDING] Mostramos notificaciones en desktop? Sino borrar este código.
                        const notificationTitle = notification.title;
                        const notificationOptions = {
                            body: notification.body
                        };
                        reg.showNotification(notificationTitle, notificationOptions);
                    });
                });
            }
        } else {
            let push = window.PushNotification.init({
                android: {
                    clearBadge: true,
                    senderID: '147151221990591',
                    icon: 'icon',
                    iconColor: '#d72521'
                },
                // browser: {
                //     pushServiceURL: 'http://push.api.phonegap.com/v1/push'
                // },
                ios: {
                    'sound': true,
                    'alert': true,
                    'badge': true,
                    'clearBadge': true,
                    'categories': {
                        'taxi': {
                            'yes': {
                                'callback': 'app.acceptViaje', 'title': 'Accept', 'foreground': false, 'destructive': false
                            },
                            'no': {
                                'callback': 'app.rejectViaje', 'title': 'Reject', 'foreground': false, 'destructive': true
                            }
                        }
                    }
                },
                windows: {}
            });

            // Registro Exitoso
            push.on('registration', function (data) {
                console.log('Device register successfully', data.registrationId);
                store.commit('cordova/' + types.CORDOVA_DEVICE_REGISTER, data.registrationId);
            });

            push.on('notification', function (data) {
                let n = new Notification(data);
                console.log('Notificacion recived', n);
                store.dispatch('cordova/notificationArrive', n);
            });

            // Registro fail
            push.on('error', function (e, f) {
                console.log('notification error', e, f);
            });
        }
    }
};
