# Future trip card owner actions — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (or implement in-session with TDD). Steps use `test`/`feat` commits.

**Goal:** Redesign `#footer-extra` on `Trip.vue` when `enableChangeSeats` for upcoming owner trips.

**Spec:** `docs/superpowers/specs/2026-07-31-future-trip-card-actions-design.md`

## Files

- `src/components/sections/Trip.vue` — footer markup, styles, group-chat navigation
- `src/components/sections/Trip.view.test.js` — source contract tests
- `src/language/i18n.js` — `lugaresLibres` (arg + en)
- Optionally `src/styles/components/trip-card.css` if shared styles fit better than scoped

## Task 1: RED — footer contract tests

Assert `#footer-extra` contains:
- `lugaresLibres` label + seats control classes
- `editarViaje` AppButton/button text
- `groupChatButton` gated on `group_chat_conversation_id`
- `cancelarViaje` link calling `deleteTrip`
- no `fa-eye` / `fa-pencil` / `fa-trash` in footer-extra
- order: seats → edit → group chat → cancel (after shell Ver detalle)

## Task 2: GREEN — implement footer + i18n + styles

Replace icon row with stacked actions; wire `openTripGroupChat`.

## Task 3: Verify

Unit tests + DevTools on `/profile/me` Viajes upcoming card.
