config = {
  NODE_ENV: '"production"',
  API_URL: '"http://carpoolear.138.197.64.208.nip.io"',
  MAPS_API: '"AIzaSyBlRfNi2qDcy_zwjR53VVOyD-csjYSq4Qo"',
  FACEBOOK_API: '"829566563845558"'
}

if (!process.env.PLATFORM || process.env.PLATFORM == 'DESKTOP') {
  config.HISTORY_MODE = '"history"';
} else {
  config.HISTORY_MODE = '"hash"';
}

console.log(config.HISTORY_MODE, process.env.PLATFORM);

if (process.env.PLATFORM && process.env.PLATFORM == 'DESKTOP') {
  config.ROUTE_BASE = '"/app/"';
} else {
  if (process.env.SERVE) {
    config.ROUTE_BASE = '"/"';
  } else {
    config.ROUTE_BASE = '""';
  }
}
console.log(config.ROUTE_BASE);

module.exports = config;
