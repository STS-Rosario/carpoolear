# Trip Search Empty + Nearby Results Design

**Date:** 2026-08-06  
**Scope:** Legacy `carpoolear/` search results (`Trips.vue`)

## Goal

Match mockup for date-aware search results:

1. **Empty (no exact-day trips):** loupe-car empty state + alert CTA; optional “Ver viajes cercanos (± 3 días)” that **reveals** nearby trips already in the response (no re-fetch). Hide that link if there are no complementary trips.
2. **Has exact-day results:** list exact trips → alert CTA → **Viajes cercanos** heading + existing subtitle + ±3-day trips.

Reuse the current fuzzy `date` API response (exact day + ±3 days). Split client-side via existing `isComplementary` logic.

## Behaviors

### Classify trips

When `searchParams.data.date` is set:

- **Exact:** trip calendar day === search date  
- **Nearby / complementary:** other days in the ±3 window  

Date-range searches (`from_date`/`to_date`) and undated searches: no nearby section / no “Ver viajes cercanos”.

### Empty state (no exact trips)

Treat as empty when filtered search has **zero exact** trips (even if complementary exist).

UI:

- `loupe-car.svg`  
- Title: No encontramos resultados para tu búsqueda  
- Body: ¿Querés que te avisemos cuando se crea un viaje con este origen y destino?  
- Link CTA: Creá una alerta ahora. (logged-in; same `subscribeSearch`)  
- If date search **and** complementary trips exist and not yet revealed:

  ```
  o
  Ver viajes cercanos (+- 3 días)
  ```

  Tap → set `showNearbyTrips = true` and render nearby list below (heading + subtitle + cards). Do not re-fetch.

### With exact results

1. Render exact-day trip cards (keep friend/public split if present)  
2. After last exact card: alert block (mockup copy + Creá una alerta ahora.)  
3. If complementary trips exist: **Viajes cercanos** heading, subtitle = current `podesSubscribirte`/`resultadosCercanos` companion text as “subtitle we have now” — use existing nearby subtitle if one exists, else keep a short helper under the heading (i18n). Then complementary trip cards.  
4. Remove mid-list `isComplementary` heading injection; remove trailing duplicate alert after the full list.

### i18n

- New empty title / alert question / alert link / “o” / “Ver viajes cercanos (+- 3 días)” / “Viajes cercanos”  
- Update or alias `resultadosCercanos` → Viajes cercanos where used in this section  
- Keep Infancias / other unrelated copy unchanged  

## Out of scope

- Backend `strict` date mode  
- Changing fuzzy ±3 window  
- Search summary card redesign (already separate)
