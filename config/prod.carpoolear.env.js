config = {
    NODE_ENV: '"production"',
    API_URL: '"https://carpoolear.com.ar"',
    MAPS_API: '"AIzaSyDz9fNRr5-nfCFN6ULDZaLt0xUckgKl3z4"',
    FACEBOOK_API: '"147151221990591"',
    RECAPTCHA_SITE_KEY: '"6LcJyuoqAAAAAFycfjGz2xTiOjhNmWP_wYudIiJT"',
    TARGET_APP: '"carpoolear"'
};

config.FIREBASE_PARAMS = {
    apiKey: '"AIzaSyCwecybmdmiWUehjZBT30RZXWKgiNnP7XI"',
    authDomain: '"carpoolear-production.firebaseapp.com"',
    projectId: '"carpoolear-production"',
    storageBucket: '"carpoolear-production.firebasestorage.app"',
    messagingSenderId: '"726271358034"',
    appId: '"1:726271358034:web:f09d2d38fae5f185f01b8b"',
    measurementId: '"G-V8ZHPQJ6HV"'
};
config.FIRABASE_VAPID_KEY =
    '"BGtEjSYLZ36eiHMUpeHzondfyJFGvCvpOXyvBpa21cqxBpfXlV3s1FOrfiRyxbgSpx3m3fDjBb-Eb7FR7dlqZ-k"';

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
