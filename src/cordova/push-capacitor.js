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
        console.log('🚀 === PUSH NOTIFICATION INIT STARTED ===');
        console.log('📱 Platform:', Capacitor.getPlatform());
        console.log('🔧 Is native platform?', Capacitor.isNativePlatform());
        console.log('📍 Capacitor available?', !!window.Capacitor);
        console.log('🔧 Starting push initialization...');

        // Visual debug - show initialization start
        if (window.alert) {
            window.alert(
                `🚀 PUSH INIT STARTED!\nPlatform: ${Capacitor.getPlatform()}\nNative: ${Capacitor.isNativePlatform()}`
            );
        }

        if (Capacitor.getPlatform() === 'web') {
            // Web/PWA push notifications using Firebase
            console.log('🌐 === WEB PUSH INITIALIZATION ===');
            console.log('🔧 Initializing web push notifications...');
            await this.initWebPush();
        } else {
            // Native push notifications using Capacitor
            console.log('📱 === NATIVE PUSH INITIALIZATION ===');
            console.log('🔧 Initializing native push notifications...');

            // Visual debug - show native init start
            if (window.alert) {
                window.alert(
                    `📱 NATIVE PUSH INIT!\nPlatform: ${Capacitor.getPlatform()}\nStarting native push setup...`
                );
            }

            await this.initNativePush();
        }
        console.log('✅ === PUSH NOTIFICATION INIT COMPLETED ===');
    },

    async initWebPush() {
        if (
            process.env.FIREBASE_PARAMS !== undefined &&
            window.Notification &&
            window.Notification.requestPermission
        ) {
            try {
                // Register service worker with correct path
                const serviceWorker = navigator.serviceWorker.register(
                    'firebase-messaging-sw.js',
                    {
                        scope: '/'
                    }
                );

                // Check if permissions are already granted
                let permissionNotification;
                if (window.Notification.permission === 'granted') {
                    console.log(
                        'Notifications already granted, proceeding with setup'
                    );
                    permissionNotification = Promise.resolve('granted');
                } else {
                    console.log('Requesting notification permissions...');
                    permissionNotification =
                        window.Notification.requestPermission()
                            .then((permission) => {
                                if (permission === 'granted') {
                                    return 'granted';
                                }
                                return Promise.reject(
                                    new Error('Permission denied')
                                );
                            })
                            .catch(() => {
                                return Promise.reject(
                                    new Error('Permission request failed')
                                );
                            });
                }

                const [reg] = await Promise.all([
                    serviceWorker,
                    permissionNotification
                ]);

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
                } else {
                    console.log(
                        'No registration token available. Request permission to generate one.'
                    );
                }

                // Listen for foreground messages
                onMessage(messaging, (payload) => {
                    const notification = new Notification({
                        notification: payload.notification,
                        data: payload.data
                    });

                    console.log('Foreground message received', notification);
                    store.dispatch('cordova/notificationArrive', notification);

                    // Show native notification for web
                    const notificationTitle = payload.notification.title;
                    const notificationOptions = {
                        body: payload.notification.body,
                        data: payload.data
                    };
                    reg.showNotification(
                        notificationTitle,
                        notificationOptions
                    );
                });
            } catch (error) {
                console.log('Error during web push initialization:', error);
            }
        }
    },

    async initNativePush() {
        console.log('📱 === NATIVE PUSH INIT START ===');

        // Visual debug - show native init start
        if (window.alert) {
            window.alert(
                `📱 NATIVE PUSH INIT START!\nStarting native push setup...`
            );
        }

        try {
            console.log('📦 Importing PushNotifications plugin...');

            // Visual debug - show plugin import start
            if (window.alert) {
                window.alert(
                    `📦 IMPORTING PLUGIN!\nTrying to import @capacitor/push-notifications...`
                );
            }

            // Import push notifications plugin dynamically
            let PushNotifications;
            try {
                const module = await import('@capacitor/push-notifications');
                PushNotifications = module.PushNotifications;
                console.log(
                    '✅ PushNotifications plugin imported successfully'
                );

                // Visual debug - show plugin import success
                if (window.alert) {
                    window.alert(
                        `✅ PLUGIN IMPORTED!\nPushNotifications plugin loaded successfully`
                    );
                }
            } catch (error) {
                console.error(
                    '❌ Push Notifications plugin not available:',
                    error
                );

                // Visual debug - show plugin import error
                if (window.alert) {
                    window.alert(
                        `❌ PLUGIN IMPORT FAILED!\nError: ${
                            error.message || 'Unknown error'
                        }\nDetails: ${JSON.stringify(error)}`
                    );
                }
                return;
            }

            console.log('🔧 Initializing Capacitor push notifications...');

            // Request permission to use push notifications
            console.log('🔑 Requesting push notification permissions...');
            const result = await PushNotifications.requestPermissions();
            console.log('🔑 Permission result:', result);

            // Visual debug - show permission result
            if (window.alert) {
                window.alert(
                    `🔑 PERMISSION RESULT!\nReceive: ${
                        result.receive
                    }\nFull result: ${JSON.stringify(result)}`
                );
            }

            if (result.receive === 'granted') {
                console.log('✅ Push notification permissions GRANTED');
                // Register with Apple / Google to receive push via APNS/FCM
                console.log('📝 Starting push notification registration...');
                try {
                    await PushNotifications.register();
                    console.log(
                        '✅ Push notification registration initiated successfully'
                    );

                    // Visual debug - show registration success
                    if (window.alert) {
                        window.alert(
                            `✅ REGISTRATION INITIATED!\nPushNotifications.register() succeeded\nWaiting for token...`
                        );
                    }
                } catch (registrationError) {
                    console.error(
                        '❌ Push notification registration FAILED:',
                        registrationError
                    );
                    console.warn(
                        'This might be due to missing Firebase configuration for Android'
                    );

                    // Visual debug - show registration error
                    if (window.alert) {
                        window.alert(
                            `❌ REGISTRATION FAILED!\nError: ${
                                registrationError.message || 'Unknown error'
                            }\nDetails: ${JSON.stringify(registrationError)}`
                        );
                    }
                    return;
                }
            } else {
                console.log('❌ Push notification permissions DENIED:', result);
                return;
            }

            // On success, we should be able to receive notifications
            console.log('🎧 Setting up push notification event listeners...');

            PushNotifications.addListener('registration', (token) => {
                console.log('🎯 === TOKEN REGISTRATION SUCCESS ===');
                console.log('📱 Platform:', Capacitor.getPlatform());
                console.log('🔐 Firebase token received:', token.value);
                console.log('📏 Token length:', token.value.length);
                console.log(
                    '🔗 Token first 50 chars:',
                    token.value.substring(0, 50) + '...'
                );
                console.log(
                    '📊 Full token object:',
                    JSON.stringify(token, null, 2)
                );
                console.log('🔍 Token validation:');
                console.log('  - Is string?', typeof token.value === 'string');
                console.log('  - Is empty?', token.value.length === 0);
                console.log('  - Contains spaces?', token.value.includes(' '));
                console.log('🔗 Proceeding with token storage...');

                // Visual debug - show alert with token info
                if (window.alert) {
                    window.alert(
                        `✅ TOKEN RECEIVED!\nPlatform: ${Capacitor.getPlatform()}\nToken Length: ${
                            token.value.length
                        }\nFirst 50 chars: ${token.value.substring(0, 50)}...`
                    );
                }

                console.log('💾 Storing token in Vuex store...');
                store.commit(
                    'cordova/' + types.CORDOVA_DEVICE_REGISTER,
                    token.value
                );
                console.log('✅ Token stored in store successfully');

                // Add a small delay to ensure Vuex state is updated before registering with backend
                console.log('📡 Starting device registration with backend...');
                setTimeout(() => {
                    store
                        .dispatch('device/register')
                        .then(() => {
                            console.log(
                                '✅ Device registration completed successfully'
                            );
                        })
                        .catch((error) => {
                            console.error(
                                '❌ Device registration failed:',
                                error
                            );
                        });
                }, 100); // 100ms delay to ensure state is updated
                console.log('🎯 === TOKEN REGISTRATION COMPLETED ===');
            });

            // Some issue with our setup and push will not work
            console.log('🚨 Setting up registration error listener...');
            PushNotifications.addListener('registrationError', (error) => {
                console.log('💥 === PUSH REGISTRATION ERROR ===');
                console.log(
                    '❌ Registration error details:',
                    JSON.stringify(error, null, 2)
                );
                console.log('🔍 Error type:', typeof error);
                console.log('📄 Error message:', error.message || 'No message');
                console.log('🔧 Will continue without push registration...');
                console.log('💥 === PUSH REGISTRATION ERROR LOGGED ===');

                // Visual debug - show error alert
                if (window.alert) {
                    window.alert(
                        `❌ PUSH REGISTRATION FAILED!\nError: ${
                            error.message || 'Unknown error'
                        }\nDetails: ${JSON.stringify(error)}`
                    );
                }
            });

            // Show us the notification payload if the app is open on our device
            console.log('📥 Setting up push notification received listener...');
            PushNotifications.addListener(
                'pushNotificationReceived',
                (notification) => {
                    try {
                        console.log('🔔 === PUSH NOTIFICATION RECEIVED ===');
                        console.log(
                            '📦 Raw notification object:',
                            JSON.stringify(notification, null, 2)
                        );
                        console.log(
                            '📝 Title:',
                            notification.title || 'No title'
                        );
                        console.log('📄 Body:', notification.body || 'No body');
                        console.log(
                            '📊 Data payload:',
                            JSON.stringify(notification.data || {}, null, 2)
                        );
                        console.log(
                            '🏷️ Notification ID:',
                            notification.id || 'No ID'
                        );
                        console.log('⏰ Timestamp:', new Date().toISOString());
                        console.log('🔧 Processing received notification...');

                        console.log(
                            '🏗️ Creating internal Notification object...'
                        );
                        const n = new Notification({
                            title: notification.title || '',
                            body: notification.body || '',
                            data: notification.data || {}
                        });
                        n.foreground = true;

                        console.log(
                            '📤 Dispatching notification to Vuex store...'
                        );
                        console.log(
                            '📤 Notification object to dispatch:',
                            JSON.stringify(n, null, 2)
                        );
                        store.dispatch('cordova/notificationArrive', n);
                        console.log(
                            '✅ Notification dispatched to store successfully'
                        );

                        // Visual debug - show notification received
                        if (window.alert) {
                            window.alert(
                                `🔔 NOTIFICATION RECEIVED!\nTitle: ${
                                    notification.title || 'No title'
                                }\nBody: ${
                                    notification.body || 'No body'
                                }\nData: ${JSON.stringify(
                                    notification.data || {}
                                )}`
                            );
                        }

                        // Try to show a system notification as well
                        if (Capacitor.isNativePlatform()) {
                            console.log(
                                '📱 Native platform detected - checking system notification behavior'
                            );
                            console.log(
                                'ℹ️ System notifications appear automatically when app is in background'
                            );
                            console.log(
                                'ℹ️ Foreground notifications are handled by this listener'
                            );
                            // The push notification should automatically appear as a system notification
                            // when the app is in background, but when in foreground we need to handle it
                        }
                        console.log(
                            '🔔 === PUSH NOTIFICATION PROCESSING COMPLETED ==='
                        );
                    } catch (error) {
                        console.error(
                            '💥 === ERROR HANDLING PUSH NOTIFICATION ==='
                        );
                        console.error('❌ Error details:', error);
                        console.error('🔍 Error stack:', error.stack);
                        console.error(
                            '💥 === PUSH NOTIFICATION ERROR LOGGED ==='
                        );

                        // Visual debug - show notification error
                        if (window.alert) {
                            window.alert(
                                `💥 NOTIFICATION ERROR!\nError: ${
                                    error.message || 'Unknown error'
                                }\nDetails: ${JSON.stringify(error)}\nStack: ${
                                    error.stack || 'No stack trace'
                                }`
                            );
                        }
                    }
                }
            );

            // Method called when tapping on a notification
            console.log('👆 Setting up push notification tap listener...');
            PushNotifications.addListener(
                'pushNotificationActionPerformed',
                (notification) => {
                    try {
                        console.log('👆 === PUSH NOTIFICATION TAPPED ===');
                        console.log('📱 User tapped on notification');
                        console.log(
                            '📦 Action notification object:',
                            JSON.stringify(notification, null, 2)
                        );
                        console.log(
                            '🎬 Action ID:',
                            notification.actionId || 'No action ID'
                        );
                        console.log(
                            '⏰ Tap timestamp:',
                            new Date().toISOString()
                        );

                        console.log(
                            '🏗️ Creating notification object for tap action...'
                        );
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

                        console.log('📤 Dispatching tap action to store...');
                        console.log(
                            '📤 Tap notification object:',
                            JSON.stringify(n, null, 2)
                        );
                        store.dispatch('cordova/notificationArrive', n);
                        console.log('✅ Tap action dispatched successfully');
                        console.log(
                            '👆 === PUSH NOTIFICATION TAP COMPLETED ==='
                        );

                        // Visual debug - show notification tap
                        if (window.alert) {
                            window.alert(
                                `👆 NOTIFICATION TAPPED!\nTitle: ${
                                    (notification.notification &&
                                        notification.notification.title) ||
                                    'No title'
                                }\nBody: ${
                                    (notification.notification &&
                                        notification.notification.body) ||
                                    'No body'
                                }\nAction: ${
                                    notification.actionId || 'No action'
                                }`
                            );
                        }
                    } catch (error) {
                        console.error('💥 === ERROR HANDLING PUSH TAP ===');
                        console.error('❌ Tap error details:', error);
                        console.error('🔍 Tap error stack:', error.stack);
                        console.error('💥 === PUSH TAP ERROR LOGGED ===');
                    }
                }
            );

            console.log('✅ All push notification listeners configured');
            console.log('📱 === NATIVE PUSH SETUP COMPLETED ===');
        } catch (error) {
            console.log('Error during native push initialization:', error);

            // Visual debug - show initialization error
            if (window.alert) {
                window.alert(
                    `💥 NATIVE PUSH INIT ERROR!\nError: ${
                        error.message || 'Unknown error'
                    }\nDetails: ${JSON.stringify(error)}\nStack: ${
                        error.stack || 'No stack trace'
                    }`
                );
            }
        }
    }
};
