import vue from '@vitejs/plugin-vue';

/** @type {import('vitest').UserConfig} */
export default {
    // Compiles .vue SFCs so component tests can mount them (@vue/test-utils).
    // Component tests opt into a DOM with `// @vitest-environment happy-dom`.
    plugins: [vue()],
    test: {
        environment: 'node',
        include: ['src/**/*.test.js'],
        exclude: ['node_modules', 'e2e', 'dist']
    }
};
