const path = require('path');
const config = require('../config');
const utils = require('./utils');

const env = process.env.NODE_ENV
const TARGET = process.env.TARGET_APP || 'default';
const serveMode = process.env.SERVE || false;
const devMode = process.env.NODE_ENV !== 'production';
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

console.log('TARGET = ' + TARGET);
if (TARGET === 'default') {
    extensions = ['.js', '.vue', '.json', '.css'];
} else {
    extensions = [
        '.' + TARGET + '.js', '.js',
        '.' + TARGET + '.vue', '.vue',
        '.' + TARGET + '.json', '.json',
        '.' + TARGET + '.css', '.css'
    ];
}

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  mode: devMode ? 'development' : 'production',
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath, 
    filename: '[name].js'
  },
  resolve: {
    extensions: extensions,
    // fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'components': path.resolve(__dirname, '../src/components')
    },
    mainFields: ['browser', 'main']
  },
  /*resolveLoader: {
    fallback: [path.join(__dirname, '../node_modules')]
  },*/
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
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          serveMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'postcss-loader', options: { 
              sourceMap: true, 
              plugins: [
                require('postcss-import')(),
                require('postcss-preset-env')({
                  browsers: ["last 2 version", "ie 9"]
                })
              ] 
            } 
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
    ] 
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}
