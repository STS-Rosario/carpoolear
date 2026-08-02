# P1 search and bank selects → AppField

**Date:** 2026-08-01  
**Status:** Approved

## Goal

Migrate leftover user-facing preference and bank `<select class="form-control">` controls onto `AppField` + borderless select, matching TicketNew / car / create-trip wizard.

## Decisions

- Two TDD slices: SearchTrip first, then Register + UpdateProfile bank fields.
- No new `AppSelect` component; page-local borderless select classes (reuse TicketNew padding pattern).
- No filter/search or bank validation behavior changes.

## Slice 1 — SearchTrip preference selects

**Files:** `SearchTrip.vue` (+ view test)

- Desktop and mobile `allowPreferenceFilterFields` loops: wrap each select in `AppField` with `:label="$t(field.labelKey)"` and `label-for`.
- Remove `form-control`; use borderless select class (e.g. `trips-search__preference-select`).
- Keep hide-carpooleado checkbox unchanged.

## Slice 2 — Bank account selects

**Files:** `Register.vue`, `UpdateProfile.vue` (+ view tests)

- Tipo de cuenta / banco → `AppField` + borderless select.
- Surface errors via AppField `:error` (or label slot + error) from existing `accountTypeError` / `accountBankError`.
- UpdateProfile required `(*)` markers: keep via AppField `#label` slot.
- Set bank select `id="bancoDeCuenta"` (currently empty).

## Out of scope

- P2 chat search / live URL / file inputs
- Leftover red `btn-primary` buttons
- Admin search forms
- DatePicker internal `form-control` classes

## Success

- No `form-control` on SearchTrip preference selects or Register/UpdateProfile bank selects.
- Visual chrome matches other AppField selects; behavior unchanged.
