/** @type {import('vitest').UserConfig} */
export default {
    test: {
        environment: 'node',
        include: ['src/**/*.test.js'],
        exclude: ['node_modules', 'e2e', 'dist']
    }
};
