config = {
  NODE_ENV: '"production"',
  API_URL: '"https://localhost"',
  MAPS_API: '"AIzaSyDz9fNRr5-nfCFN6ULDZaLt0xUckgKl3z4"',
  FACEBOOK_API: '"147151221990591"',
  TARGET_APP: '"carpoolear"',

}
config.FIREBASE_PARAMS = {
  apiKey: '"AIzaSyCDmmniKPGXV8BSAq2sV0kMea_hh39YXMU"',
  authDomain: '"prueba-carpoolear.firebaseapp.com"',
  projectId: '"prueba-carpoolear"',
  storageBucket: '"prueba-carpoolear.appspot.com"',
  messagingSenderId: '"820267556059"',
  appId: '"1:820267556059:web:5f051e64066f8f9795c0fe"',
  measurementId: '"G-VM6DM1Z4QG"'
}

 config.FIRABASE_VAPID_KEY = '"BBuYehy8DBuGqhmwDt-3fe7TdHKidkm7O4ng2DDntk91818WWK17oQc2Q7DzFBTOazT-7u_WcB0Y-SJSGYXbPq8"';

if (!process.env.PLATFORM || process.env.PLATFORM == 'DESKTOP'|| process.env.PLATFORM == 'browser') {
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
