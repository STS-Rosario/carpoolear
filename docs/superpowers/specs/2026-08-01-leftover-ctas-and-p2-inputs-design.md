# Leftover CTAs and P2 inputs

**Date:** 2026-08-01  
**Status:** Approved

## Goal

Finish user-facing redesign leftovers: migrate remaining Bootstrap primary/default CTAs to `AppButton`, and remaining P2 text/file fields off `form-control`.

## Slice 1 — Buttons

| Surface | Change |
| --- | --- |
| `TicketDetail.vue` | Responder → primary AppButton; Cerrar ticket → secondary |
| `ConversationList.vue` | Más resultados → primary AppButton block |
| `Notifications.vue` | Siguiente → primary AppButton |
| `TripSeats.vue` | Invitar amigos (both branches) → primary AppButton; keep disabled + tooltip |

No click-handler or pagination behavior changes.

## Slice 2 — Inputs

| Surface | Change |
| --- | --- |
| `ConversationList.vue` | Search → AppInput + icon/search AppButton; keep debounce / onSearchUser |
| `LiveLocationShare.vue` | Share URL → readonly AppInput |
| `ManualIdentityValidation.vue` | File inputs → AppField + non-form-control file class (TicketNew pattern); keep refs/required |

## Out of scope

Toast UI editors, admin forms, DatePicker internals, new file-upload component.

## Success

No `btn btn-primary` / `btn btn-default` on listed CTAs; no `form-control` on listed inputs/files.
