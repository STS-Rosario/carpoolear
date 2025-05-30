module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    extends: ['standard'],
    // required to lint *.vue files
    plugins: ['html'],
    // add your custom rules here
    rules: {
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

        semi: [1, 'always'],
        quotes: [2, 'single', { avoidEscape: true }],

        indent: [1, 4],

        'no-trailing-spaces': 1,

        'func-call-spacing': 1,

        'handle-callback-err': 1,

        'no-unused-vars': 1,

        // Disable trailing comma rules
        'comma-dangle': 'off',
        'comma-style': 'off',

        // Disable space before function parentheses
        'space-before-function-paren': 'off'
    }
};
