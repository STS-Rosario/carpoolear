var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // API_URL: '"http://apalancar.movilizame.com.ar"',
  API_URL: '"http://carpoolear.127.0.0.1.nip.io"',
  MAPS_API: '"AIzaSyBlRfNi2qDcy_zwjR53VVOyD-csjYSq4Qo"',
  FACEBOOK_API: '"2589420954502746"',
  TARGET_APP: '"apalancar"'
})
