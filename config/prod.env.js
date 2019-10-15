config = {
  NODE_ENV: '"production"',
  API_URL: '"https://carpoolear.com.ar"',
  MAPS_API: '"AIzaSyDz9fNRr5-nfCFN6ULDZaLt0xUckgKl3z4"',
  FACEBOOK_API: '"147151221990591"',
  TARGET_APP: '"carpoolear"'
}

if (!process.env.PLATFORM || process.env.PLATFORM == 'DESKTOP') {
  config.HISTORY_MODE = '"history"';
} else {
  config.HISTORY_MODE = '"hash"';
}

var isWin = /^win/.test(process.platform);
if (isWin && config.NODE_ENV === "production") {
  config.ROUTE_BASE = '"/app/"';
} else {
  if (process.env.PLATFORM && process.env.PLATFORM == 'DESKTOP') {
    config.ROUTE_BASE = '"/app/"';
  } else {
    if (process.env.SERVE) {
      config.ROUTE_BASE = '"/"';
    } else {
      config.ROUTE_BASE = '""';
    }
  }
}

module.exports = config;
