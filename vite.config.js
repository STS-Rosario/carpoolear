import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const target = process.env.TARGET_APP || 'default'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const nodeEnv = env.NODE_ENV || 'development'
  
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
        'src': path.resolve(__dirname, './src'),
        'components': path.resolve(__dirname, './src/components'),
        'assets': path.resolve(__dirname, './src/assets'),
        'vue': '@vue/compat',
        'marked': path.resolve(__dirname, './node_modules/marked/lib/marked.cjs'),
        'styles': path.resolve(__dirname, './src/styles')
      }
    },
    define: {
      'process.env': {
        NODE_ENV: nodeEnv
      }
    },
    optimizeDeps: {
      include: ['vue', 'vue-router', 'vue-i18n', '@vue/compat']
    },
    server: {
      port: 8080,
      host: 'localhost',
      strictPort: false
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
  }
})