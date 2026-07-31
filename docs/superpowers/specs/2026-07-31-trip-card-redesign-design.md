# Trip card redesign (unified mobile + desktop)

**Date:** 2026-07-31  
**Branch:** `mobile-new-navigation-v2-redesign`  
**Repos:** `carpoolear` (legacy Vue frontend)  
**Out of scope:** `carpoolear-nx`, backend API changes

## Problem

Trip list cards (`Trip.vue`) use an older panel layout with theme forks (`trip_card_design` light vs default), show ratings as a total count (or optional stars), and omit clear origin/destination labels. Ongoing trips use a separate visual language in `OngoingTripCard.vue`. Product wants one card look for mobile and desktop, matching the provided mockups, with thumbs ratings and explicit departure/arrival labels.

## Goals

1. One shared trip card visual for mobile and desktop.
2. Ratings as thumbs up / neutral / thumbs down via existing `UserRatingsCounts` (not smileys, not stars on the card).
3. Show **Punto de partida** and **Punto de llegada** above origin/destination city + region.
4. Click rules: avatar, name, and ratings → profile; rest of card including **Ver detalle** → trip detail (or existing modal when `clickModal`).
5. Apply the same shell to list cards and OngoingTripCard (ongoing keeps its heading + live-share action).

## Non-goals

- Redesigning trip detail page, create-trip form, or search filters.
- Changing seat-request / sellado / visibility business rules (they remain as Trip-only extras).
- Backend payload changes.
- Nx / new stack work.
- Keeping the light vs default `trip_card_design` layout fork on cards (config may still exist elsewhere; cards ignore it).

## Approach

**Shared presentational shell** (`TripCardShell.vue` + `trip-card.css`): both `Trip.vue` and `OngoingTripCard.vue` compose it. Trip-only concerns stay as slots/props on the list consumer.

## Architecture

```
Trip.vue / OngoingTripCard.vue
  └── TripCardShell
        ├── header: avatar + UserNameWithBadge + UserRatingsCounts + trips count | seats pill
        ├── body: route (punto de partida/llegada + cities) + date/time chips
        ├── footer: Ver detalle CTA
        └── slots: #actions-extra (ongoing share), #footer-extra / #badge (Trip sellado, seat controls, etc.)
```

### Layout (top → bottom)

1. **Header**
   - Left: circular avatar, `UserNameWithBadge`, row with `UserRatingsCounts` + `|` + `{count} viajes` (`perfilViajesParticipados`).
   - Right: seats availability pill (`N lugar` / `N lugares`), color by remaining seats (see below).
2. **Body**
   - Left: vertical route graphic (hollow origin circle → line → solid destination dot).
   - Origin block: label `$t('puntoDePartida')`, city (bold), province/region (muted).
   - Destination block: label `$t('puntoDeLlegada')`, city (bold), province/region (muted).
   - Right: date chip + time chip (calendar / clock icons; format like mockup e.g. `Dom, 14 Dic` and `16:30 hs`).
3. **Footer**
   - Full-width primary button **Ver detalle** (`$t('verDetalle')`).
   - Optional slot above/beside for ongoing live-share link.

Same structure at all breakpoints; spacing may tighten on narrow widths, but no alternate card component.

### Click targets

| Target | Action | Notes |
|--------|--------|--------|
| Avatar, driver name, ratings row | Profile | `@click.stop` → existing profile navigation |
| Card surface (non-profile areas) | Trip detail or modal | Preserve `clickModal` / `goToDetail` behavior in `Trip.vue` |
| Ver detalle | Trip detail or modal | Same destination as card surface; `@click.stop` only if needed to avoid double handlers |
| Ongoing live-share link | Live share route | Existing behavior; does not go to profile |

When trip has no driver user (edge cases), hide driver block or degrade gracefully; card still navigates to trip.

### Seats pill

Reuse existing seat counts from `trip.seats_available`.

| Seats | Label | Visual tone (mockup) |
|-------|--------|----------------------|
| `0` | Existing “Carpooleado” / full treatment | Filled / unavailable state (no green “lugares” pill) |
| `1` | `$t('Lugar')` singular phrasing → e.g. `1 lugar` | Warm/red tint |
| `2` | `N lugares` | Orange tint |
| `≥ 3` | `N lugares` | Green tint |

Exact copy should prefer existing i18n keys (`Lugar` / `Lugares` / `libre` / `libres` / `Carpooleado`) composed into a short pill string; add a small helper or computed if needed rather than hardcoding Spanish in the template.

### Ratings and trips count

- Always use `UserRatingsCounts` with `{ positive, neutral, negative }` from `trip.user` (same shape as OngoingTripCard today).
- Do **not** render `trip_stars` / star SVGs on the card.
- Show trips count when `trips_count` is available via `normalizeTripsCount` + `perfilViajesParticipados`.

### Locations

- Prefer existing helpers (`getLocationName` / `getStateName` or shared `getTripLocationLabels`) so list and ongoing stay consistent.
- Always show `puntoDePartida` / `puntoDeLlegada` labels when there is an origin/destination to show.
- Fallback to `from_town` / `to_town` when points are missing (same as today).

### Date / time

- Prefer `trip.trip_date` with dayjs formatting aligned to mockup chips.
- Weekly-schedule-only trips: keep a compact readonly schedule representation in the chips area (no revival of the old light-theme date column).

## Consumers

### `Trip.vue`

- Replace current panel markup theme forks with `TripCardShell`.
- Keep: sellado pending affordance, seat-change controls (`enableChangeSeats`), visibility tooltips if still required (slot or compact icon in header), modal/`clickModal`, grid column classes (`tripCardCountClass`).
- Remove card-level dependency on `tripCardTheme === 'light'` for layout.

### `OngoingTripCard.vue`

- Keep section heading `viajeEnProgreso`.
- Compose `TripCardShell` with locations, ratings, trips count, date/time, Ver detalle.
- Put live-share control in the shell’s extra-actions slot.
- Drop the divergent pink/red card layout in favor of the shared shell; optional thin “ongoing” accent is allowed only if it does not fork the structure.

## Styling

- New `src/styles/components/trip-card.css` imported from `main.css`.
- Prefer design tokens already used in the auth/home redesign (`--ds-*`) for borders, radius, primary button, text colors.
- Avoid duplicating large `.card-trip` rules into three legacy CSS bundles when a dedicated component stylesheet can own the new look; leave unused legacy `.card-trip` rules in place only if other screens still depend on them, otherwise trim carefully in a follow-up if needed.

## Testing (TDD)

Follow repo TDD commit style (`test` → `feat`/`fix` → `refactor` as applicable).

Minimum coverage:

1. **`TripCardShell` view/style tests** — markup contains `UserRatingsCounts`, `puntoDePartida`, `puntoDeLlegada`, `verDetalle`; profile vs trip click hooks are wired (or documented via emitted events / callbacks props).
2. **`Trip.view.test.js`** — list card uses shell; no light-theme-only date column fork; ratings use thumbs component.
3. **`OngoingTripCard.view.test.js`** — uses shell; still exposes live-share when applicable; Ver detalle remains.
4. Style tests asserting seats pill modifiers and route label classes exist in `trip-card.css`.

## Success criteria

- Mobile and desktop trip lists show the same card structure.
- Ratings show thumbs up / neutral / down counts.
- Origin and destination show punto de partida / llegada labels.
- Profile vs trip navigation matches the click matrix above.
- Ongoing trip card shares the shell and still supports live location share + Ver detalle.
