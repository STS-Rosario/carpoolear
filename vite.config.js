import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import fs from 'fs';

const TARGET_APP = process.env.VITE_TARGET_APP || process.env.TARGET_APP || 'carpoolear';
const PLATFORM = process.env.PLATFORM || '';
const isCapacitor = PLATFORM === 'android' || PLATFORM === 'ios';
const isDesktop = PLATFORM === 'DESKTOP' || PLATFORM === 'browser';

function multiProjectResolver(targetApp) {
    return {
        name: 'multi-project-resolver',
        enforce: 'pre',
        resolveId(source, importer) {
            if (!targetApp || targetApp === 'default') return null;
            if (!importer) return null;

            // Only handle relative imports from within src/
            if (!source.startsWith('.') && !source.startsWith('/')) return null;

            const resolved = path.resolve(path.dirname(importer), source);

            // Try adding the target app variant extension for known file types
            const extensionsToTry = ['.css', '.js', '.vue', '.json'];
            for (const ext of extensionsToTry) {
                // If import already has an extension
                if (resolved.endsWith(ext)) {
                    const base = resolved.slice(0, -ext.length);
                    const variant = base + '.' + targetApp + ext;
                    if (fs.existsSync(variant)) {
                        return variant;
                    }
                }
            }

            // If import has no extension, try each extension with variant
            if (!path.extname(resolved)) {
                for (const ext of extensionsToTry) {
                    const variant = resolved + '.' + targetApp + ext;
                    if (fs.existsSync(variant)) {
                        return variant;
                    }
                }
            }

            return null;
        }
    };
}

export default defineConfig(({ mode }) => {
    let base = '/';
    if (mode === 'production' && isDesktop) {
        base = '/app/';
    } else if (isCapacitor) {
        base = '';
    }

    const outDir = isCapacitor ? 'www' : 'dist';

    return {
        plugins: [
            multiProjectResolver(TARGET_APP),
            vue({
                template: {
                    compilerOptions: {
                        compatConfig: {
                            MODE: 2
                        }
                    }
                }
            })
        ],
        resolve: {
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
            alias: {
                '@': path.resolve(__dirname, 'src'),
                vue: '@vue/compat',
                src: path.resolve(__dirname, 'src'),
                assets: path.resolve(__dirname, 'src/assets'),
                components: path.resolve(__dirname, 'src/components')
            }
        },
        define: {
            'process.env.NODE_ENV': JSON.stringify(mode)
        },
        css: {
            preprocessorOptions: {
                less: {}
            }
        },
        server: {
            port: 8080,
            host: 'localhost'
        },
        build: {
            outDir,
            assetsDir: 'static',
            sourcemap: mode === 'production'
        },
        base
    };
});
