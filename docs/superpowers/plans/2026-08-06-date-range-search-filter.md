# Date Range Search Filter Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (or subagent-driven-development) to implement this plan task-by-task. Commit after each RED / GREEN / REFACTOR phase.

**Goal:** Advanced-filter checkbox “Buscar en rango de fechas” with open-ended Desde/Hasta wired to `from_date`/`to_date`.

**Architecture:** Pure helpers in `searchAdvancedFilters.js` own param append/hydrate; `SearchTrip.vue` owns UI; `Trips.vue` restores query; backend hardens empty-string handling around existing range filters.

**Tech stack:** Vue 2 Options API, Vitest source/unit tests, Laravel `TripRepository::search`.

---

### Task 1: Date search param helpers

**Files:**
- Modify: `src/utils/searchAdvancedFilters.js`
- Modify: `src/utils/searchAdvancedFilters.test.js`

**Steps:**
1. RED: tests for `appendDateSearchParams`, hydrate/range detection in `hasAdvancedSearchFilters`.
2. GREEN: implement helpers.
3. Commit `test:` then `feat:` (or combined red/green commits per phase).

### Task 2: i18n labels

**Files:**
- Modify: `src/language/i18n.js` (arg/chl/en)
- Modify: `src/language/advancedSearchFilters.test.js`

**Keys:** `buscarEnRangoDeFechas`, `desde`, `hasta` (keep `fecha`).

### Task 3: SearchTrip UI + emit/hydrate/clear

**Files:**
- Modify: `src/components/sections/SearchTrip.vue`
- Modify: `src/components/sections/SearchTrip.view.test.js`
- Possibly: `src/styles/components/trips-search.css`

Checkbox in desktop + mobile advanced panels; second DatePicker; `@date_changed` handlers (avoid dual bus listeners); `appendDateSearchParams` in `emit`.

### Task 4: Trips URL restore

**Files:**
- Modify: `src/components/views/Trips.vue`
- Modify: `src/components/views/Trips.view.test.js` (or add query restore coverage)

Add `from_date`, `to_date` to `textFields` in `getSearchParamsFromQuery`.

### Task 5: Backend empty-string hardening

**Files:**
- Modify: `carpoolear_backend/app/Repository/TripRepository.php`
- Modify: `carpoolear_backend/tests/Unit/Repository/TripRepositoryTest.php`

RED: empty `from_date`/`to_date` must not enter range branch / must not break; open-ended still works. GREEN: use `!empty` instead of `isset` for range branch.

### Task 6: Verify

Frontend: lint + build. Backend: relevant PHPUnit suite.
