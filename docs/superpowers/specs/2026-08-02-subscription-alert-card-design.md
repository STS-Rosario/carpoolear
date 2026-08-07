# Trip subscription alert card redesign

**Date:** 2026-08-02  
**Repo:** `carpoolear` (legacy Vue)  
**Out of scope:** backend, My Trips section heading/list layout beyond the item card

## Goal

Make each “Suscripciones a viajes” alert look like a modern DS card: vertically centered content + delete control with visible **Borrar** label.

## Behavior

- Card tap still runs the saved search (unchanged)
- Delete uses `@click.stop`, `AppButton` with `$t('borrar')` + trash icon, disabled while in progress
- Show origin / destination / date / role / matches as today

## UI

- Flex row, `align-items: center`
- Card chrome via `--ds-card-*` tokens (bg, radius, shadow)
- No Bootstrap `panel` / `col-*` for this item
- `data-testid="subscription-alert-card"` and `data-testid="subscription-alert-delete"`

## i18n

Add `borrar`: Arg/Esp `"Borrar"`, En `"Delete"`.
