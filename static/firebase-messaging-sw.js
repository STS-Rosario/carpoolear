 // Scripts for firebase and firebase messaging
 importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
 importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

 // Initialize the Firebase app in the service worker by passing the generated config
 const firebaseConfig = {
  apiKey: "AIzaSyCDmmniKPGXV8BSAq2sV0kMea_hh39YXMU",
    authDomain: "prueba-carpoolear.firebaseapp.com",
    projectId: "prueba-carpoolear",
    storageBucket: "prueba-carpoolear.appspot.com",
    messagingSenderId: "820267556059",
    appId: "1:820267556059:web:5f051e64066f8f9795c0fe",
    measurementId: "G-VM6DM1Z4QG"
 };

 firebase.initializeApp(firebaseConfig);

 // Retrieve firebase messaging
 const messaging = firebase.messaging();

 messaging.onBackgroundMessage(function(payload) {
   console.log("Received background message ", payload);

   const notificationTitle = payload.notification.title;
   const notificationOptions = {
     body: payload.notification.body,
   };

   self.registration.showNotification(notificationTitle, notificationOptions);
 });