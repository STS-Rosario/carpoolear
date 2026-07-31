# Public profile redesign (mobile + desktop)

**Date:** 2026-07-31  
**Branch:** `mobile-new-navigation-v2-redesign`  
**Repos:** `carpoolear` (legacy Vue frontend)  
**Out of scope:** `carpoolear-nx`, backend API changes, “Viajes juntos”

## Problem

Public profile (`Profile.vue` and related sections) does not match the product mockups. Tab chrome differs by context (sliding 100px indicator for other users, caret on mobile, settings underline for own profile). Header, Perfil content, ratings list, and Viajes cards need a single visual language on mobile and desktop while keeping existing data, actions, tab labels, and tab order.

## Goals

1. Restyle public profile for **both** other users’ profiles and own public profile (`/profile/me` / `/profile/:id` when viewing self).
2. Keep tab **order and labels**: **Viajes → Perfil → Calificaciones**.
3. Tab chrome: full-width **grey horizontal baseline** under all tabs; **wider blue underline** on the active tab (no mobile caret, no sliding 100px bar).
4. Keep **thumbs** for ratings (header counts and rating list items) — no smileys.
5. Match mock layout for header, Perfil, Calificaciones, and Viajes on mobile and desktop.
6. No breadcrumb (`Resumen > Ver perfil público`). No “Viajes juntos” UI.

## Non-goals

- Renaming Perfil → Info or reordering tabs.
- Adding “Viajes juntos” or shared-trip counts.
- Account settings screens outside the public-profile route (e.g. MyAccount edit flows), except where they share tab CSS that must be scoped carefully.
- Backend payload or rating business-rule changes.
- Nx / new stack work.

## Approach

**Profile-scoped visual layer** on existing components (`Profile.vue`, `ProfileInfo`, `ProfileRates`, `ProfileTrip` / own Viajes consumer, `Tabset`, `UserRatingsCounts`, filter chips, trip rows). Prefer CSS + light markup tweaks over replacing page components. Scope selectors under a profile root class so account/settings tabs elsewhere are not broken.

## Architecture

```
Profile.vue
  ├── identity header (avatar, name, verified, member + thumbs + viajes)
  ├── Tabset (Viajes | Perfil | Calificaciones)
  │     grey baseline + wider blue active underline
  ├── Viajes → ProfileTrip / MyTrips (filters + trip cards)
  ├── Perfil → ProfileInfo (bio, identity, response, privacy)
  └── Calificaciones → ProfileRates (filters + rating rows)
```

## Shell and navigation

### Header

- **Mobile:** back affordance + title framing as today if present; centered avatar; name; verified pill; one stats row: membership · thumbs counts · `|` · viajes count.
- **Desktop:** light grey page background; white rounded **profile header card** with avatar left, name + verified badge, then thumbs + viajes stats. No breadcrumb.
- Ratings in the header stay **thumbs** via existing `UserRatingsCounts`.

### Tabs

- Labels/order unchanged: Viajes, Perfil, Calificaciones.
- Full-width grey `border-bottom` baseline across the tab row.
- Active tab: thicker/wider blue underline sitting on that baseline (wider than label text where the mock shows it; equal-width flex tabs acceptable if that yields a clear blue bar).
- Remove mobile caret (`a.active::after` triangle) and other-user sliding `::after` 100px indicator for this profile context.

## Tab content

### Perfil (`ProfileInfo`)

- Section label for bio (e.g. “Sobre mí”); bio paragraph.
- **Mobile:** identity verified + message response as stacked icon rows with thin dividers; privacy note as light-blue rounded callout.
- **Desktop:** bio above; identity + response as **side-by-side bordered tiles**.
- Keep existing friend actions / trip alerts if already present; style to not fight the new shell.

### Calificaciones (`ProfileRates`)

- Filter chips: Todas / Positivas / Neutras / Negativas with counts; selected = blue fill + check.
- Rows: thumb icon, reviewer name, route + date, comment; thin dividers.
- Same language on mobile and desktop.

### Viajes (`ProfileTrip` / own trips tab)

- Filter chips: Todos / Conductor / Pasajero with counts; selected state as above.
- Cards: role label (Conductor/Pasajero), route timeline (origin → destination), date/time chips; rounded bordered cards matching the mock.
- Prefer aligning with existing trip-card visual tokens where practical without pulling full search-list `TripCardShell` if profile trips are a different data shape.

## Responsive behavior

| Surface | Layout |
|---------|--------|
| Mobile | Edge-to-edge white; centered identity; stacked Perfil rows; chip filters; list/cards below tabs |
| Desktop | Grey canvas; white header card; white content card with tabs; Perfil tiles in a row |

## Testing

- Unit/source tests for profile tab underline rules (grey baseline + blue active; no caret/sliding bar in profile scope).
- Assert thumbs remain (no smileys) in header and rating items.
- Assert no breadcrumb / no Viajes juntos markup introduced.
- Visual check mobile + desktop for self and other-user profiles.

## Acceptance criteria

1. Viewing another user’s profile and own public profile both match the mock visual language.
2. Tabs remain Viajes → Perfil → Calificaciones with grey baseline + wider blue active underline.
3. Ratings use thumbs only.
4. No breadcrumb; no Viajes juntos.
5. Perfil / Calificaciones / Viajes content layout matches the described mobile and desktop patterns.
