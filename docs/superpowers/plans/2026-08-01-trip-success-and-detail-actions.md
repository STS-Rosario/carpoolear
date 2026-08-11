# Trip success + detail actions polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle trip-creation success actions and trip-detail owner CTAs into columns with the agreed primary/secondary hierarchy, strengthen invite prompt typography, and make native checkboxes dark grey app-wide.

**Architecture:** Markup/CSS updates in `TripCreationSuccess.vue`, `TripInviteFriends.vue`, and `TripButtons.vue`, plus shared checkbox rules in `base.css` / `main.carpoolear.css`. Keep existing share/invite/return/template behavior.

**Tech Stack:** Vue 2 SFC, Bootstrap `btn` classes, Font Awesome, Vitest source assertions, existing `AppButton`.

## Global Constraints

- Repo: legacy `carpoolear/` only (not `carpoolear-nx`)
- No backend or i18n copy changes
- TDD: failing test → implement → commit each `test:` / `feat:` / `fix:` step

---

### Task 1: Success screen action column

**Files:** `TripCreationSuccess.view.test.js`, `TripCreationSuccess.vue`

- [ ] Write failing tests: column flex; Ver viaje primary first; Compartir/Regreso/Guardar secondary; Regreso `fa-arrow-left`; Guardar `fa-bookmark`
- [ ] Reorder markup + classes + icons; column CSS
- [ ] Commit

### Task 2: Invite prompt + CTAs

**Files:** `TripInviteFriends.view.test.js`, `TripInviteFriends.vue`

- [ ] Failing tests: prompt bold + larger; Invitar primary; Cerrar secondary
- [ ] Style prompt; keep button variants
- [ ] Commit

### Task 3: App-wide grey checkboxes

**Files:** style tests or invite/base CSS assertions; `base.css`, `main.carpoolear.css`

- [ ] Failing test for `accent-color` / dark grey on `input[type="checkbox"]`
- [ ] Add shared rule (~`#555`)
- [ ] Commit

### Task 4: Trip detail Edit/Cancel column

**Files:** `TripButtons.view.test.js`, `TripButtons.vue`, `trip-detail.css` + `tripDetail.styles.test.js` as needed

- [ ] Failing tests: buttons-container column; no desktop side-by-side pairing
- [ ] Force column stack; adjust desktop CTA width rules so Cancel is below Edit
- [ ] Commit
