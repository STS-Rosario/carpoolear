# Search and bank selects AppField Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate SearchTrip preference selects and Register/UpdateProfile bank selects to AppField + borderless select.

**Architecture:** Same TicketNew pattern — AppField owns chrome; select is borderless inside. Two independent TDD slices.

**Tech Stack:** Vue SFC, Vitest source tests, existing AppField.

**Spec:** `docs/superpowers/specs/2026-08-01-search-and-bank-selects-design.md`

## Global Constraints

- Legacy `carpoolear/` only
- No behavior/validation changes
- TDD: `test:` then `feat:` per slice

---

### Task 1: SearchTrip preference selects

**Files:** `src/components/sections/SearchTrip.vue`, `SearchTrip.view.test.js` (create or extend)

- [ ] Failing test: AppField around preference selects; no `form-control` on those selects; desktop + mobile loops
- [ ] Implement AppField + borderless select CSS
- [ ] Commit test then feat

### Task 2: Register + UpdateProfile bank selects

**Files:** `Register.vue`, `UpdateProfile.vue`, their view tests

- [ ] Failing tests: AppField for tipo/banco; `id="bancoDeCuenta"`; no form-control on those selects; errors wired
- [ ] Implement
- [ ] Commit test then feat
