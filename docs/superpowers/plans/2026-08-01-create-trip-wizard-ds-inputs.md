# Create-trip wizard DS inputs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate create-trip wizard fields onto `AppInput` / `AppField` / `AppTextarea`, starting with `AppInput` `actionRight`, then wizard-local fields, then Autocomplete/DatePicker.

**Architecture:** Extend shared `AppInput` to match `AppField`’s trailing-action slot. Swap wizard-local Bootstrap controls for App* components. Phase 2 nests shared Autocomplete/DatePicker under AppField chrome so wizard and search stop relying on `form-control` class strings.

**Tech Stack:** Vue SFC, Vitest source/view tests, existing DS CSS tokens in `app-input.css` / `app-field.css`.

**Spec:** `docs/superpowers/specs/2026-08-01-create-trip-wizard-ds-inputs-design.md`

## Global Constraints

- Repo: legacy `carpoolear/` only (not `carpoolear-nx`)
- No validation/save/draft behavior changes
- TDD: `test:` then `feat:` commits per slice
- After phase 1b, autocomplete/date may still use `form-control` until phase 2

---

### Task 1: AppInput `actionRight` (phase 1a)

**Files:**
- Modify: `src/components/ui/AppInput.vue`
- Modify: `src/styles/components/app-input.css`
- Test: `src/components/ui/AppInput.test.js`, `src/styles/appInput.styles.test.js`

**Interfaces:**
- Produces: `#actionRight` slot; class `app-input__control-wrap--action-right`; element `app-input__action-right`

- [ ] **Step 1: Write failing tests**

In `AppInput.test.js` add:

```js
it('supports an actionRight slot like AppField', () => {
    expect(source).toContain('actionRight');
    expect(source).toContain('app-input__control-wrap--action-right');
    expect(source).toContain('app-input__action-right');
});
```

In `appInput.styles.test.js` add expectation that CSS contains `.app-input__control-wrap--action-right` and `.app-input__action-right`.

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npx vitest run src/components/ui/AppInput.test.js src/styles/appInput.styles.test.js
```

- [ ] **Step 3: Implement** — mirror AppField: slot after input; modifier for padding-right `2.75rem`; absolute/flex action container aligned with password toggle sizing.

- [ ] **Step 4: Run tests — expect PASS**

- [ ] **Step 5: Commit** `test:` then `feat:` (or combined if already red-green in sequence with separate commits)

---

### Task 2: Point details + description + price

**Files:**
- Modify: `src/components/elements/TripPointDetailFields.vue`
- Modify: `src/components/views/NewTripCreationWizard.vue`
- Test: `src/components/elements/TripPointDetailFields.view.test.js`, `src/components/views/NewTripCreationWizard.view.test.js`
- Also update assertions in `NewTrip.view.test.js` that still require `form-control-price` if present

- [ ] **Step 1: Failing tests** — TripPointDetailFields uses AppInput labels/errors, no `form-control`; wizard uses AppTextarea for description and AppInput for price (update old price/`textarea` assertions).

- [ ] **Step 2: Implement** migrations; keep `v-model` / error props / maxlength / `@input` price handler.

- [ ] **Step 3: Commit** test then feat

---

### Task 3: Car select + template select

**Files:**
- Modify: `src/components/elements/TripCarStepPanel.vue`
- Modify: `src/components/views/NewTripCreationWizard.vue` (template modal)
- Test: `src/components/elements/TripCarStepPanel.view.test.js`, `NewTripCreationWizard.view.test.js`

- [ ] **Step 1: Failing tests** — AppField + borderless select; no `form-control` on those selects; keep `data-testid="trip-creation-template-select"`.

- [ ] **Step 2: Implement** TicketNew/CarForm select-in-AppField pattern + scoped borderless select CSS.

- [ ] **Step 3: Commit** test then feat

---

### Task 4: Schedule time inputs

**Files:**
- Modify: `src/components/views/NewTripCreationWizard.vue`
- Modify: `src/components/elements/WeeklySchedule.vue`
- Test: `NewTripCreationWizard.view.test.js` (+ create `WeeklySchedule.view.test.js` if none)

- [ ] **Step 1: Failing tests** — wizard time is AppInput `type="time"` with `#actionRight` caret calling `openWizardTimePicker`; WeeklySchedule edit time is AppInput; no `form-control-time` on those controls.

- [ ] **Step 2: Implement**; preserve `v-maska`, refs, caret behavior.

- [ ] **Step 3: Commit** test then feat

---

### Task 5: Autocomplete + DatePicker (phase 2)

**Files:**
- Modify: autocomplete consumer usage in `NewTripCreationWizard.vue` (and shared autocomplete/DatePicker as needed)
- Modify: `DatePicker.vue` / SearchTrip if shared chrome changes
- Test: wizard + SearchTrip view/style tests as applicable

- [ ] Nest place autocomplete + DatePicker in AppField; stop passing `form-control*` class strings from wizard
- [ ] Prefer shared chrome so SearchTrip stays consistent
- [ ] Remove obsolete wizard `:deep(.form-control…)` rules that only existed for migrated fields
- [ ] Commit test then feat

---

## Spec coverage checklist

- Phase 1a actionRight → Task 1
- Point details / price / description → Task 2
- Car + template selects → Task 3
- Wizard + weekly time → Task 4
- Autocomplete + DatePicker → Task 5
- Out of scope (checkboxes, steppers, behavior) → not tasked
