#!/usr/bin/env node
let argv = require('minimist')(process.argv.slice(2));
let shell = require('shelljs');
let fs = require('fs');
let xmlParser = require('xml2js').parseString;

console.log('Movilizame build -- Starting building');

let TARGET = argv.target || 'default';
let PROD = argv.prod || false;
let PLATFORM = argv.platform || 'android';
if (PLATFORM === 'ios' || PLATFORM === 'android') {
    process.env.CORDOVA = true;
}
process.env.TARGET_APP = TARGET;
const projectPath = `./projects/${TARGET}/cordova`;

function showError (code, stderr, stdout) {
    console.log('ERROR IN CORDOVA:');
    console.log('CODE:', code);
    console.log('STDERR', stderr)
    console.log('STDOUT', stdout);
}

function buildAndCheckPlatform (callback) {
    let options = {
        env: process.env
    };
    let buildEnv = PROD ? 'build.js' : 'build-dev.js';
    console.log(`cross-env PLATFORM=${PLATFORM} node build/${buildEnv}`);
    shell.exec(`cross-env PLATFORM=${PLATFORM} node build/${buildEnv}`, options);
    if (!fs.existsSync(`./projects/${TARGET}/cordova/platforms/${PLATFORM}`)) {
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
    let xml = fs.readFileSync(`./projects/${TARGET}/cordova/config.xml`);
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
            shell.exec('webpack-dev-server --inline --progress --config build/webpack.dev.conf.js',
                {
                    env: process.env,
                    async: true
                }
            );
            break;
        case 'build':
            buildAndCheckPlatform(() => {
                shell.exec(`cordova build ${PLATFORM}`, {
                    env: process.env,
                    cwd: projectPath,
                    silent: true
                }, showError);
            });
            break;
        case 'prepare':
            buildAndCheckPlatform(() => {
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
