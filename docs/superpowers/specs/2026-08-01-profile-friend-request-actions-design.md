# Profile friend-request actions redesign

**Date:** 2026-08-01  
**Branch:** `mobile-new-navigation-v2-redesign`  
**Repos:** `carpoolear` (legacy Vue frontend)  
**Out of scope:** `carpoolear-nx`, friends search (`FriendsRequest.vue`), backend API changes

## Problem

On another user’s public profile:

1. **Outgoing request (`pending_sent`)** shows a disabled primary button with “Su solicitud ya fue enviada…”, which looks inactive and offers no way to cancel.
2. **Incoming request (`pending_received`)** shows legacy **Aceptar / Rechazar** buttons at the bottom of the Perfil tab, disconnected from the rest of the friends UI language (home cream banners + friends-settings action pattern).

## Goals

1. While sending an invite: show **Enviando solicitud** on the invite button (loading/disabled).
2. After an outgoing request is sent: replace the static message with a delete-style button **Cancelar solicitud de amistad** that cancels via existing `cancelRequest` and returns state to `none`.
3. For an incoming request: remove bottom Perfil accept/reject buttons; show a cream **home-prompt-banner** card **above the tabs** (under the identity header) with text **Solicitud de amistad pendiente** and inline Rechazar / Aceptar actions.
4. Keep existing friends store APIs (`request`, `accept`, `reject`, `cancelRequest`) and profile `friendship_state` updates.

## Non-goals

- Changing friends search / “Agregar” row UI.
- Changing friends settings lists (`IncomingFriendRequestCard` layout), except reusing the same action button variants.
- Backend or friendship state machine changes.
- Nx / new stack work.

## Approach

**Profile-scoped UI only** in `Profile.vue` + `ProfileInfo.vue`, using existing `AppButton` variants and `home-prompt-banner` styles. Wire cancel through `useFriendsStore.cancelRequest` the same way accept/reject already use the store.

## Architecture

```
Profile.vue
  ├── ProfileIdentityHeader
  ├── [NEW] pending_received banner (above tabs)
  │     home-prompt-banner shell
  │     + Rechazar (tertiary destructive) + Aceptar (primary)
  └── Tabset (Viajes | Perfil | Calificaciones)
        └── ProfileInfo friend actions
              none → Invitar (primary; label Enviando solicitud while loading)
              pending_sent → Cancelar solicitud de amistad (danger)
              pending_received → (no bottom buttons; banner owns actions)
              friend → Enviar mensaje / trip alerts (unchanged)
```

## UI details

### Incoming banner (`pending_received`)

- **Placement:** `Profile.vue`, directly under identity header, above tabset. Visible on all tabs.
- **Shell:** `home-prompt-banner` (cream `#fff5e6`, brown border) — same family as home pending-friends card; **not** a link.
- **Left:** `fa-user-plus` icon + title **Solicitud de amistad pendiente** (new i18n key, ES + EN).
- **Right:** actions matching friends settings:
  - **Rechazar** — `AppButton` `variant="tertiary"` `tone="destructive"` `icon-right="fa fa-times"`
  - **Aceptar** — `AppButton` `variant="primary"` `icon-right="fa fa-check"`
- Loading: disable both while `friendActionLoading`; Aceptar may show loading label if already used elsewhere.
- On success: update `profile.friendship_state` (`friend` / `none`) so the banner disappears.

### Outgoing invite (`none` → `pending_sent`)

- **Invitar a amigos** stays primary; while `friendActionLoading` and state is still `none`, button label is **Enviando solicitud** (disabled/loading).
- After success (`pending_sent`): single **Cancelar solicitud de amistad** button, `AppButton` `variant="danger"`, calls `cancelRequest(profile.id)`, then set state to `none`.
- Remove disabled primary + `suSolicitudAmistadEnviada` copy from this surface (key may remain in i18n if used elsewhere).

### Unchanged

- Friend state actions when already friends (message + trip alerts).
- Admin message shortcut.
- Friends settings / home banners.

## Testing

- Source/unit tests in `ProfileInfo.view.test.js` / `Profile.view.test.js` (or equivalent):
  - `pending_sent` uses danger cancel label + `cancelRequest` wiring.
  - Invite loading uses **Enviando solicitud**.
  - `pending_received` banner markup lives in `Profile.vue` above tabs; ProfileInfo no longer renders accept/reject for that state.
  - i18n keys for new Spanish/English strings.
- Manual: send invite → see Enviando → Cancelar; cancel restores Invitar; open profile of sender → banner above tabs accept/reject.

## Acceptance criteria

1. Sending invite shows **Enviando solicitud**, then **Cancelar solicitud de amistad** (danger) which cancels the request.
2. Incoming request shows cream banner above tabs with **Solicitud de amistad pendiente** + Rechazar/Aceptar; no bottom Perfil accept/reject pair.
3. Friendship state updates correctly without page reload.
4. Friends search UI unchanged.
