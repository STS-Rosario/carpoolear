require('./check-versions')();

process.env.NODE_ENV = 'development';
process.env.SERVE = false;;
// process.env.CORDOVA = false;

const util = require('util');
const ora = require('ora');
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const config = require('../config');
const webpackConfig = require('./webpack.dev-build.conf');
const SWwebpackConfig = require('./service-worker.webpack.config');

const spinner = ora('Building for development...');
spinner.start();

const rmP = util.promisify(rm);
const webpackP = util.promisify(webpack);

rmP(path.join(config.build.assetsRoot, config.build.assetsSubDirectory)).then(() => {
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
