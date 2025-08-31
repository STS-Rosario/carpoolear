var merge = require('webpack-merge');
var prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    // API_URL: '"https://carpoolear.com.ar"',
    API_URL: '"http://carpoolear_backend.test"',
    // API_URL: '"http://localhost:8000"',
    MAPS_API: '"AIzaSyBlRfNi2qDcy_zwjR53VVOyD-csjYSq4Qo"',
    FACEBOOK_API: '"147151221990591"',
    RECAPTCHA_SITE_KEY: '"6LeVu34pAAAAAMpDut-0e0Wahe2vy1amM5MpANQz"',
    TARGET_APP: '"carpoolear"'
});
