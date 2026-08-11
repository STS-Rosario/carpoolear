# Trip Creation Contribution Step Design

**Date:** 2026-08-06  
**Scope:** Legacy `carpoolear/` wizard

## Goal

Dedicated driver **Contribución** step matching mockups: amount input, suggested-contribution accordion toggle, and Importante non-profit notice.

## Step order

Insert `STEP.CONTRIBUTION` between seats and description:

`… → CAR → SEATS → CONTRIBUTION → DESCRIPTION → LAST_DETAILS`

- Drivers only, and only when `module_seat_price_enabled`
- Passengers skip; drivers without seat-price module skip

Renumber: CONTRIBUTION=8, DESCRIPTION=9, LAST_DETAILS=10.

## UI

- Question + subtitle
- `$` + input + `por persona` (binds `form.price`)
- Blue accordion: **Contribución sugerida: $ X** — toggles expand; applying suggested fills input (from `recommended_seat_price_cents`)
- Expanded: “¿Cómo se calcula…?” + existing recommended description copy
- Gray **Importante** box (non-profit warning)
- Keep `no_lucrar` checkbox on last details

## Validation

Move seat-price validation from seats → contribution step.
