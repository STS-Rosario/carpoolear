# Future trip card owner actions

**Date:** 2026-07-31  
**Branch:** `mobile-new-navigation-v2-redesign`  
**Repos:** `carpoolear` (legacy Vue frontend)

## Goal

On upcoming owner trip cards (`enableChangeSeats`), replace icon-only footer controls with labeled actions matching the product mock.

## Footer order (top → bottom)

1. **Ver detalle** — existing shell primary CTA (unchanged)
2. **Lugares libres** — i18n label above; `-` · count · `+` stepper (existing `changeSeatsNumber`)
3. **Editar viaje** — secondary button → `goToDetail(true)` / `update-trip`
4. **Chat grupal** — secondary button, only when `trip.group_chat_conversation_id` is set; navigate via conversations store `openTripGroupChat` → `conversation-chat`
5. **Cancelar viaje** — destructive text link → existing `deleteTrip` confirm flow

## Out of scope

- Past trip cards, search list cards, trip detail page
- Changing seat increment API rules

## Notes

- Remove eye / pencil / trash icon row
- Prefer `AppButton` secondary for Edit and Chat when practical
- Reuse `groupChatButton` i18n; add `lugaresLibres` for the seats label
