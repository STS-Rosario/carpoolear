require('./check-versions')();

process.env.NODE_ENV = 'production';
process.env.SERVE = false;

const util = require('util');
const ora = require('ora');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const config = require('../config');
const webpackConfig = require('./webpack.prod.conf');
const SWwebpackConfig = require('./service-worker.webpack.config');

console.log('CORDOVA =', process.env.CORDOVA);
const spinner = ora('Building for production...');
spinner.start();

const webpackP = util.promisify(webpack);

// Use fs.rm instead of rimraf for better compatibility
const targetPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory);

// Try to remove the directory using native fs methods
let rimrafPromise;
if (fs.rmSync) {
    // Node 14+: Use fs.rmSync
    rimrafPromise = Promise.resolve().then(() => {
        try {
            fs.rmSync(targetPath, { recursive: true, force: true });
        } catch (err) {
            // Ignore error if directory doesn't exist
            if (err.code !== 'ENOENT') {
                throw err;
            }
        }
    });
} else {
    // Fallback: Use fs.rm (Node 12+) or create directory removal manually
    const rmPromise = fs.rm ? util.promisify(fs.rm) : null;
    if (rmPromise) {
        rimrafPromise = rmPromise(targetPath, { recursive: true, force: true }).catch(err => {
            if (err.code !== 'ENOENT') throw err;
        });
    } else {
        // Ultimate fallback for older Node versions
        rimrafPromise = Promise.resolve(); // Skip deletion for now
        console.warn('Skipping directory cleanup - using older Node version');
    }
}

rimrafPromise.then(() => {
    return webpackP(SWwebpackConfig);
}).then(() => {
    return webpackP(webpackConfig);
}).then((stats) => {
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n\n');

    if (stats.hasErrors()) {
        console.log(chalk.red('  Build failed with errors.\n'));
        process.exit(1);
    }

    spinner.stop();

}).catch((err) => {
    throw err;
});
