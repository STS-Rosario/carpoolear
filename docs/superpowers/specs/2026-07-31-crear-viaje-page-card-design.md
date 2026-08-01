# Crear viaje page card shell

**Date:** 2026-07-31  
**Branch:** `mobile-new-navigation-v2-redesign`  
**Repos:** `carpoolear` (legacy Vue frontend)  
**Out of scope:** `carpoolear-nx`, field-by-field AppInput migration, map/layout redesign, backend changes

## Problem

Crear viaje / Editar viaje still uses the legacy shadowed `.form` look, has no consistent in-page heading, and on mobile pins Crear + “Cargar viaje de regreso” in a fixed footer that fights the bottom nav and form scroll.

## Goals

1. Wrap the page in the shared white content card with an in-card heading (`crearViaje` / `editarViaje` when updating).
2. Neutralize the inner `.form` / `.form-trip` card chrome (no nested shadow/padding card).
3. On mobile, keep return checkbox + create/update button at the **end of the form** in normal flow (not `position: fixed`).
4. Same treatment for create and edit (`NewTrip.vue`).

## Non-goals

- Migrating inputs/selects to AppInput / AppButton in this pass.
- Changing trip validation, maps, or preference UI.

## Approach

- Markup: `new-trip-page__card` + `new-trip-page__heading` around existing content (modals stay outside the card).
- CSS: card tokens matching other settings pages; `.new-trip-component .form` transparent / no shadow / padding 0.
- Mobile footer: drop fixed positioning and the extra form `padding-bottom` reserved for it; keep the same controls.
- Remove the light-theme-only desktop `title--desktop` h2 in favor of the page heading.
