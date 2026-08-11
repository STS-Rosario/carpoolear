# Trip Creation Preferences + Review Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild wizard description as preferences+comments and last details as review+no-lucrar modal.

**Architecture:** Keep `STEP.DESCRIPTION` / `STEP.LAST_DETAILS`. Extract UI into focused panels (`TripPreferencesStepPanel`, `TripReviewStepPanel`) plus small display helpers. Wire from `NewTripCreationWizard.vue`; i18n + existing `validateStep` / `no_lucrar` gates.

**Tech Stack:** Vue 2 Options API, Vitest source/unit tests, existing i18n messages, Modal component.

## Global Constraints

- Legacy `carpoolear/` only (not `carpoolear-nx/`)
- Keep Infancias wording in Spanish locales
- TDD: `test:` then `feat:` commits; auto-commit those prefixes
- Comment/description remains required
- Editar navigates via `setCurrentStep`

---

### Task 1: i18n copy

**Files:** `src/language/i18n.js`, `src/language/tripCharacteristicsLabels.test.js`, `src/language/tripInfanciasLabels.test.js`, `src/language/tripCreationLabels.test.js`

- [ ] Update `preferenciasViaje` to Preferencias del viaje / Preferences; flip characteristics test expectations
- [ ] Add preference/review/modal keys (arg/chl/en); Infancias labels for toggles/tags
- [ ] Register required keys in `tripCreationLabels.test.js`
- [ ] `npm run test:unit -- --run` relevant language tests → commit `test:` then `feat:`

### Task 2: Preferences step panel

**Files:** `src/components/elements/TripPreferencesStepPanel.vue` (+ view test), wizard wiring

- [ ] Failing view test for sections/toggles/textarea/friends visibility
- [ ] Implement panel; move prefs + autoaccept + description out of last details / old description UI
- [ ] Wire `STEP.DESCRIPTION` in wizard; passengers hide friends
- [ ] Commit `test:` / `feat:`

### Task 3: Review display helpers

**Files:** `src/utils/tripReviewDisplay.js` (+ test)

- [ ] Helpers: route lines, car label, seats label, price display, preference tag states, edit-target map
- [ ] Commit `test:` / `feat:`

### Task 4: Review step panel + modal

**Files:** `src/components/elements/TripReviewStepPanel.vue` (+ view test), wizard

- [ ] Failing tests for sections, Editar emit, no-lucrar, Más info modal
- [ ] Implement panel; wire as `STEP.LAST_DETAILS`; Editar → `setCurrentStep`
- [ ] Disable publish when driver `!no_lucrar`
- [ ] Commit `test:` / `feat:`

### Task 5: Cleanup + verify

- [ ] Remove old preference cards from last-details template leftovers
- [ ] Update wizard view tests; run related unit tests + `npm run lint`
- [ ] Fix any broken step-label expectations if titles change
