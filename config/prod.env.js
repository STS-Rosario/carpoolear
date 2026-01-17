config = {
    NODE_ENV: '"production"',
    // API_URL: '"https://carpoolear.com.ar"',
    API_URL: '"https://repeace.com/carpool/public"',
    MAPS_API: '"AIzaSyDz9fNRr5-nfCFN6ULDZaLt0xUckgKl3z4"',
    FACEBOOK_API: '"147151221990591"',
    RECAPTCHA_SITE_KEY: '"6LeNPUQsAAAAAHEGTbSrhKsHpcoMVtwoMKjKVtjC"',
    TARGET_APP: '"carpoolear"'
};

config.FIREBASE_PARAMS = {
    apiKey: '"AIzaSyBUsc8Cy42lV12hlcJ6jy5lW9bgrBEBnR8"',
    authDomain: '"pool-d978d.firebaseapp.com"',
    projectId: '"pool-d978d"',
    storageBucket: '"pool-d978d.firebasestorage.app"',
    messagingSenderId: '"699932647760"',
    appId: '"1:699932647760:web:daa317feb5f59ed8038c55"',
    measurementId: '"G-JGTXCKG92C"'
};

config.FIRABASE_VAPID_KEY =
    '"BKc8OfgMBi0QiUv5pNPN4qy1xOJVNiy9mj1lTfjhm9AMG8SR7VWl-QgBfEqeLRaU6qvsa4XWftdc_4LP_TCS5K0 "';

if (
    !process.env.PLATFORM ||
    process.env.PLATFORM == 'DESKTOP' ||
    process.env.PLATFORM == 'browser'
) {
    config.HISTORY_MODE = '"history"';
} else {
    config.HISTORY_MODE = '"hash"';
}

var isWin = /^win/.test(process.platform);
if (isWin && config.NODE_ENV === 'production') {
    config.ROUTE_BASE = '"/app/"';
} else {
    if (
        process.env.PLATFORM &&
        (process.env.PLATFORM == 'DESKTOP' || process.env.PLATFORM == 'browser')
    ) {
        config.ROUTE_BASE = '"/app/"';
    } else {
        if (
            typeof process.env.SERVE === 'string'
                ? process.env.SERVE === 'true'
                : process.env.SERVE
        ) {
            config.ROUTE_BASE = '"/"';
        } else {
            config.ROUTE_BASE = '""';
        }
    }
}

module.exports = config;
