
module.exports = function (ctx) {
  // make sure android platform is part of build
  /*if (ctx.opts.platforms.indexOf('android') < 0) {
    return
  } */

  require('shelljs/global')
  var fs = ctx.requireCordovaModule('fs')
  var path = ctx.requireCordovaModule('path')
  var deferral = ctx.requireCordovaModule('q').defer()
  
  cd('..')

  
  if (ctx.opts.options.release) {
    exec('npm run build')  
  } else {
    exec('npm run cordova-build')
  }
  
  cd('cordova')

  var rootdir = ctx.opts.projectRoot
  var wwwDir = rootdir + '/www'
  var distDir = rootdir + '/../dist' 
  rm('-rf', wwwDir)

  console.log('Copy' + distDir + " to " + wwwDir)
  cp('-R', distDir, wwwDir) 
  deferral.resolve()

  return deferral.promise
}
