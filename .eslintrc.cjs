module.exports = {
    root: true,
    env: {
        browser: true,
        es2022: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-recommended'
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
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
        'no-unused-vars': 1,

        // Downgrade pre-existing issues to warnings
        'no-empty': 1,
        'no-async-promise-executor': 1,
        'no-useless-escape': 1,

        // Disable trailing comma rules
        'comma-dangle': 'off',
        'comma-style': 'off',

        // Disable space before function parentheses
        'space-before-function-paren': 'off',

        // Vue-specific rules relaxed during migration
        'vue/multi-word-component-names': 'off',
        'vue/no-v-html': 'off',
        'vue/require-default-prop': 'off',
        'vue/require-prop-types': 'off',
        'vue/no-mutating-props': 'warn',
        'vue/max-attributes-per-line': 'off',
        'vue/singleline-html-element-content-newline': 'off',
        'vue/html-indent': 'off',
        'vue/html-self-closing': 'off',
        'vue/first-attribute-linebreak': 'off',
        'vue/html-closing-bracket-newline': 'off',
        'vue/attributes-order': 'off'
    }
};
