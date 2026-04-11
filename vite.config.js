import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslint from 'vite-plugin-eslint';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const target = process.env.TARGET_APP || 'default';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const nodeEnv = env.NODE_ENV || 'development';

    const PLATFORM = process.env.PLATFORM || 'browser';
    const isWebBuild = PLATFORM === 'browser';
    const routeBase = isWebBuild ? '/app/' : '';
    const historyMode = env.HISTORY_MODE || (isWebBuild ? 'history' : 'hash');

    return {
        root: '.',
        publicDir: 'static',
        plugins: [
            vue(),
            eslint({
                formatter: 'stylish',
                failOnError: false,
                include: ['src/**/*.js'],
                exclude: ['src/**/*.vue']
            }),
            viteStaticCopy({
                targets: [
                    {
                        src: 'static/*',
                        dest: 'static'
                    }
                ]
            })
        ],
        resolve: {
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.css'],
            alias: {
                '@': path.resolve(__dirname, './'),
                src: path.resolve(__dirname, './src'),
                components: path.resolve(__dirname, './src/components'),
                assets: path.resolve(__dirname, './src/assets'),
                vue: '@vue/compat',
                marked: path.resolve(__dirname, './node_modules/marked/lib/marked.cjs'),
                styles: path.resolve(__dirname, './src/styles')
            }
        },
        define: {
            'process.env': JSON.stringify({
                NODE_ENV: nodeEnv,
                ROUTE_BASE: routeBase,
                TARGET_APP: env.TARGET_APP || target,
                WEB_URL: env.WEB_URL || 'https://carpoolear.com.ar/app'
            }),
            VITE_API_URL: JSON.stringify(env.API_URL || 'http://carpoolear_backend.test'),
            VITE_TARGET_APP: JSON.stringify(env.TARGET_APP || target),
            VITE_ROUTE_BASE: JSON.stringify(routeBase),
            VITE_HISTORY_MODE: JSON.stringify(historyMode),
            VITE_FACEBOOK_API: JSON.stringify(env.FACEBOOK_API || ''),
            VITE_MAPS_API: JSON.stringify(env.MAPS_API || ''),
            VITE_RECAPTCHA_SITE_KEY: JSON.stringify(env.RECAPTCHA_SITE_KEY || ''),
            VITE_FIREBASE_PARAMS: JSON.stringify(env.FIREBASE_PARAMS || ''),
            VITE_FIRABASE_VAPID_KEY: JSON.stringify(env.FIRABASE_VAPID_KEY || '')
        },
        optimizeDeps: {
            include: ['vue', 'vue-router', 'vue-i18n', '@vue/compat']
        },
        server: {
            port: 8080,
            host: 'localhost',
            strictPort: false,
            proxy: {
                '/api': {
                    target: 'http://carpoolear_backend.test',
                    changeOrigin: true,
                    configure: (proxy) => {
                        proxy.on('proxyRes', (proxyRes) => {
                            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
                        });
                    }
                }
            }
        },
        build: {
            outDir: `dist/${target}/${nodeEnv}/www`,
            assetsDir: 'static',
            sourcemap: true,
            minify: 'terser',
            rollupOptions: {
                input: {
                    main: path.resolve(__dirname, 'index.html')
                },
                output: {
                    entryFileNames: 'js/[name].[hash].js',
                    chunkFileNames: 'js/[name].[hash].js',
                    assetFileNames: '[name].[hash].[ext]'
                }
            }
        },
        css: {
            preprocessorOptions: {
                less: {
                    javascriptEnabled: true
                }
            }
        }
    };
});
