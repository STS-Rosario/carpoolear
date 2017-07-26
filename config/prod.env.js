config = {
  NODE_ENV: '"production"',
  API_URL: '"http://carpoolear.138.197.64.208.nip.io"',
  MAPS_API: '"AIzaSyBlRfNi2qDcy_zwjR53VVOyD-csjYSq4Qo"',
  FACEBOOK_API: '"862086450497061"' 
}

if (!process.env.PLATFORM || process.env.PLATFORM == 'DESKTOP') {
  console.log('history');
  config.HISTORY_MODE = '"history"';
} else {
  console.log('hash');
  config.HISTORY_MODE = '"hash"';
}

if (process.env.PLATFORM && process.env.PLATFORM == 'DESKTOP') {
  config.ROUTE_BASE = '"/app/"';
} else {
  if (process.env.SERVE) {
    config.ROUTE_BASE = '"/"';
  } else {
    config.ROUTE_BASE = '""';
  }
}

module.exports = config;
