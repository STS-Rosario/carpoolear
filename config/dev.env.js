var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL: '"https://carpoolear.104.131.15.228.nip.io"',
  MAPS_API: '"AIzaSyBlRfNi2qDcy_zwjR53VVOyD-csjYSq4Qo"',
  FACEBOOK_API: '"829566563845558"'
})
