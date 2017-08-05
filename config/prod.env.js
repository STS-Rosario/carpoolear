config = {
  NODE_ENV: '"production"',
  API_URL: '"https://carpoolear.104.131.15.228.nip.io"',
  MAPS_API: '"AIzaSyBlRfNi2qDcy_zwjR53VVOyD-csjYSq4Qo"',
  FACEBOOK_API: '"862086450497061"'
}
console.log('DEVICE', process.env.DEVICE);

if (!process.env.PLATFORM || process.env.PLATFORM == 'DESKTOP') {
  config.HISTORY_MODE = '"history"';
} else {
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

console.log(config);

module.exports = config;
