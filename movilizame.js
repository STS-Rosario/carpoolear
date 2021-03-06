#!/usr/bin/env node
const argv = require('minimist')(process.argv.slice(2));
const shell = require('shelljs');
const fs = require('fs-extra');
const xmlParser = require('xml2js').parseString;

console.log('Movilizame builder -- Starting building');

const TARGET = process.env.TARGET_APP || argv.target || 'default';
const PROD = argv.prod || false;
const PLATFORM = argv.platform || 'android';
if (PLATFORM === 'ios' || PLATFORM === 'android' || PLATFORM === 'browser') {
    process.env.CORDOVA = true;
}
const NODE_ENV = PROD ? 'production' : 'development';
const projectPath = `./dist/${TARGET}/${NODE_ENV}/`;
console.log('Enviroment: ' + NODE_ENV);

function showError (code, stderr, stdout) {
    console.log('ERROR IN CORDOVA:');
    console.log('CODE:', code);
    console.log('STDERR', stderr)
    console.log('STDOUT', stdout);
}

function preBuildAndCheckPlatform (callback) {
    let folder = `dist/${TARGET}/${NODE_ENV}`;
    let folderCordovaResFiles = `dist/${TARGET}/${NODE_ENV}/res`;
    let cordovaFiles = `projects/${TARGET}/cordova`;
    if (fs.existsSync(folderCordovaResFiles)) {
        console.log('Deleting old files.')
        fs.removeSync(folderCordovaResFiles);
    }
    fs.copy(cordovaFiles, folder, function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log('Copyng cordova assets.')
            buildAndCheckPlatform(callback);
        }
    });
}

function buildAndCheckPlatform (callback) {
    let options = {
        env: process.env
    };
    let buildEnv = PROD ? 'build.js' : 'build-dev.js';
    console.log(`cross-env PLATFORM=${PLATFORM} node build/${buildEnv}`);
    shell.exec(`cross-env PLATFORM=${PLATFORM} node build/${buildEnv}`, options)
    ;
    if (!fs.existsSync(`./dist/${TARGET}/${NODE_ENV}/platforms/${PLATFORM}`)) {
        console.log('Adding platform: ' + PLATFORM + ' - path: ' + projectPath);
        shell.exec(`cross-env cordova platform add ${PLATFORM}`, {
            cwd: projectPath,
            silent: true
        }, function (code, stderr, stdout) {
            console.log('STDOUT: ', stdout);
            if (stdout.search('already added')) {
                console.log('Platform allready installed.');
            } else {
                showError(code, stderr, stdout);
            }
            callback();
        });
    } else {
        console.log('Platform directory is present.');
        callback();
    }
}

function loadAppVersion () {
    let path = `./projects/${TARGET}/cordova/config.xml`;
    let xml = fs.readFileSync(path);
    xmlParser(xml, function (err, result) {
        if (err) {
            console.error(error);
        } else {
            process.env.APP_VERSION  = result.widget.$.version;
            let i = 0;
            for (i;  i < result.widget.plugin.length; i++) {
                if (result.widget.plugin[i].$.name === 'cordova-plugin-facebook4') {
                    let j = 0;
                    for (j; j < result.widget.plugin[i].variable.length; j++) {
                        if (result.widget.plugin[i].variable[j].$.name = 'APP_ID') {
                            process.env.FB_APP_ID = result.widget.plugin[i].variable[j].$.value;
                            break;
                        }
                    }
                    break;
                }
            }
        }
    });
}

if (argv._.length > 0) {
    let action = argv._[0];
    process.env.ACTION = action;
    loadAppVersion();
    switch (action) {
        case 'serve':
            process.env.SERVE = true;
            process.env.CORDOVA = false;
            process.env.NODE_ENV = NODE_ENV;
            process.env.TARGET_APP = TARGET;
            shell.exec('webpack-dev-server --inline --progress --config build/webpack.dev.conf.js',
                {
                    env: process.env,
                    async: true
                }
            );
            break;
        case 'build':
            preBuildAndCheckPlatform(() => {
                shell.exec(`cordova build ${PLATFORM}`, {
                    env: process.env,
                    cwd: projectPath,
                    silent: true
                }, showError);
            });
            break;
        case 'prepare':
            preBuildAndCheckPlatform(() => {
                shell.exec(`cordova prepare ${PLATFORM}`, {
                    cwd: projectPath,
                    silent: true,
                    env: process.env
                }, showError);
            });
            break;
        case 'build-web':
            let buildEnv = PROD ? 'build.js' : 'build-dev.js';
            process.env.CORDOVA = false;
            process.env.NODE_ENV = 'production';
            process.env.TARGET_APP = TARGET;
            let options = {
                env: process.env
            };
            console.log(`cross-env PLATFORM=DESKTOP node build/${buildEnv}`);
            shell.exec(`cross-env PLATFORM=DESKTOP node build/${buildEnv}`, options);
            break;
        default:
            console.log(shell);
    }
}
