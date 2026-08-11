# Cars form DS inputs

**Date:** 2026-08-01  
**Status:** Approved

## Goal
Migrate car create/edit fields from Bootstrap `form-control` to design-system `AppInput` / `AppField`, and dedupe CompleteCarModal onto shared `CarForm`.

## Scope
- `CarForm.vue` — AppInput for patente / other brand / other model / year; AppField + CatalogCombobox for marca/modelo; AppField + select for color
- `CatalogCombobox.vue` — borderless input inside AppField (field chrome owns border/focus)
- `CompleteCarModal.vue` — body uses `CarForm` with `patente-disabled`; keep Guardar AppButton

## Out of scope
- Create-trip wizard car step
- Ratings textareas
- Validation/save behavior changes

## Approach
1. Restyle CatalogCombobox for AppField nesting
2. Migrate CarForm fields to App*
3. CompleteCarModal reuses CarForm (`patenteDisabled` prop)
