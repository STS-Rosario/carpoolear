
module.exports = function (ctx) {
  // make sure android platform is part of build
    var android = ctx.opts.platforms.indexOf('android') >= 0;
    var browser = ctx.opts.platforms.indexOf('browser') >= 0;
    var ios = ctx.opts.platforms.indexOf('ios') >= 0;

    require('shelljs/global');
    var fs = ctx.requireCordovaModule('fs');
    var path = ctx.requireCordovaModule('path');
    var deferral = ctx.requireCordovaModule('q').defer();

    var isWin = /^win/.test(process.platform);
    var platform = '';
    var device = '';

    if (android || ios) {
        platform = 'MOVIL';
        if (android) {
            device = 'ANDOIRD';
        }
        if (ios) {
            device = 'IOS';
        }
        if (browser) {
            console.warn('Platform browser must be build alone');
        }
    } else {
        platform = 'DESKTOP';
        device = 'BROWSER';
    }
    cd('..');

    // check if is it window or linux/mac
    if (isWin) {
        console.log('its window');
        exec('SET DEVICE=' + device);
        exec('SET PLATFORM=' + platform);
        if (ctx.opts.options && ctx.opts.options.release) {
            exec('npm run build');
        } else {
            exec('npm run cordova-build');
        }
    } else {
        if (ctx.opts.options && ctx.opts.options.release) {
            exec('export DEVICE=' + device + ' &&' + 'export PLATFORM=' + platform + ' && npm run build');
        } else {
            exec('export DEVICE=' + device + ' &&' + 'export PLATFORM=' + platform + ' && npm run cordova-build');
        }
    }

    cd('cordova');

    var rootdir = ctx.opts.projectRoot;
    var wwwDir = rootdir + '/www';
    var distDir = rootdir + '/../dist';
    rm('-rf', wwwDir);

    console.log('Copy' + distDir + ' to ' + wwwDir);
    cp('-R', distDir, wwwDir);
    deferral.resolve();

    return deferral.promise;
};
