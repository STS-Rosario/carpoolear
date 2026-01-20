var merge = require('webpack-merge');
var prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    // API_URL: '"https://carpoolear.com.ar"',
    API_URL: '"https://repeace.com/carpool/public"',
    MAPS_API: '"AIzaSyBlRfNi2qDcy_zwjR53VVOyD-csjYSq4Qo"',
    FACEBOOK_API: '"147151221990591"',
    RECAPTCHA_SITE_KEY: '"6LeNPUQsAAAAAHEGTbSrhKsHpcoMVtwoMKjKVtjC"',
    TARGET_APP: '"carpoolear"', // Sets logo url
    TIMEZONE: '"Indian/Mauritius"',
    FIREBASE_PARAMS: {
        apiKey: '"AIzaSyBUsc8Cy42lV12hlcJ6jy5lW9bgrBEBnR8"',
        authDomain: '"pool-d978d.firebaseapp.com"',
        projectId: '"pool-d978d"',
        storageBucket: '"pool-d978d.firebasestorage.app"',
        messagingSenderId: '"699932647760"',
        appId: '"1:699932647760:web:daa317feb5f59ed8038c55"',
        measurementId: '"G-JGTXCKG92C"'
    },
    FIRABASE_VAPID_KEY:
        '"BKc8OfgMBi0QiUv5pNPN4qy1xOJVNiy9mj1lTfjhm9AMG8SR7VWl-QgBfEqeLRaU6qvsa4XWftdc_4LP_TCS5K0 "'
});
