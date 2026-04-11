# Webpack to Vite Migration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate Carpoolear frontend from Webpack 5 to Vite while preserving all functionality including Cordova/Capacitor builds and tests.

**Architecture:** Replace webpack-dev-server with Vite, migrate webpack config to vite.config.js, update movilizame.js to use Vite CLI, and adjust environment variable access from process.env to import.meta.env.

**Tech Stack:** Vite 5, @vitejs/plugin-vue, vite-plugin-eslint, Pinia, Vue Router 4, Vitest, Playwright, Cordova/Capacitor

---

## Chunk 1: Phase 1 - Core Vite Setup

### Task 1.1: Install Vite and required dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add Vite dependencies to package.json**

Run: `npm install -D vite @vitejs/plugin-vue vite-plugin-eslint`

Verify: Check package.json has new devDependencies

- [ ] **Step 2: Verify Vue 3 compatibility**

Run: `npm list vue @vue/compat @vitejs/plugin-vue`

Expected: Both vue and @vue/compat should be listed

---

### Task 1.2: Create vite.config.js

**Files:**
- Create: `vite.config.js`

- [ ] **Step 1: Create basic vite.config.js**

```javascript
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const target = process.env.TARGET_APP || 'default'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
        'src': path.resolve(__dirname, './src'),
        'components': path.resolve(__dirname, './src/components'),
        'assets': path.resolve(__dirname, './src/assets'),
        'vue': 'vue'
      }
    },
    define: {
      'process.env': env
    },
    server: {
      port: 8080,
      host: 'localhost'
    },
    build: {
      outDir: `dist/${target}/development/www`,
      assetsDir: 'static',
      sourcemap: true
    }
  }
})
```

- [ ] **Step 2: Test vite.config.js syntax**

Run: `node -e "require('./vite.config.js')"`

Expected: No errors (will be undefined since it's an ES module)

---

### Task 1.3: Create postcss.config.js

**Files:**
- Create: `postcss.config.js`

- [ ] **Step 1: Create postcss.config.js with plugins from webpack**

```javascript
module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {
      browsers: ['last 2 versions', 'ie 9']
    }
  }
}
```

- [ ] **Step 2: Verify postcss plugins are installed**

Run: `npm list postcss-import postcss-preset-env`

Expected: Both listed in node_modules

---

## Chunk 2: Phase 2 - Build Scripts Migration

### Task 2.1: Update movilizame.js to use Vite

**Files:**
- Modify: `movilizame.js:135-156`

- [ ] **Step 1: Update 'serve' case to use Vite**

Replace the serve case in movilizame.js:
```javascript
case 'serve':
  process.env.SERVE = true;
  process.env.CORDOVA = false;
  process.env.NODE_ENV = NODE_ENV;
  process.env.TARGET_APP = TARGET;
  const viteBin = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
  const child = cp.spawn(process.execPath, [
    viteBin,
    '--host',
    '--port',
    process.env.PORT || '8080',
    '--config',
    'vite.config.js'
  ], {
    env: process.env,
    stdio: 'inherit'
  });
  child.on('exit', (code, signal) => {
    process.exit(signal ? 1 : (code === null ? 1 : code));
  });
  break;
```

- [ ] **Step 2: Update 'build' case to use Vite**

```javascript
case 'build':
  process.env.CORDOVA = true;
  process.env.NODE_ENV = NODE_ENV;
  process.env.TARGET_APP = TARGET;
  shell.exec(`cross-env PLATFORM=${PLATFORM} node node_modules/vite/bin/vite.js build`, options);
  // ... rest of Cordova build
  break;
```

---

### Task 2.2: Update package.json scripts

**Files:**
- Modify: `package.json:12-21`

- [ ] **Step 1: Update dev script to use Vite**

The dev script currently calls movilizame.js serve. Since movilizame.js will now use Vite, verify the script works:
Run: `npm run dev -- --help` (to check Vite is invoked)

- [ ] **Step 2: Test dev server starts**

Run: `timeout 10 npm run dev 2>&1 | head -20` (just check it starts)

Expected: Vite dev server output, not webpack

---

## Chunk 3: Phase 4 - Environment Variables Migration

### Task 3.1: Update src/main.js

**Files:**
- Modify: `src/main.js:45, 173, 178, 187, 197`

- [ ] **Step 1: Replace process.env.ROUTE_BASE with import.meta.env.ROUTE_BASE**

In src/main.js line 45:
```javascript
const ROUTE_BASE = import.meta.env.VITE_ROUTE_BASE || '';
```

- [ ] **Step 2: Replace process.env.SERVE with import.meta.env.VITE_SERVE**

In src/main.js line 173:
```javascript
if (import.meta.env.VITE_SERVE) {
```

- [ ] **Step 3: Replace process.env.NODE_ENV with import.meta.env.NODE_ENV**

In src/main.js lines 178, 187:
```javascript
if (import.meta.env.DEVELOPMENT) {  // Vite uses DEV or PROD
```

Note: Vite uses `import.meta.env.DEV` and `import.meta.env.PROD` instead of NODE_ENV

- [ ] **Step 4: Replace process.env.TARGET_APP with import.meta.env.VITE_TARGET_APP**

In src/main.js line 197:
```javascript
console.log('APP NAME: ' + import.meta.env.VITE_TARGET_APP);
```

---

### Task 3.2: Update src/router/index.js

**Files:**
- Modify: `src/router/index.js:9-11, 54`

- [ ] **Step 1: Replace process.env with import.meta.env**

```javascript
history: import.meta.env.VITE_HISTORY_MODE === 'history'
  ? createWebHistory(import.meta.env.VITE_ROUTE_BASE)
  : createWebHashHistory(import.meta.env.VITE_ROUTE_BASE)
```

And line 54:
```javascript
let appName = import.meta.env.VITE_TARGET_APP || 'Carpoolear';
```

---

### Task 3.3: Update src/services/network.js

**Files:**
- Modify: `src/services/network.js:6`

- [ ] **Step 1: Replace process.env.API_URL**

```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

---

### Task 3.4: Update src/services/utility.js

**Files:**
- Modify: `src/services/utility.js:21, 23`

- [ ] **Step 1: Replace process.env.API_URL and process.env.ROUTE_BASE**

```javascript
return import.meta.env.VITE_API_URL + subRoute + value;
// ...
return import.meta.env.VITE_ROUTE_BASE + 'static/img/default-profile.png';
```

---

### Task 3.5: Update src/stores/actionbars.js

**Files:**
- Modify: `src/stores/actionbars.js:10, 100`

- [ ] **Step 1: Replace process.env.TARGET_APP**

```javascript
let appName = import.meta.env.VITE_TARGET_APP || 'Carpoolear';
// ...
let currentAppName = config ? config.name_app : import.meta.env.VITE_TARGET_APP;
```

---

### Task 3.6: Update src/cordova/push-capacitor.js

**Files:**
- Modify: `src/cordova/push-capacitor.js:73, 79, 84-85, 88, 102, 107`

- [ ] **Step 1: Replace all process.env references**

```javascript
import.meta.env.VITE_FIREBASE_PARAMS !== undefined &&
import.meta.env.VITE_FIREBASE_PARAMS
import.meta.env.PROD
  ? import.meta.env.VITE_ROUTE_BASE + 'firebase-messaging-sw.js'
import.meta.env.VITE_FIREBASE_PARAMS
import.meta.env.VITE_FIRABASE_VAPID_KEY
```

---

### Task 3.7: Update src/cordova/facebook.js

**Files:**
- Modify: `src/cordova/facebook.js:37`

- [ ] **Step 1: Replace process.env.FACEBOOK_API**

```javascript
import.meta.env.VITE_FACEBOOK_API
```

---

## Chunk 4: Phase 3 - Dependencies Cleanup

### Task 4.1: Remove webpack dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Remove webpack-related dependencies**

Run: `npm uninstall webpack webpack-cli webpack-dev-server webpack-merge babel-loader vue-loader css-loader file-loader url-loader mini-css-extract-plugin optimize-css-assets-webpack-plugin copy-webpack-plugin html-webpack-plugin friendly-errors-webpack-plugin eslint-loader eslint-friendly-formatter`

- [ ] **Step 2: Verify package.json updated**

Run: `grep -E "webpack|eslint-loader" package.json`

Expected: No matches

---

### Task 4.2: Update Babel dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Replace babel-core with @babel/core**

Run: `npm uninstall babel-core babel-register babel-runtime && npm install -D @babel/core @babel/runtime`

- [ ] **Step 2: Replace babel-preset-env with @babel/preset-env**

Run: `npm uninstall babel-preset-env && npm install -D @babel/preset-env`

---

## Chunk 5: Phase 5 - Testing Integration

### Task 5.1: Update Vitest config for Vite

**Files:**
- Modify: `vitest.config.js`

- [ ] **Step 1: Update vitest.config.js to use Vite**

```javascript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
    exclude: ['node_modules', 'e2e', 'dist']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      'src': path.resolve(__dirname, './src'),
      'vue': 'vue'
    }
  }
})
```

- [ ] **Step 2: Run Vitest to verify config**

Run: `npm run test:unit -- --run`

Expected: Tests run without webpack-related errors

---

### Task 5.2: Verify Playwright works with Vite

**Files:**
- Modify: `playwright.config.js` (if needed)

- [ ] **Step 1: Check Playwright config**

Run: `cat playwright.config.js | head -30`

- [ ] **Step 2: Start dev server and test Playwright**

Run: `npm run dev &` (start in background)
Wait 5 seconds
Run: `npm run test:frontend -- --headed` (or check it starts)

Expected: Playwright can connect to localhost:8080

---

## Chunk 6: Phase 6 - Mobile/Cordova Integration

### Task 6.1: Verify Vite output for Cordova

**Files:**
- Modify: `vite.config.js` (if needed)

- [ ] **Step 1: Configure Vite output for Cordova**

Update vite.config.js build section:
```javascript
build: {
  outDir: `dist/${target}/${process.env.NODE_ENV || 'production'}/www`,
  assetsDir: 'static',
  sourcemap: false,
  minify: 'terser',
  rollupOptions: {
    output: {
      entryFileNames: 'js/[name].[hash].js',
      chunkFileNames: 'js/[name].[hash].js',
      assetFileNames: '[name].[hash].[ext]'
    }
  }
}
```

- [ ] **Step 2: Test web build**

Run: `npm run build:web`

Expected: dist folder created with www/index.html and static assets

---

### Task 6.2: Test Android build

**Files:**
- Verify: Cordova config

- [ ] **Step 1: Run Android build**

Run: `npm run build:android`

Expected: APK generated in platforms/android/app/build/outputs/apk/debug/

---

## Chunk 7: Cleanup and Final Verification

### Task 7.1: Remove old webpack build files

**Files:**
- Delete: `build/` folder (after verifying everything works)

- [ ] **Step 1: Verify no webpack references remain**

Run: `grep -r "webpack" src/ --include="*.js" --include="*.vue"`

Expected: No matches

- [ ] **Step 2: Delete build folder**

Run: `rm -rf build/`

- [ ] **Step 3: Commit changes**

```bash
git add -A
git commit -m "feat: migrate from webpack to vite"
```

---

### Task 7.2: Final verification

- [ ] **Step 1: Run all tests**

Run: `npm run test:unit && npm run test:frontend`

- [ ] **Step 2: Verify dev server works**

Run: `npm run dev` (in background, check it starts)

- [ ] **Step 3: Verify production build works**

Run: `npm run build:web`

- [ ] **Step 4: Verify Android build works**

Run: `npm run build:android` (if environment allows)

---

## Notes

- Environment variables in Vite must be prefixed with `VITE_` to be exposed to client-side code
- The `define` option in vite.config.js can also be used for global replacements
- For multi-project support, the TARGET_APP env var is passed through to Vite config
- Cordova/Capacitor builds require the web assets to be in the correct directory structure