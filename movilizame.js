#!/usr/bin/env node
const argv = require('minimist')(process.argv.slice(2));
const cp = require('child_process');
const path = require('path');
const shell = require('shelljs');
const fs = require('fs');
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

function resolveCordovaBin () {
    const base = path.join(__dirname, 'node_modules', '.bin');
    const unix = path.join(base, 'cordova');
    const win = path.join(base, 'cordova.cmd');
    if (fs.existsSync(unix)) {
        return unix;
    }
    if (fs.existsSync(win)) {
        return win;
    }
    return 'cordova';
}

function shellQuote (binPath) {
    return /\s/.test(binPath) ? `"${binPath}"` : binPath;
}

/** Cordova's JDK check runs `java`/`javac`; ensure JAVA_HOME/bin is on PATH for npm GUI/IDE runs. */
function cordovaEnv () {
    const env = { ...process.env };
    if (env.JAVA_HOME) {
        const javaBin = path.join(env.JAVA_HOME, 'bin');
        if (fs.existsSync(javaBin)) {
            const sep = path.delimiter;
            env.PATH = `${javaBin}${sep}${env.PATH || ''}`;
        }
    }
    return env;
}

function showError (code, stderr, stdout) {
    console.log('ERROR IN CORDOVA:');
    console.log('CODE:', code);
    console.log('STDERR', stderr);
    console.log('STDOUT', stdout);
}

function preBuildAndCheckPlatform (callback) {
    const folder = `dist/${TARGET}/${NODE_ENV}`;
    const folderCordovaResFiles = `dist/${TARGET}/${NODE_ENV}/res`;
    const cordovaFiles = `projects/${TARGET}/cordova`;
    if (fs.existsSync(folderCordovaResFiles)) {
        console.log('Deleting old files.');
        fs.rmSync(folderCordovaResFiles, { recursive: true, force: true });
    }
    fs.cp(cordovaFiles, folder, { recursive: true }, function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log('Copyng cordova assets.');
            buildAndCheckPlatform(callback);
        }
    });
}

function buildAndCheckPlatform (callback) {
    const options = {
        env: process.env
    };
    const viteBin = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
    console.log(`cross-env PLATFORM=${PLATFORM} node ${viteBin} build`);
    shell.exec(`cross-env PLATFORM=${PLATFORM} node ${viteBin} build`, options)
    ;
    if (!fs.existsSync(`./dist/${TARGET}/${NODE_ENV}/platforms/${PLATFORM}`)) {
        console.log('Adding platform: ' + PLATFORM + ' - path: ' + projectPath);
        shell.exec(`${shellQuote(resolveCordovaBin())} platform add ${PLATFORM}`, {
            cwd: projectPath,
            silent: true,
            env: cordovaEnv()
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
    const path = `./projects/${TARGET}/cordova/config.xml`;
    const xml = fs.readFileSync(path);
    xmlParser(xml, function (err, result) {
        if (err) {
            console.error(error);
        } else {
            process.env.APP_VERSION = result.widget.$.version;
            let i = 0;
            for (i; i < result.widget.plugin.length; i++) {
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
    const action = argv._[0];
    process.env.ACTION = action;
    loadAppVersion();
    switch (action) {
    case 'serve':
        process.env.SERVE = true;
        process.env.CORDOVA = false;
        process.env.NODE_ENV = NODE_ENV;
        process.env.TARGET_APP = TARGET;
        const viteBin = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
        const child = cp.spawn(process.execPath, [
            viteBin,
            '--host',
            '--port',
            process.env.PORT || '8080',
            '--config',
            'vite.config.js'
        ], {
            env: process.env,
            stdio: 'inherit'
        });
        child.on('exit', (code, signal) => {
            process.exit(signal ? 1 : (code === null ? 1 : code));
        });
        break;
    case 'build':
        preBuildAndCheckPlatform(() => {
            const viteBin = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
            shell.exec(`cross-env PLATFORM=${PLATFORM} node ${viteBin} build`, {
                env: process.env,
                cwd: __dirname,
                silent: true
            }, (code, stderr, stdout) => {
                if (code !== 0) {
                    console.log('Vite build failed:', stderr, stdout);
                }
                shell.exec(`${shellQuote(resolveCordovaBin())} build ${PLATFORM}`, {
                    env: cordovaEnv(),
                    cwd: projectPath,
                    silent: true
                }, showError);
            });
        });
        break;
    case 'prepare':
        preBuildAndCheckPlatform(() => {
            shell.exec(`${shellQuote(resolveCordovaBin())} prepare ${PLATFORM}`, {
                cwd: projectPath,
                silent: true,
                env: cordovaEnv()
            }, showError);
        });
        break;
    case 'build-web':
        process.env.CORDOVA = false;
        const buildNodeEnv = PROD ? 'production' : 'development';
        process.env.NODE_ENV = buildNodeEnv;
        process.env.TARGET_APP = TARGET;
        const viteBuildBin = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
        shell.exec(`node ${viteBuildBin} build`, {
            env: process.env,
            cwd: __dirname,
            silent: false
        });
        break;
    default:
        console.log(shell);
    }
}
