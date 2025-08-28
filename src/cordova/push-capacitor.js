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
                this.foreground = e.additionalData ? e.additionalData.foreground : false;
                this.sound = e.additionalData ? (e.additionalData.sound || '') : '';
                this.title = e.title || '';
                this.content = e.body || e.message || '';
                this.type = e.additionalData ? (e.additionalData.type || '') : '';
                this.url = e.additionalData ? (e.additionalData.url || '') : '';
                this.data = e.additionalData ? (e.additionalData.extras || '') : '';
                this.coldstart = e.additionalData ? e.additionalData.coldstart : false;
            }
            this._original = e;
        }
    }
}

export default {
    async init() {
        try {
            console.log('=== DEBUG: Starting push notification init ===');
            console.log('Push notifications init for platform:', Capacitor.getPlatform());
            console.log('Is native platform?', Capacitor.isNativePlatform());
            
            console.log('=== DEBUG: COMPLETELY DISABLING push notifications for Android ===');
            
            // Completely disable push notifications for Android until Firebase is properly configured
            const platform = Capacitor.getPlatform();
            console.log('=== DEBUG: Platform retrieved:', platform);
            
            if (platform === 'android') {
                console.log('=== DEBUG: Android detected - skipping ALL push notification setup ===');
                console.warn('Push notifications disabled on Android - Firebase configuration required');
                return;
            }
            
            console.log('=== DEBUG: About to check platform type ===');
            
            if (platform === 'web') {
                console.log('=== DEBUG: Web platform detected, initializing web push ===');
                // Web/PWA push notifications using Firebase
                await this.initWebPush();
            } else {
                console.log('=== DEBUG: Native platform detected, calling initNativePush ===');
                // Native push notifications using Capacitor
                console.log('Detected native platform, checking for Firebase...');
                await this.initNativePush();
            }
            
            console.log('=== DEBUG: Push notification init completed ===');
        } catch (error) {
            console.error('=== DEBUG: Error in push notification init:', error);
            console.error('=== DEBUG: Error stack:', error.stack);
        }
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
                    console.log('Notifications already granted, proceeding with setup');
                    permissionNotification = Promise.resolve('granted');
                } else {
                    console.log('Requesting notification permissions...');
                    permissionNotification = window.Notification.requestPermission()
                        .then((permission) => {
                            if (permission === 'granted') {
                                return 'granted';
                            }
                            return Promise.reject(new Error('Permission denied'));
                        })
                        .catch(() => {
                            return Promise.reject(new Error('Permission request failed'));
                        });
                }

                const [reg] = await Promise.all([serviceWorker, permissionNotification]);
                
                const firebaseApp = initializeApp(process.env.FIREBASE_PARAMS);
                const messaging = getMessaging(firebaseApp);
                
                // Get FCM token
                const currentToken = await getToken(messaging, {
                    vapidKey: process.env.FIRABASE_VAPID_KEY,
                    serviceWorkerRegistration: reg
                });

                if (currentToken) {
                    store.commit('cordova/' + types.CORDOVA_DEVICE_REGISTER, currentToken);
                } else {
                    console.log('No registration token available. Request permission to generate one.');
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
                    reg.showNotification(notificationTitle, notificationOptions);
                });

            } catch (error) {
                console.log('Error during web push initialization:', error);
            }
        }
    },

    async initNativePush() {
        try {
            console.log('=== DEBUG: Entering initNativePush ===');
            
            // Import push notifications plugin dynamically
            // This will work even if the plugin isn't installed yet
            let PushNotifications;
            try {
                const module = await import('@capacitor/push-notifications');
                PushNotifications = module.PushNotifications;
                console.log('=== DEBUG: Push Notifications plugin loaded ===');
            } catch (error) {
                console.warn('Push Notifications plugin not available:', error);
                return;
            }

            console.log('Initializing Capacitor push notifications...');

            // For Android, we need to check if Firebase is configured
            // Otherwise we'll skip push notification setup
            const platform = Capacitor.getPlatform();
            console.log('=== DEBUG: Checking platform:', platform);
            console.log('=== DEBUG: Platform comparison (platform === "android"):', platform === 'android');
            
            if (platform === 'android') {
                console.log('=== DEBUG: Android platform detected - SHOULD SKIP push notifications ===');
                console.warn('Skipping push notifications on Android - Firebase configuration not available');
                console.warn('To enable push notifications on Android, add google-services.json to android/app/');
                return;
            }
            
            console.log('=== DEBUG: Not Android, proceeding with push notifications ===');

            // Request permission to use push notifications
            const result = await PushNotifications.requestPermissions();
            
            if (result.receive === 'granted') {
                // Register with Apple / Google to receive push via APNS/FCM
                try {
                    await PushNotifications.register();
                } catch (registrationError) {
                    console.error('Push notification registration failed:', registrationError);
                    console.warn('This might be due to missing Firebase configuration for Android');
                    return;
                }
            } else {
                console.log('Push notification permissions denied');
                return;
            }

            // On success, we should be able to receive notifications
            PushNotifications.addListener('registration', (token) => {
                console.log('Push registration success, token: ' + token.value);
                store.commit('cordova/' + types.CORDOVA_DEVICE_REGISTER, token.value);
            });

            // Some issue with our setup and push will not work
            PushNotifications.addListener('registrationError', (error) => {
                console.log('Error on registration: ' + JSON.stringify(error));
            });

            // Show us the notification payload if the app is open on our device
            PushNotifications.addListener('pushNotificationReceived', (notification) => {
                console.log('Push received: ' + JSON.stringify(notification));
                const n = new Notification({
                    title: notification.title,
                    body: notification.body,
                    data: notification.data
                });
                n.foreground = true;
                store.dispatch('cordova/notificationArrive', n);
            });

            // Method called when tapping on a notification
            PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
                console.log('Push action performed: ' + JSON.stringify(notification));
                const n = new Notification({
                    title: notification.notification.title,
                    body: notification.notification.body,
                    data: notification.notification.data,
                    actionId: notification.actionId
                });
                n.foreground = false;
                n.coldstart = true;
                store.dispatch('cordova/notificationArrive', n);
            });

        } catch (error) {
            console.log('Error during native push initialization:', error);
        }
    }
};