# Create-trip wizard DS inputs

**Date:** 2026-08-01  
**Status:** Approved — implemented

## Goal

Migrate create-trip wizard fields from Bootstrap `form-control` (plus deep DS-token CSS overrides) onto shared `AppInput` / `AppField` / `AppTextarea`, matching cars/tickets/profile patterns.

## Decisions

- **Phased delivery (approach C / structure 1):** wizard-local fields first; Autocomplete + DatePicker second.
- **Icon/action pattern:** extend `AppInput` with `actionRight` slot (parity with `AppField`), use for schedule time caret (and reusable elsewhere).
- **No behavior changes:** validation, masks, seat steppers, checkboxes, and save/template logic stay as-is.

## Out of scope

- Role cards, seats ± widgets, preference checkboxes, map/route panel
- Search preference selects, bank selects, chat/live/file inputs (other audit items)
- `carpoolear-nx`
- Changing trip create API or draft persistence

## Phase 1a — AppInput `actionRight`

Mirror `AppField`:

- Slot `actionRight` inside the control wrap
- Modifier class `app-input__control-wrap--action-right` for padding
- Styles aligned with password toggle / `app-field__action-right` (non-colliding with `--password`)
- Keep existing `iconLeft` / password toggle

Tests: `AppInput.test.js` + `appInput.styles.test.js` expect `actionRight` and the modifier class.

## Phase 1b — Wizard-local field map

| Surface | File(s) | Target |
| --- | --- | --- |
| Punto partida / llegada | `TripPointDetailFields.vue` | `AppInput` with label + error |
| Precio asiento | `NewTripCreationWizard.vue` | `AppInput` `type="number"` (+ `iconLeft` if current price icon is kept) |
| Descripción | `NewTripCreationWizard.vue` | `AppTextarea` |
| Auto select | `TripCarStepPanel.vue` | `AppField` + borderless `<select>` (TicketNew / CarForm pattern) |
| Choose-template modal select | `NewTripCreationWizard.vue` | `AppField` + borderless `<select>` |
| One-off time + caret | `NewTripCreationWizard.vue` | `AppInput` `type="time"` + `#actionRight` caret button (same `openWizardTimePicker` behavior) |
| Weekly schedule time | `WeeklySchedule.vue` | `AppInput` `type="time"` (no caret today; optional `actionRight` only if we add the same opener) |

**Still `form-control` after 1b (expected):** map `autocomplete` classes and `DatePicker` picker chrome — deferred to phase 2. Wizard deep `:deep(.form-control…)` rules may remain until phase 2 cleans them up; do not expand them for migrated fields.

**Cleanup:** remove `form-control` from migrated markup; drop dead icon/time CSS that only targeted those fields when unused.

## Phase 2 — Autocomplete + DatePicker

- Nest place autocomplete and date control in `AppField` (or equivalent DS chrome) so consumers stop passing `form-control*` class strings.
- Prefer field chrome owning border/focus (CatalogCombobox / SearchTrip AppField precedent).
- Consider SearchTrip: DatePicker/autocomplete are shared — avoid search regressions; migrate chrome so both wizard and search benefit, or gate wizard-only wrappers if shared change is too risky (prefer shared if styles already use AppField in search for origin/date).

Success for phase 2: wizard steps no longer rely on `form-control` for place/date; leftover deep overrides can be deleted or reduced to non-input chrome.

## Testing / TDD

Per repo TDD: `test:` then `feat:` commits for each slice.

Suggested slices:

1. AppInput `actionRight` (1a)
2. TripPointDetailFields + description + price
3. TripCarStepPanel + template select
4. Wizard time + WeeklySchedule time
5. Phase 2 Autocomplete/DatePicker

Source/view tests assert App* imports/usage and absence of `form-control` on migrated fields (scoped so phase-1 files can still mention form-control only where autocomplete/date remain, or assert per-field patterns).

## Success criteria

- Phase 1: all listed 1b fields use App* with no `form-control` on those controls; time caret still opens the native picker.
- Phase 2: autocomplete + date in wizard no longer use Bootstrap `form-control` classes; visual parity with current DS-token look.
- No intentional change to create-trip validation or navigation.
