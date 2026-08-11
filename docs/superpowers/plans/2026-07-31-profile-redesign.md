# Public Profile Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle public profile (self + other) to match mocks: identity header above tabs, grey baseline + wider blue active tab, thumbs ratings, Perfil/Calificaciones/Viajes content layouts.

**Architecture:** Add `.profile-page` root + `profile-page.css`. Lift identity header above `Tabset` in `Profile.vue`. Slim `ProfileInfo` to tab content. Scope tab overrides under `.profile-page` so settings/admin tabs stay intact. Prefer CSS + light markup; no backend API changes.

**Tech Stack:** Vue 3 Options API, Vitest source tests, existing `UserRatingsCounts` / `UserNameWithBadge` / `RateItem` / `Trip`.

**Spec:** `docs/superpowers/specs/2026-07-31-profile-redesign-design.md`

**Repo root:** `carpoolear/` — do not edit `carpoolear-nx/`.

## Global Constraints

- Tab order/labels unchanged: Viajes → Perfil → Calificaciones.
- Thumbs only (no smileys). No breadcrumb. No Viajes juntos.
- No backend API changes (response-rate tile only if profile already has conversation fields).
- TDD: `test:` then `feat:`/`fix:` commits per step.
- Scope CSS under `.profile-page` (and keep `.settings-component` own-profile path working).

## File map

| File | Responsibility |
|------|----------------|
| `src/styles/components/profile-page.css` | Shell, tabs, header, chips, tiles, rating rows, trip cards |
| `src/styles/profilePage.styles.test.js` | CSS contracts |
| `src/styles/main.css` | Import profile-page.css |
| `src/utils/profileMemberStats.js` | Relative “Miembro hace …” helper |
| `src/components/elements/ProfileIdentityHeader.vue` | Avatar, name, verified pill, stats row |
| `src/components/views/Profile.vue` | `.profile-page` + header + tabs |
| `src/components/sections/ProfileInfo.vue` | Perfil tab content only |
| `src/components/sections/ProfileRates.vue` | Filter chips + list |
| `src/components/sections/ProfileTrip.vue` | Role filters + cards |
| Matching `*.view.test.js` / utils tests | Contracts |

---

### Task 1: Profile page CSS — tabs + shell tokens

**Files:**
- Create: `src/styles/components/profile-page.css`
- Create: `src/styles/profilePage.styles.test.js`
- Modify: `src/styles/main.css`

- [ ] **Step 1:** Failing test for `.profile-page .tabset > .nav-tabs` grey baseline, active blue underline, caret/`::after` sliding bar disabled.
- [ ] **Step 2:** Implement CSS + import; pass tests; commit `test:` then `feat:`.

### Task 2: Identity header above tabs

**Files:**
- Create: `src/components/elements/ProfileIdentityHeader.vue` (+ view test)
- Modify: `src/utils/profileMemberStats.js` (+ test for relative membership)
- Modify: `src/components/views/Profile.vue` (+ view test)
- i18n keys for verified pill / miembro hace / privacy / identidad / responde (as needed)

- [ ] **Step 1:** Failing tests (header markup; Profile wraps `.profile-page` + header outside tabs; no breadcrumb).
- [ ] **Step 2:** Implement; pass; commit.

### Task 3: Perfil tab content

**Files:**
- Modify: `ProfileInfo.vue` + `ProfileInfo.view.test.js`
- Update `profileAccountDesktop.styles.test.js` if grid expectations change

- [ ] Remove duplicate identity block from Perfil tab (header owns it).
- [ ] Sobre mí + identity verified row/tile + optional response tile + privacy callout; desktop side-by-side tiles.
- [ ] Keep friend actions; keep contact/cars when API already exposes them (own/admin/visibility), styled secondarily.
- [ ] Commit.

### Task 4: Calificaciones filters + rows

**Files:**
- Modify: `ProfileRates.vue` + tests; lightly restyle `RateItem` in profile context if needed

- [ ] Filter chips Todas/Positivas/Neutras/Negativas with counts; thumbs list rows; commit.

### Task 5: Viajes filters + cards

**Files:**
- Modify: `ProfileTrip.vue` (+ MyTrips if own tab must match); tests

- [ ] Todos/Conductor/Pasajero chips; card chrome matching mock (role, route, date/time); commit.

### Task 6: Verify

- [ ] Run related vitest suites; fix regressions; note manual visual check.
