var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL: '"https://carpoolear.com.ar"',
  // API_URL: '"http://carpoolear.127.0.0.1.nip.io"',
  MAPS_API: '"AIzaSyBlRfNi2qDcy_zwjR53VVOyD-csjYSq4Qo"',
  FACEBOOK_API: '"147151221990591"',
  RECAPTCHA_SITE_KEY: '"6LdoUqQpAAAAAJXZvlOk47gLqTapZ0gErj4KoFj_"',
  TARGET_APP: '"carpoolear"'
});
