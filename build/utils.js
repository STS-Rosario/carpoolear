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
