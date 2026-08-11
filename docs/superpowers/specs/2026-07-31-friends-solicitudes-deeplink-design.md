# Friends Solicitudes deep link (query params)

**Date:** 2026-07-31  
**Branch:** `mobile-new-navigation-v2-redesign`  
**Repos:** `carpoolear` (legacy Vue frontend)  
**Out of scope:** `carpoolear-nx`, backend API changes, nested friends routes, Enviadas deep links, home card UI redesign

## Problem

Home’s pending friend requests card and notifications of type `friends` navigate to `friends_setting`, but Mis amigos restores the last remembered tab (often **Amigos**). Users with incoming requests do not land on **Solicitudes → Recibidas**.

## Goals

1. Support a stable link to Solicitudes + Recibidas via query params on the existing route.
2. Use that link from the home pending-friend card and from notifications `friends` navigation.
3. Query overrides session `rememberTab` for that visit when `tab=solicitudes` is present.

## Non-goals

- Nested route `/setting/friends/solicitudes`.
- Deep-linking Enviadas or writing every tab/chip change back to the URL.
- Changing pending-request card copy or layout.

## Approach

**Query params on `friends_setting`:**

```js
{ name: 'friends_setting', query: { tab: 'solicitudes', filter: 'recibidas' } }
```

`FriendsSetting` applies these on mount / when the query changes:

| Query | Behavior |
| --- | --- |
| `tab=solicitudes` | Activate Solicitudes tab (index 1); update tabset session memory |
| `filter=recibidas` | Set `requestsFilter` to `recibidas` |
| Missing / unknown | Keep current behavior (`rememberTab` + Recibidas default) |

## Call sites

- `PendingFriendRequestsCard.vue` — home card link
- `Notifications.vue` — `extras.type === 'friends'`

## Testing

- View/source tests assert the query shape on call sites and that `FriendsSetting` reads/applies `tab` + `filter`.
