// Capacitor-specific configuration
const path = require('path');
const TARGET = process.env.TARGET_APP || 'default';
const NODE_ENV = process.env.NODE_ENV || 'production';

module.exports = {
    build: {
        index: path.resolve(
            __dirname,
            `../dist/${TARGET}/${NODE_ENV}/www/index.html`
        ),
        assetsRoot: path.resolve(
            __dirname,
            `../dist/${TARGET}/${NODE_ENV}/www/`
        ),
        assetsSubDirectory: 'static',
        assetsPublicPath: './', // Use relative paths for Capacitor
        productionSourceMap: false, // Disable source maps for smaller bundle
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: false
    },
    dev: {
        host: 'localhost',
        port: 8080,
        assetsSubDirectory: 'static',
        assetsPublicPath: './', // Use relative paths for Capacitor
        proxyTable: {},
        autoOpenBrowser: true,
        errorOverlay: true,
        notifyOnErrors: true,
        poll: false,
        useEslint: true,
        showEslintErrorsInOverlay: false,
        cssSourceMap: false
    }
};
