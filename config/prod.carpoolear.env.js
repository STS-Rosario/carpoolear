config = {
  NODE_ENV: '"production"',
  // API_URL: '"https://localhost"',
   API_URL: '"https://carpoolear.com.ar"',
  // API_URL: '"http://carpoolear.127.0.0.1.nip.io"',
  MAPS_API: '"AIzaSyBlRfNi2qDcy_zwjR53VVOyD-csjYSq4Qo"',
  FACEBOOK_API: '"147151221990591"',
  RECAPTCHA_SITE_KEY: '"6LdoUqQpAAAAAJXZvlOk47gLqTapZ0gErj4KoFj_"',
  TARGET_APP: '"carpoolear"'

}

config.FIREBASE_PARAMS = {
    apiKey: '"AIzaSyD3_qWVjgLG3zUqA6jV8L7FvSB13-qtZMc"',
    authDomain: '"carpoolear-test.firebaseapp.com"',
    projectId: '"carpoolear-test"',
    storageBucket: '"carpoolear-test.appspot.com"',
    messagingSenderId: '"1027904610758"',
    appId: '"1:1027904610758:web:332a2f97f41a6d1fd592c7"',
    measurementId: '"G-VM6DM1Z4QG"'
}
config.FIRABASE_VAPID_KEY = '"BFuboNq1jLHnGseZ9rsLj3rcCHi5uc4Dlz4QYLEBR5BonK2PsXGVWtRzguvDl4FYtom0Zy8gqxx81i1eTJ4F6_M"';

if (!process.env.PLATFORM || process.env.PLATFORM == 'DESKTOP' || process.env.PLATFORM == 'browser') {
  config.HISTORY_MODE = '"history"';
} else {
  config.HISTORY_MODE = '"hash"';
}

var isWin = /^win/.test(process.platform);
if (isWin && config.NODE_ENV === "production") {
  config.ROUTE_BASE = '"/app/"';
} else {
  if (process.env.PLATFORM && (process.env.PLATFORM == 'DESKTOP' || process.env.PLATFORM == 'browser')) {
    config.ROUTE_BASE = '"/app/"';
  } else {
    if (typeof process.env.SERVE === 'string' ? process.env.SERVE === 'true' : process.env.SERVE) {
      config.ROUTE_BASE = '"/"';
    } else {
      config.ROUTE_BASE = '""';
    }
  }
}

module.exports = config;
