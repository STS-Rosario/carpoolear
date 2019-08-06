var fs = require('fs');
var path = require('path');
var config = require('../config');
const pkg = require('../package.json');

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.ACTION === 'build' || process.env.ACTION === 'prepare'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory;
  return path.posix.join(assetsSubDirectory, _path);
}

exports.createNotifierCallback = function () {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') {
      return
    }
    const error = errors[0]

    const filename = error.file.split('!').pop()
    notifier.notify({
      title: pkg.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, '../src//assets/logo.png')
    })
  }
}

exports.devEnvPath = function () {
  if (process.env.TARGET_APP) {
    let configPath = path.join(__dirname,  '../config/dev' + (process.env.TARGET_APP !== 'default' ? '.' + process.env.TARGET_APP : '') + '.env.js');
    if (fs.existsSync(configPath)) {
      return configPath;
    }
    console.warn('Developtment enviroment not found for target', process.env.TARGET_APP);
  }
  return path.join(__dirname, '../config/dev.env.js');
}

exports.prodEnvPath = function () {
  if (process.env.TARGET_APP) {
    let configPath = path.join(__dirname,  '../config/prod' + (process.env.TARGET_APP !== 'default' ? '.' + process.env.TARGET_APP : '') + '.env.js');
    if (fs.existsSync(configPath)) {
      return configPath;
    }
    console.warn('Production enviroment not found for target', process.env.TARGET_APP);
  }
  return path.join(__dirname, '../config/prod.env.js');
}

/* var path = require('path')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}
  // generate loader string to be used with extract text plugin
  function generateLoaders (loaders) {
    var sourceLoader = loaders.map(function (loader) {
      var extraParamChar
      if (/\?/.test(loader)) {
        loader = loader.replace(/\?/, '-loader?')
        extraParamChar = '&'
      } else {
        loader = loader + '-loader'
        extraParamChar = '?'
      }
      return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '')
    }).join('!')

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract('vue-style-loader', sourceLoader)
    } else {
      return ['vue-style-loader', sourceLoader].join('!')
    }
  }

  // http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
  return {
    css: generateLoaders(['css']),
    postcss: generateLoaders(['css']),
    less: generateLoaders(['css', 'less']),
    sass: generateLoaders(['css', 'sass?indentedSyntax']),
    scss: generateLoaders(['css', 'sass']),
    stylus: generateLoaders(['css', 'stylus']),
    styl: generateLoaders(['css', 'stylus'])
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      loader: loader
    })
  }
  return output
}
*/
