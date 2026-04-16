import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslint from 'vite-plugin-eslint';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const target = process.env.TARGET_APP || 'default';

/**
 * Branding assets: repo folder is static/img/; Vite publicDir copies contents to out root → URLs are {base}img/...
 * Movilizame `serve` sets TARGET_APP to "default" when unset; .env uses VITE_TARGET_APP for the real app.
 * Prefer an explicit non-default shell TARGET_APP (e.g. apalancar build) over VITE_TARGET_APP.
 */
function resolveBrandingTarget(env) {
    const shell = process.env.TARGET_APP;
    if (shell && shell !== 'default') {
        return shell;
    }
    return env.VITE_TARGET_APP || env.TARGET_APP || 'default';
}

/**
 * Vue Router + Vite asset base.
 *
 * Web production is hosted under /app/ (see .env.production).
 * Capacitor (android/ios) serves assets from the web root → MUST use '' base,
 * otherwise the app requests /app/* and everything 404s (white screen).
 *
 * If you ever need a non-empty base on mobile, set VITE_MOBILE_ROUTE_BASE explicitly.
 */
function resolveRouteBase(rawWeb, rawMobile, isWebBuild) {
    const raw = isWebBuild ? rawWeb : rawMobile;
    const trimmed =
        raw !== undefined && raw !== null ? String(raw).trim() : '';
    if (trimmed !== '') {
        if (trimmed === '/') {
            return '/';
        }
        let b = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
        if (!b.endsWith('/')) {
            b += '/';
        }
        return b;
    }
    return isWebBuild ? '/app/' : '';
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const nodeEnv = env.NODE_ENV || 'development';

    const PLATFORM = process.env.PLATFORM || 'browser';
    const isWebBuild = PLATFORM === 'browser';
    const routeBase = resolveRouteBase(
        env.VITE_ROUTE_BASE,
        env.VITE_MOBILE_ROUTE_BASE,
        isWebBuild,
    );
    const brandingTarget = resolveBrandingTarget(env);
    // Web can use history mode; native should default to hash to avoid breaking relative assets
    // when the URL path changes (e.g. /trips → img/... resolves to /trips/img/... and 404s).
    const historyMode = isWebBuild
        ? (env.VITE_HISTORY_MODE || env.HISTORY_MODE || 'history')
        : (env.VITE_MOBILE_HISTORY_MODE || 'hash');
    // Must read VITE_API_URL — .env files use that name; env.API_URL was always undefined.
    const apiUrl =
        env.VITE_API_URL !== undefined && env.VITE_API_URL !== null
            ? String(env.VITE_API_URL)
            : env.API_URL || 'http://carpoolear_backend.test';

    return {
        base: routeBase === '/' ? '/' : routeBase,
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
                marked: path.resolve(__dirname, './node_modules/marked/lib/marked.cjs'),
                styles: path.resolve(__dirname, './src/styles')
            }
        },
        define: {
            // IMPORTANT:
            // App code uses `import.meta.env.*` (Vite env injection), not only `process.env`.
            // In production `.env.production` sets VITE_ROUTE_BASE=/app/ and VITE_HISTORY_MODE=history
            // for the hosted web build. For native builds we must override those at compile time,
            // otherwise the app navigates under /app/* and all assets 404.
            'import.meta.env.VITE_ROUTE_BASE': JSON.stringify(routeBase),
            'import.meta.env.VITE_HISTORY_MODE': JSON.stringify(historyMode),
            'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl),
            'import.meta.env.VITE_TARGET_APP': JSON.stringify(brandingTarget),

            'process.env': JSON.stringify({
                NODE_ENV: nodeEnv,
                ROUTE_BASE: routeBase,
                TARGET_APP: brandingTarget,
                WEB_URL: env.WEB_URL || 'https://carpoolear.com.ar/app'
            }),
            VITE_API_URL: JSON.stringify(apiUrl),
            VITE_TARGET_APP: JSON.stringify(brandingTarget),
            VITE_ROUTE_BASE: JSON.stringify(routeBase),
            VITE_HISTORY_MODE: JSON.stringify(historyMode),
            VITE_FACEBOOK_API: JSON.stringify(env.FACEBOOK_API || ''),
            VITE_MAPS_API: JSON.stringify(env.MAPS_API || ''),
            VITE_RECAPTCHA_SITE_KEY: JSON.stringify(env.RECAPTCHA_SITE_KEY || ''),
            VITE_FIREBASE_PARAMS: JSON.stringify(env.FIREBASE_PARAMS || ''),
            VITE_FIRABASE_VAPID_KEY: JSON.stringify(env.FIRABASE_VAPID_KEY || '')
        },
        optimizeDeps: {
            include: ['vue', 'vue-router', 'vue-i18n']
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
