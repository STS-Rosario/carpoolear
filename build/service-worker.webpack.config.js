const path = require('path');
const config = require('../config');
const utils = require('./utils');
const webpack = require('webpack');

const serveMode = process.env.SERVE || false;
const devMode = process.env.NODE_ENV !== 'production';

processEnv = process.env.NODE_ENV && process.env.NODE_ENV === 'production' ? require(utils.prodEnvPath()) : require(utils.devEnvPath());
processEnv.SERVE = serveMode;

module.exports = {
  mode: devMode ? 'development' : 'production',
  entry: {
    app: './static/firebase-messaging-sw.js'
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: 'firebase-messaging-sw.js'
  },
  resolve: {
    mainFields: ['browser', 'main']
  },
  module: {
    rules: [
      ...(config.dev.useEslint? [{
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: !config.dev.showEslintErrorsInOverlay
        }
      }] : []),
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': processEnv.FIREBASE_PARAMS
    })
  ]
}
