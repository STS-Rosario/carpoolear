# Trip card verified shield Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a verified shield after trips count on trip cards; remove the name-row verified badge on those cards.

**Architecture:** Change only `TripCardShell` (+ `trip-card.css`). List and ongoing cards inherit via the shell. Verified when `identity_validated` or `identity_validated_at`.

**Tech Stack:** Legacy Vue SFC, Font Awesome 4, Vitest view-source tests, CSS in `trip-card.css`.

**Spec:** `docs/superpowers/specs/2026-08-02-trip-card-verified-shield-design.md`

## Global Constraints

- No backend / nx changes
- Do not change `UserNameWithBadge` global behavior for non–trip-card consumers
- Unverified: no shield in DOM
- i18n: `$t('usuarioVerificado')` for title/aria-label

---

### Task 1: TripCardShell verified shield + plain name

**Files:**
- Modify: `src/components/elements/TripCardShell.vue`
- Modify: `src/styles/components/trip-card.css`
- Test: `src/components/elements/TripCardShell.view.test.js`

**Interfaces:**
- Consumes: `user.identity_validated`, `user.identity_validated_at`, `tripsCountLabel`
- Produces: `isDriverVerified` computed; meta shield `trip-card-shell__verified`; name without badge

- [ ] **Step 1: Write failing view tests** for shield after trips, verified gate, no name badge
- [ ] **Step 2: Run tests — expect RED**
- [ ] **Step 3: Commit** `test: require verified shield after trips on trip cards`
- [ ] **Step 4: Implement shell + CSS**
- [ ] **Step 5: Run tests — expect GREEN**
- [ ] **Step 6: Commit** `feat: show verified shield after trips count on trip cards`
