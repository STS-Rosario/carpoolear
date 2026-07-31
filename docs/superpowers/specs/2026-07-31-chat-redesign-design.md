# Chat redesign (list + thread, mobile + desktop)

**Date:** 2026-07-31  
**Branch:** `mobile-new-navigation-v2-redesign`  
**Repos:** `carpoolear` (legacy Vue frontend)  
**Out of scope:** `carpoolear-nx`, backend API changes

## Problem

Conversation list and chat thread (`ConversationList.vue`, `ConversationChat.vue`, `MessageView.vue`, related elements) do not match product mockups. There are no Todos / Grupales / Individuales filters. List rows, selection, bubbles, and headers look dated; group vs 1:1 headers differ in structure but share no cohesive visual language. Filter chips already exist on profile Calificaciones/Viajes and should be reusable.

## Goals

1. Restyle **conversation list** and **message thread** for **desktop and mobile** in one pass.
2. Desktop thread should match the group-chat mock visual language; apply the same bubble/composer/header styling language to **1:1** chats.
3. **1:1 must keep existing information and actions** (user link, verified name, ratings thumbs, last connection, CoordinateTrip / warnings / seat coordination, etc.) — restyle only.
4. List filters: **Todos / Grupales / Individuales** (with counts), same chip pattern as profile Calificaciones.
5. Extract **reusable filter chips** used by profile and chat.
6. Mobile: thread like the mobile mock; list restyled consistently with desktop list language.
7. **Preserve functionality**, including the **Toast UI Markdown editor** when sending messages (toolbar, markdown round-trip, send). Do not remove mute, participants, search-to-start-chat, pagination, unread, load-more messages, or group vs 1:1 behaviors without an explicit ask.

## Non-goals

- Backend / API / conversation type payload changes (filter client-side on existing `conversation.type`).
- Redesigning support tickets or other Toast UI surfaces outside chat.
- Nx / new stack work.
- Removing Markdown composer or replacing it with a plain textarea.
- Changing message send / unread / mute business rules.

## Approach

**Visual layer + shared chips** on existing views: new `messages-page` (or equivalent) CSS scoped under a conversations root class; extract filter chip component/CSS from profile; light markup tweaks for list chrome, row layout, thread header, bubbles, and composer chrome. Keep Toast UI editor; restyle wrapper/send button only.

## Architecture

```
ConversationList.vue
  ├── title “Mensajes”
  ├── search (existing user search → start chat)
  ├── FilterChips: Todos | Grupales | Individuales
  ├── conversation rows (avatar / group car icon, title, preview, relative time, unread)
  └── nested ConversationChat (desktop) / route chat (mobile)

ConversationChat.vue
  ├── desktop header
  │     ├── group: title, Ver viaje (if present), participants, mute
  │     └── 1:1: name → profile, ratings thumbs, last connection, CoordinateTrip
  ├── messages (MessageView bubbles + day separators)
  └── composer (Toast UI markdown + send) — keep editor

Shared
  └── FilterChips (+ filter-chips.css) ← ProfileRates, ProfileTrip, ConversationList
```

## Reusable filter chips

- Extract shared markup/CSS from profile (`.profile-filter-chips` / `.profile-filter-chip` / `--active` / check icon / tint modifiers).
- Prefer a small presentational component (e.g. `FilterChips.vue`) with props: options `{ id, label, count? }[]`, `modelValue` / active id, emit change.
- Profile Calificaciones and Viajes migrate to the shared component/classes without changing chip sets or counts behavior.
- Chat chips: **Todos**, **Grupales** (`type === 1`), **Individuales** (not group). Active = filled + check; optional tint modifiers consistent with profile.

## Conversation list

- Page title **Mensajes** (visible on desktop; mobile may keep existing header title behavior).
- Search field retained (name search → user results → create conversation).
- Filter chips above the list when not in search mode; client-side filter of loaded conversations; empty state when filter yields none.
- Rows: left avatar (1:1) or car/group affordance (group); title (`conversationTitle` / UserNameWithBadge for 1:1 identity); last message preview; relative time; unread indicator (dot or row treatment).
- Selected row: light-blue background (desktop).
- Keep “más resultados” pagination and loading/empty states; restyle alerts to fit the shell.

## Thread

### Header — group

- Trip/group title; link to trip when available (`Ver viaje` or existing equivalent).
- Participants expander (`ConversationParticipants`) kept; restyle to match mock.
- Mute / unmute notifications kept (accessible; may be icon/link styled, not removed).

### Header — 1:1

- Keep: profile link, name + verified badge, `UserRatingsCounts` (thumbs), last connection, `CoordinateTrip` (warnings / seat coordination).
- Restyle spacing, typography, and chrome to align with group header / mock colors; do not drop fields.

### Messages

- Incoming: grey bubbles; outgoing: pale-blue bubbles.
- Group: show author meta where already shown.
- Day separators (e.g. “Hoy”) when date boundaries exist or can be derived from message timestamps.
- Keep markdown HTML rendering in bubbles.

### Composer

- Rounded composer chrome; primary blue send control.
- **Keep Toast UI editor** (`ToastUiEditor` / markdown get/set, toolbar bold/italic/strike/lists, wysiwyg). Do not replace with plain input.
- Keep send disabled while sending; editor reset after send.

## Mobile

- List: same chip filters + row language (edge-appropriate padding).
- Thread: match mobile mock (trip context / CoordinateTrip, participants, bubbles, composer).
- Keep `HeaderApp` `syncChatHeader` / mobile chat header ratings behavior; restyle if needed without removing.

## Responsive behavior

| Surface | Layout |
|---------|--------|
| Desktop | Split: list column + thread; grey/white shell; selected row highlight |
| Mobile | List full screen; open chat full screen; CoordinateTrip / header as today |

## Testing

- Source/unit tests: FilterChips reuse; chat list chips Todos/Grupales/Individuales; filter logic by `type === 1`.
- Assert Toast UI / markdown composer still present in `ConversationChat` (editor ref, getMarkdown, toolbar).
- Assert 1:1 header still includes ratings, last connection, CoordinateTrip; group still has participants + mute.
- Profile chip tests updated for shared class/component names.
- Visual check list + group thread + 1:1 thread on mobile and desktop (DevTools).

## Acceptance criteria

1. List shows Todos / Grupales / Individuales chips and filters correctly; selected/unread/group affordances match the visual language.
2. Desktop and mobile list + thread match the described mock language.
3. 1:1 keeps all prior informational UI (ratings thumbs, last connection, CoordinateTrip, profile link); group keeps participants and mute.
4. Markdown editor remains for composing messages.
5. Profile filter chips use the shared chip component/CSS without regressing Calificaciones/Viajes filters.
6. No backend changes; no silent removal of chat functionality.
