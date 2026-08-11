# Trip detail redesign (mobile) + public passenger first name

**Date:** 2026-08-01  
**Branch:** `mobile-new-navigation-v2-redesign`  
**Repos:** `carpoolear` (legacy Vue frontend) + `carpoolear_backend` (passenger payload)  
**Out of scope:** `carpoolear-nx`, desktop trip-detail restyle (defer), new CTA product rules, inventing `coordinarViaje`

## Problem

Trip detail (`Trip.vue` and child elements) does not match the mobile product mock: section order, labels (DETALLE / MENSAJE DEL CONDUCTOR / CONDICIONES / YA SE SUMARON), compact stats under date/time, CTA hierarchy, and a public “who already joined” list. Accepted passengers are today mostly owner-only and shown with full `name`. Frontend already splits names in some seat helpers; product wants **backend-provided first name** for the public passenger list.

## Goals

1. Restyle **mobile** trip detail (≤767px) to match the mock reading order and visual language (driver header → detalle → mensaje → condiciones → ya se sumaron → CTAs → map).
2. Keep existing **CTA visibility / business rules**; when both Enviar mensaje and Solicitar asiento show → mensaje **primary**, solicitar **secondary**.
3. Show **accepted passengers to everyone** with **first name only** from the API (avatar + first name; profile navigation as today where applicable).
4. Backend: expose accepted passengers to non-owner/non-participant viewers as a **reduced** payload including `first_name`; keep full passenger payloads for owner / accepted passenger / admin as today.
5. Leave **desktop** trip detail layout/behavior unchanged in this pass.

## Non-goals

- Desktop visual redesign of trip detail.
- Changing who can request a seat, message, leave, cancel, or manage passengers beyond display/CTA styling.
- Always showing both CTAs or adding a new coordinate-by-message product mode.
- Nx / new stack work.
- Replacing the Leaflet map implementation (only keep it at the end on mobile).

## Approach

**Trip-detail visual layer** on existing `Trip.vue` + elements (`TripDriver`, `TripLocation`, `TripDate`, `TripDescription`, `TripPrice` / prefs, `TripStats`, `TripPassengers` / equivalent public list, `TripButtons`, map). Prefer CSS + light markup (section titles, chip wrappers, mobile order) under a root class such as `trip-detail`. Desktop keeps the current composition.

**Backend passenger privacy:** in `TripTransformer` (and `TripUserTransformer` as needed), always include a public accepted-passenger summary for authenticated viewers; full `passenger` / request management fields remain gated as today.

## Architecture

```
Trip.vue (root.trip-detail)
  ├── TripDriver          — header
  ├── DETALLE             — route + date/time chips + TripStats (distance / duration / CO₂)
  ├── MENSAJE DEL CONDUCTOR — TripDescription (when present)
  ├── CONDICIONES         — price + trip prefs / seats extras as today
  ├── YA SE SUMARON       — accepted passengers (public first_name; owner actions when owner)
  ├── TripButtons         — existing rules; primary/secondary when both
  └── Map                 — existing Leaflet block last
```

Backend:

```
TripTransformer
  ├── owner / accepted passenger / admin → full passenger[] via TripUserTransformer (+ first_name)
  └── other authenticated viewers → same passenger[] key with reduced objects only:
        id, image, first_name (no full name / email / private fields)
```

## Mobile layout (top → bottom)

1. **Driver header** — avatar, name + badges, thumbs ratings, viajes count; align with trip-card / profile tokens where practical.
2. **DETALLE** — section label; origin → destination (punto de partida / llegada language if already used on cards); date chip + time chip; under them compact **distance · duration · CO₂** from existing `TripStats` data.
3. **MENSAJE DEL CONDUCTOR** — section label + description body; omit the whole section when description is empty.
4. **CONDICIONES** — section label; price and preference rows (smoking, pets, seats, etc.) as currently available on the trip.
5. **YA SE SUMARON** — section label; list accepted passengers when count > 0. Each row: avatar + **`first_name`** (not client-split `name`). Owner keeps chat / remove (and related) controls. Non-owners: display only (tap avatar/name → profile if that already works for passenger ids). Omit section when there are no accepted passengers.
6. **CTAs** — `TripButtons` rules unchanged; style hierarchy when both visible as above.
7. **Map** — existing route map at the bottom.

Owner-only tools that already exist (pending requests, matching, share, etc.) may remain on the page but must not reorder the primary reading stack above on mobile.

## Backend: `first_name`

- Add `first_name` to trip user / passenger payloads used by trip detail.
- Derive server-side from stored full `name`: trim, then first whitespace-separated token (same rule as frontend `extractFirstName`). Empty / missing user → safe placeholder consistent with existing missing-user handling (e.g. empty string or existing “Usuario ya no existe” display rules without inventing a full name).
- **Public viewers:** return accepted passengers with at least `id`, `image`, `first_name`. Do **not** expose full `name`, email, or other private trip-user fields on that path.
- **Privileged viewers** (owner, accepted passenger, admin): keep today’s full passenger objects **and** include `first_name` so the UI can use one field for labels.
- Do not require frontend to split `name` for the YA SE SUMARON list.

## Frontend behavior

- Scope mobile styles under the trip-detail root; do not break desktop layout.
- Wire YA SE SUMARON to the public/reduced passenger list for non-owners; owners continue to use full passenger data for management actions while displaying `first_name` in that section.
- Prefer backend `first_name` for this section even if seat-card helpers still split locally elsewhere (align those helpers later only if needed for consistency).

## Responsive behavior

| Surface | Behavior |
|---------|----------|
| Mobile (≤767px) | New section order, labels, CTA hierarchy, map last |
| Desktop | Unchanged composition and chrome |

## Testing

**Backend**

- Transformer: privileged viewer still gets full passenger payload + `first_name`.
- Transformer: other authenticated viewer gets reduced accepted list with `first_name`, without full `name` / email.
- Unit coverage for first-token derivation (multi-word names, empty, missing user).

**Frontend**

- Mobile section order / labels under trip-detail scope.
- CTA primary/secondary when both buttons are shown.
- YA SE SUMARON uses `first_name`; visible for non-owner when accepted passengers exist; omitted when empty.
- Desktop trip detail smoke: no intentional layout regression from this pass.

## Acceptance criteria

1. On mobile, trip detail matches the mock section order and labels described above.
2. CTA business rules unchanged; when both show, mensaje is primary and solicitar is secondary.
3. Accepted passengers visible to everyone with backend `first_name` only in that list; owner management actions preserved.
4. Non-privileged API responses do not leak full passenger `name` / email for that public list.
5. Desktop trip detail remains functionally/visually as today aside from shared API field additions.
6. Map remains at the end on mobile.
