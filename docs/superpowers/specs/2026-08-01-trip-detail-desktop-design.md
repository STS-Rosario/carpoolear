# Trip detail redesign (desktop)

**Date:** 2026-08-01  
**Branch:** `mobile-new-navigation-v2-redesign`  
**Repos:** `carpoolear` (legacy Vue frontend)  
**Out of scope:** `carpoolear-nx`, backend API changes, new CTA product rules, mobile stack changes beyond shared markup needed for desktop columns

## Problem

Mobile trip detail already uses the redesigned linear stack (`.trip-detail__stack` under `.trip-detail--mobile`). Desktop still renders the legacy multi-column tree (`v-if="!isMobile"`) with `TripLocation` / `TripDate` / sidebar driver chrome. Product wants desktop to follow the same visual language as mobile, laid out in a single card with two-column bands where useful.

## Goals

1. Restyle **desktop** trip detail (≥768px) to match the approved card layout below.
2. Reuse mobile building blocks (`TripDriver` grey band, `TripDetailRoute`, `TripStats`, `TripData`, `TripPrice`, `TripPassengers`, `TripButtons`, map) rather than restyling the old column tree.
3. Keep existing **CTA visibility / business rules** (owner Editar/Cancelar, passenger mensaje/solicitar hierarchy unchanged).
4. Leave **mobile** reading order and behavior intact aside from shared wrappers that remain single-column ≤767px.

## Non-goals

- Changing who can request a seat, message, leave, cancel, or manage passengers.
- Backend / passenger `first_name` work (already shipped for mobile).
- Nx / new stack work.
- Inventing new map behavior (keep existing Leaflet; place it inside the card).

## Approach

**Extend the mobile stack for desktop (recommended).** One shared stack in `Trip.vue`; desktop adds a card shell and CSS grid wrappers for two-column rows. Prefer light markup wrappers + `trip-detail.css` under `.trip-detail--desktop` (or `@media (min-width: 768px)` on `.trip-detail`). Remove or stop rendering the legacy desktop column tree once the new stack is shown for both breakpoints.

## Architecture

```
Trip.vue
  └── .trip-detail.trip-detail--card (desktop)
        └── .trip-detail__stack
              ├── TripDriver (grey band)
              ├── DETALLE — two columns
              │     ├── left: TripDetailRoute (origin, dest, date, time)
              │     └── right: TripStats + TripData (condiciones, no price)
              ├── MENSAJE DEL CONDUCTOR (if description)
              ├── seats | passengers — two columns
              │     ├── left: lugares libres (TripSeats or equivalent)
              │     └── right: Ya se sumaron (TripPassengers)
              ├── contribution | CTAs — two columns
              │     ├── left: TripPrice (contribución)
              │     └── right: TripButtons
              └── Map (inside card)
```

## Desktop layout (top → bottom)

All of the following live **inside one card** (white surface, shared `--ds-card-*` tokens: radius, shadow, background).

1. **Driver band** — Same content/visual language as mobile driver header; **grey background** full width of the card (top corners follow card radius).
2. **DETALLE** — Section title. Two columns:
   - **Left:** origin, destination, date, time (`TripDetailRoute`).
   - **Right:** distance, duration, CO₂ (`TripStats`) and **condiciones** preferences (`TripData`) — **without price**.
3. **MENSAJE DEL CONDUCTOR** — Section title + description body; omit entire section when empty.
4. **Lugares libres | Ya se sumaron** — Two columns:
   - **Left:** free seats / `TripSeats` (or the existing seats-available presentation used on trip detail).
   - **Right:** accepted passengers list (`TripPassengers` / `first_name` as on mobile). Omit passengers column content when empty; keep layout sensible when only seats show.
5. **Contribución | CTAs** — Two columns:
   - **Left:** contribution / price (`TripPrice`).
   - **Right:** `TripButtons` (Enviar mensaje / Solicitar asiento for passengers; owner actions per existing rules).
6. **Map** — Existing Leaflet map **inside** the card as the last block.

## Mobile relationship

| Surface | Behavior |
|---------|----------|
| Mobile (≤767px) | Keep current single-column stack order (driver → detalle → mensaje → condiciones with price → ya se sumaron → CTAs → map). Do not force desktop two-column bands. |
| Desktop (≥768px) | Card + column layout above. |

Shared components may gain optional wrappers/classes; desktop-only grids activate at `min-width: 768px`.

## Frontend behavior

- Scope desktop chrome under trip-detail root; do not regress mobile.
- Condiciones on desktop detalle row exclude price; price only in the contribución column.
- CTA business rules unchanged.
- Owner-only tools that already exist (pending requests, matching, share, etc.) may remain on the page but must not break the primary card reading order above.
- Replace the legacy `v-if="!isMobile"` column tree with the shared stack once desktop styles land.

## Testing

- Style/source tests: desktop card shell, detalle two-column split, seats|passengers row before contribution|CTAs, map inside card.
- Trip.vue: desktop uses stack (not old `TripLocation`/`columnComponent` primary path).
- Smoke: mobile stack order unchanged.
- Manual: desktop ≥768 and mobile ≤767 passenger + owner views.

## Acceptance criteria

1. Desktop trip detail is a single card with grey driver band at the top.
2. DETALLE is two columns: route/schedule left; stats + condiciones (no price) right.
3. Mensaje del conductor appears below DETALLE when present.
4. Lugares libres | Ya se sumaron sits above contribución | CTAs.
5. Contribución left, CTAs right.
6. Map is the last block inside the card.
7. Mobile layout/order remains the existing redesign.
8. CTA visibility rules unchanged.
