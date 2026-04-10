# Migration Plan: Webpack → Vite

**Date:** 2026-04-10
**Status:** Draft
**Priority:** Preservar todo (mantener funcionalidad exacta)

---

## 1. Overview

Migrar el bundler de Webpack 5 a Vite para el proyecto Carpoolear, manteniendo compatibilidad con Cordova/Capacitor para builds móviles y preservando los tests existentes (Vitest + Playwright).

---

## 2. Current State

| Aspect | Current | Notes |
|--------|---------|-------|
| **Bundler** | Webpack 5 via custom `movilizame.js` CLI | Custom wrapper around webpack-dev-server |
| **Vue** | Vue 3 with `@vue/compat` | Hybrid Vue 2/3 setup |
| **State** | Pinia | Already migrated from Vuex |
| **Router** | Vue Router 4 | |
| **Testing** | Vitest + Playwright | Vitest already configured |
| **Mobile** | Cordova + Capacitor | iOS/Android builds |
| **Browserslist** | `defaults and fully supports es6-module`, `>0.5% in AR and not dead` | Same as current |

---

## 3. Scope

### 3.1 In Scope
- Reemplazar webpack-dev-server con Vite dev server
- Migrar configuración de webpack a vite.config.js
- Actualizar scripts de build en movilizame.js
- Mantener soporte para builds Cordova/Capacitor
- Mantener tests existentes (Vitest + Playwright)
- Soporte multi-proyecto (TARGET_APP)

### 3.2 Out of Scope
- Migración de Vue 2 a Vue 3 completa (ya está en Vue 3)
- Cambios en la lógica de la aplicación
- Nuevas features

---

## 4. Architecture

### 4.1 Vite Config Structure

```javascript
// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = process.env.TARGET_APP || 'default'
  
  return {
    plugins: [vue(), eslint()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
        'src': path.resolve(__dirname, './src'),
        'components': path.resolve(__dirname, './src/components'),
        'vue': 'vue' // or @vue/compat if needed
      }
    },
    define: {
      'process.env': env
    },
    // ... more config
  }
})
```

### 4.2 Movilizame.js Changes

- Replace `webpack-dev-server` spawn con Vite
- Keep Cordova integration for mobile builds
- Environment variable handling via Vite's `loadEnv()`

---

## 5. Implementation Phases

### Phase 1: Core Vite Setup

**1.1 Create vite.config.js**
- [ ] Install Vite and required plugins
- [ ] Configure resolve aliases (`@`, `src`, `components`, `assets`)
- [ ] Configure `define` for environment variables
- [ ] Add multi-project support via TARGET_APP
- [ ] Configure dev server on port 8080
- [ ] Configure source maps

**1.2 Install Vite plugins**
- [ ] `vite` ^5.x
- [ ] `@vitejs/plugin-vue` - Vue SFC support
- [ ] `vite-plugin-eslint` - Replace eslint-loader
- [ ] `vite-plugin-html` - Replace HtmlWebpackPlugin (optional, Vite has built-in)
- [ ] `vite-plugin-static-copy` - Replace CopyWebpackPlugin

**1.3 PostCSS migration**
- [ ] Create postcss.config.js
- [ ] Migrate plugins: postcss-import, postcss-preset-env
- [ ] Remove mini-css-extract-plugin (Vite handles automatically)

### Phase 2: Build Scripts Migration

**2.1 Update movilizame.js**
- [ ] Replace webpack-dev-server spawn with Vite CLI
- [ ] Keep Cordova integration for mobile builds
- [ ] Update environment variable handling

**2.2 Update package.json scripts**
- [ ] Update `dev` script
- [ ] Update `build` script
- [ ] Update `build:web` script

**2.3 Migrate webpack plugins**
- [ ] Create Vite plugin for WebpackMultiResolver logic
- [ ] Replace CopyWebpackPlugin with vite-plugin-static-copy
- [ ] Replace DefinePlugin with Vite's `define` option

### Phase 3: Dependencies Cleanup

**3.1 Remove webpack dependencies**
```
babel-loader, vue-loader, css-loader, file-loader, url-loader,
mini-css-extract-plugin, optimize-css-assets-webpack-plugin,
copy-webpack-plugin, html-webpack-plugin, webpack, webpack-cli,
webpack-dev-server, webpack-merge, friendly-errors-webpack-plugin,
eslint-loader, eslint-friendly-formatter
```

**3.2 Update Babel dependencies**
- [ ] Replace babel-core, babel-preset-* with @babel/core, @babel/preset-env

### Phase 4: Code Adjustments

**4.1 Environment variables**
- [ ] Replace `process.env` with `import.meta.env` in:
  - `src/main.js`
  - `src/router/index.js`
  - `src/services/network.js`
  - `src/services/utility.js`
  - `src/stores/actionbars.js`
  - `src/cordova/push-capacitor.js`
  - `src/cordova/facebook.js`

**4.2 Static assets**
- [ ] Migrate /static folder to Vite's publicDir
- [ ] Update PWA/manifest paths in index.html

**4.3 Babel polyfill**
- [ ] Replace babel-polyfill import with core-js or remove if not needed

### Phase 5: Testing Integration

**5.1 Vitest config**
- [ ] Update vitest.config.js to work with Vite
- [ ] Keep existing test files working

**5.2 Playwright tests**
- [ ] Verify tests work with Vite dev server
- [ ] Update playwright.config.js if needed

### Phase 6: Mobile/Cordova Integration

**6.1 Verify Capacitor/Cordova works**
- [ ] Test `npm run build:android`
- [ ] Test `npm run build:web`
- [ ] Verify APK builds successfully

---

## 6. Risk Areas & Mitigations

| Risk | Mitigation |
|------|------------|
| Custom WebpackMultiResolver plugin | Recreate as Vite plugin or use resolve alias per target |
| babel-polyfill imports | Replace with core-js or Vite's polyfill handling |
| Global CSS imports | Migrate to Vite's css.preprocessorOptions |
| Cordova/Capacitor integration | Test early in Phase 2, not after everything else |
| ESLint with Vite | Use vite-plugin-eslint, tune rules |

---

## 7. Verification Steps

### 7.1 Development
- [ ] `npm run dev` starts Vite dev server on port 8080
- [ ] Vue app loads without errors
- [ ] Hot reload works

### 7.2 Production
- [ ] `npm run build` produces dist folder
- [ ] `npm run build:web` produces web assets

### 7.3 Mobile
- [ ] `npm run build:android` builds APK
- [ ] `npm run build:ios` builds iOS app

### 7.4 Tests
- [ ] `npm run test:unit` (Vitest) passes
- [ ] `npm run test:frontend` (Playwright) passes
- [ ] `npm run test:e2e` (Playwright E2E) passes

---

## 8. Dependencies to Remove

After migration complete, remove:
- webpack
- webpack-cli
- webpack-dev-server
- webpack-merge
- babel-loader
- vue-loader
- css-loader
- file-loader
- url-loader
- mini-css-extract-plugin
- optimize-css-assets-webpack-plugin
- copy-webpack-plugin
- html-webpack-plugin
- friendly-errors-webpack-plugin
- eslint-loader
- eslint-friendly-formatter

---

## 9. Dependencies to Add

New dependencies:
- vite
- @vitejs/plugin-vue
- vite-plugin-eslint
- vite-plugin-static-copy (optional)

Replace:
- babel-core → @babel/core
- babel-preset-env → @babel/preset-env

---

## 10. File Changes Summary

### New Files
- `vite.config.js`
- `postcss.config.js`

### Modified Files
- `package.json` - scripts and dependencies
- `movilizame.js` - replace webpack with vite
- `src/main.js` - import.meta.env
- `src/router/index.js` - import.meta.env
- `src/services/network.js` - import.meta.env
- `src/services/utility.js` - import.meta.env
- `src/stores/actionbars.js` - import.meta.env
- `src/cordova/push-capacitor.js` - import.meta.env
- `src/cordova/facebook.js` - import.meta.env

### Deleted Files (after verification)
- `build/webpack.base.conf.js`
- `build/webpack.dev.conf.js`
- `build/webpack.prod.conf.js`
- `build/webpack.dev-build.conf.js`
- `build/utils.js`
- `build/plugins/webpack-multi-resolver.js`

---

## 11. Timeline Estimate

| Phase | Duration | Total |
|-------|----------|-------|
| Phase 1: Core Vite Setup | 1 week | 1 week |
| Phase 2: Build Scripts | 1-2 weeks | 2-3 weeks |
| Phase 3: Dependencies | 1 week | 3-4 weeks |
| Phase 4: Code Adjustments | 1-2 weeks | 4-6 weeks |
| Phase 5: Testing | 1 week | 5-7 weeks |
| Phase 6: Mobile | 1-2 weeks | 6-8 weeks |

**Total Estimate: 6-8 weeks**