// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

const firebaseConfig = Object.fromEntries(
    new URLSearchParams(self.location.search)
);

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('Received background message ', payload);

    /*
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
    */

    // Send message to all open clients to update the store
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
