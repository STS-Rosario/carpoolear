# Trip success + trip detail actions polish

**Date:** 2026-08-01  
**Branch:** `mobile-new-navigation-v2-redesign`  
**Repos:** `carpoolear` (legacy Vue frontend)  
**Out of scope:** `carpoolear-nx`, backend API changes, invite/share business logic

## Problem

After creating a trip, the success screen shows trip actions in a horizontal wrap with **Compartir viaje** as the only primary CTA, while product wants **Ver viaje** and **Invitar a amigos** as primaries, secondary share/return/template actions stacked in a column, clearer icons, and stronger invite prompt typography. Friend invite checkboxes (and labels) currently read teal; product wants dark grey checkboxes app-wide. On trip detail, owner **Editar viaje** / **Cancelar viaje** still sit side-by-side on wider viewports and should stack in a column.

## Goals

1. Trip creation success actions in a vertical column with the agreed hierarchy and icons.
2. Invite prompt stronger; invite CTA primary; Cerrar secondary.
3. Native checkboxes (and their accompanying labels where they inherit accent/teal) dark grey app-wide.
4. Trip detail owner Edit / Cancel stacked: Edit above Cancel at all breakpoints.

## Non-goals

- Changing share, invite, return-trip, or template save behavior.
- Migrating success actions to `AppButton` (keep existing `btn` classes unless already using AppButton).
- Redesigning the rest of trip detail beyond owner Edit/Cancel stacking.
- Backend or i18n copy changes (icons/layout/variants only).

## Approach

Scoped markup + CSS in the existing components, plus a small shared checkbox color rule in app styles.

## Surfaces

### 1. Trip creation success (`TripCreationSuccess.vue`)

Action stack (column, full-width buttons, top → bottom):

| Order | Action | Variant | Icon |
| --- | --- | --- | --- |
| 1 | Ver viaje | primary (`btn-primary`) | none |
| 2 | Compartir viaje | secondary (`btn-default`) | `fa-share-alt` (existing) |
| 3 | Cargar viaje de regreso | secondary | back (`fa-arrow-left` or equivalent existing back affordance) |
| 4 | Guardar viaje como plantilla | secondary | bookmark (`fa-bookmark`) |

Keep existing visibility rules (return only for driver non-parent trips; template when `canSaveTemplate`). Keep the share prompt text above the stack.

Layout: `.trip-creation-success__actions` becomes `flex-direction: column` (no horizontal wrap row). Buttons stretch to a consistent width (centered column, max-width aligned with invite block ~500px).

### 2. Invite friends (`TripInviteFriends.vue`)

- **¿Querés invitar a tus amigos a este viaje?** — bold and larger than body (e.g. ~1.125–1.25rem, `font-weight: 700`).
- **Invitar a amigos** — primary (already).
- **Cerrar** — secondary (`btn-default`, already).

No change to invite-all / friend selection logic or close behavior.

### 3. App-wide checkboxes

In shared CSS (`base.css` and the generated/theme sibling `main.carpoolear.css` if that file is the live theme source of truth for the same rule):

- Native `input[type="checkbox"]`: dark grey control color via `accent-color` (and label color where checkboxes sit in teal-tinted parents, scoped so body text elsewhere is untouched).
- Target color: dark grey (~`#555` / `#555555`, matching existing muted greys in the design system).
- Applies everywhere native checkboxes appear (invite friends, forms, wizard, etc.).
- Custom `.checkbox-box` UI (wizard lucrar, etc.) is out of this pass unless it still renders teal from the same accent; if those stay teal, leave them — only native inputs are required.

### 4. Trip detail owner actions (`TripButtons.vue`)

- Keep **Editar viaje** primary + **Cancelar viaje** tertiary destructive.
- Force `.buttons-container` (or a dedicated owner-actions wrapper) to a column layout at all breakpoints so Cancel sits below Edit.
- Remove desktop side-by-side spacing that places Cancel next to Edit (`margin-right` on first button at `min-width: 768px` that enables horizontal pairing).
- Other CTAs in the same container (message, request, live share, group chat) remain in the same vertical stack.

## Testing

- Update `TripCreationSuccess.view.test.js`: column actions, primary Ver viaje, secondary share/return/template, bookmark + back icons.
- Update `TripInviteFriends.view.test.js`: prompt typography classes/styles; Invitar primary / Cerrar secondary unchanged.
- Update `TripButtons.view.test.js`: column stacking for Edit/Cancel (no desktop horizontal pairing).
- Source/style assertion for app-wide checkbox grey if covered by existing CSS view tests; otherwise a small style regression check in the success/invite tests is enough for the invite surface plus a shared CSS string assert.

## Acceptance

- Success screen: four actions (when visible) in a column; Ver viaje primary; Compartir + Regreso + Guardar secondary; Regreso has back icon; Guardar has bookmark; Invitar primary; Cerrar secondary; invite prompt bold + larger.
- Trip detail owner: Cancelar below Editar on mobile and desktop.
- Native checkboxes app-wide use dark grey accent (not teal).
