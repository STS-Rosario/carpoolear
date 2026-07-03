// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

const firebaseConfig = Object.fromEntries(
    new URLSearchParams(self.location.search)
);

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

const DEFAULT_ICON =
    'https://carpoolear.com.ar/app/static/img/carpoolear_logo.png';

messaging.onBackgroundMessage(function (payload) {
    console.log('Received background message ', payload);

    const notificationTitle =
        (payload.notification && payload.notification.title) || 'Carpoolear';
    const notificationOptions = {
        body: (payload.notification && payload.notification.body) || '',
        icon:
            (payload.notification && payload.notification.icon) || DEFAULT_ICON,
        data: payload.data || {}
    };

    self.registration.showNotification(
        notificationTitle,
        notificationOptions
    );

    // Notify open clients so in-app state (badge count, etc.) stays in sync
    self.clients
        .matchAll({
            type: 'window',
            includeUncontrolled: true
        })
        .then(function (clients) {
            clients.forEach(function (client) {
                client.postMessage({
                    type: 'firebase-background-message',
                    payload: payload
                });
            });
        });
});
