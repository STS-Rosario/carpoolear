# Date Range Search Filter Design

**Date:** 2026-08-06  
**Scope:** Legacy `carpoolear/` frontend + `carpoolear_backend/` trip search

## Goal

Let users search trips in an open-ended date range from **Filtros avanzados**.

## UX

1. Advanced filters checkbox: **Buscar en rango de fechas** (`buscarEnRangoDeFechas`).
2. **Off (default):** single date field labeled **Fecha**; request sends `date` (existing fuzzy ±3 days).
3. **On:** first field label becomes **Desde**; second picker **Hasta** appears beside it.
   - Only Desde → `from_date`
   - Only Hasta → `to_date`
   - Both → inclusive `from_date` + `to_date`
   - Neither → no date constraint
   - Never send `date` while range mode is on (avoids fuzzy ±3).
4. Unchecking range mode clears Hasta and keeps Desde as the single `date` value.
5. URL hydrate: presence of `from_date` and/or `to_date` enables range mode and expands advanced filters.

## API

Reuse existing `GET /api/trips` params `from_date` / `to_date` (inclusive day bounds in `TripRepository::search`). Prefer treating empty strings as absent (`!empty`) so blank query values do not enter the range branch.

## Out of scope

Subscription alerts / complementary-date UI still keyed off `date` only.
