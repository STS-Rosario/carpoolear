module.exports = {
    plugins: {
        'postcss-import': {},
        'postcss-preset-env': {
            // Prefer package.json browserslist. Forcing IE9 rewrites :has() into
            // escaped attribute selectors that lightningcss minify cannot parse.
            browsers: 'defaults and fully supports es6-module, >0.5% in AR and not dead',
            features: {
                'has-pseudo-class': false
            }
        }
    }
};
