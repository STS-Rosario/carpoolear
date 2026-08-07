# Chat Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle conversation list + thread (mobile/desktop) with reusable filter chips (Todos/Grupales/Individuales), without removing Markdown composer or other chat functionality.

**Architecture:** Extract shared `FilterChips` + `filter-chips.css`; add `messages-page.css` visual layer; client-filter conversations by `type === 1`; restyle list rows, headers, bubbles, composer chrome while keeping Toast UI editor and all 1:1/group behaviors.

**Tech Stack:** Vue 3 Options API, Pinia, Vitest source tests, existing Toast UI editor, Bootstrap layout.

## Global Constraints

- Repo: `carpoolear/` only (not `carpoolear-nx`).
- Keep Toast UI Markdown editor for sending messages.
- Keep 1:1: ratings thumbs, last connection, CoordinateTrip, profile link.
- Keep group: participants, mute/unmute.
- Keep search → create conversation, pagination, unread, load-more.
- Filter client-side; no backend changes.
- TDD: failing test → implement → pass → commit (`test:` / `feat:` / `fix:`).

---

## File map

| File | Role |
|------|------|
| `src/components/elements/FilterChips.vue` | Shared chip tablist |
| `src/styles/components/filter-chips.css` | Chip base styles (+ aliases for profile class names during migrate) |
| `src/styles/components/messages-page.css` | Messages list/thread visual layer |
| `src/styles/main.css` | Import new CSS |
| `src/styles/components/profile-page.css` | Remove duplicated chip rules; keep rates tint overrides targeting shared classes |
| `ProfileRates.vue` / `ProfileTrip.vue` | Use FilterChips |
| `ConversationList.vue` | Title, chips, filter, row restyle hooks |
| `ConversationChat.vue` | Header/composer class hooks; keep editor |
| `MessageView.vue` | Bubble classes; optional day separator support |
| `utils/conversationListFilter.js` | Pure filter helper (testable) |

---

### Task 1: Shared FilterChips

- [ ] Write failing tests for `FilterChips.vue` (options, active, emit, check icon, modifier class) and `filter-chips.css` import.
- [ ] Implement component + CSS; wire `main.css`.
- [ ] Commit `test:` then `feat:`.

### Task 2: Migrate profile chips

- [ ] Update ProfileRates/ProfileTrip tests to expect FilterChips / shared classes.
- [ ] Migrate both sections; keep tinted active chips for rates.
- [ ] Commit.

### Task 3: List filter helper + chips on ConversationList

- [ ] Failing tests: `filterConversationsByKind(list, kind)` for all/group/individual; list view has FilterChips Todos/Grupales/Individuales; markdown not relevant here.
- [ ] Implement helper + list UI (title Mensajes, chips, filtered list, group car icon, unread dot classes).
- [ ] Commit.

### Task 4: Thread + bubbles + composer visual layer

- [ ] Failing tests: ConversationChat still has ToastUiEditor / getMarkdown / toolbar; MessageView bubble modifiers; messages-page.css tokens (outgoing blue, incoming grey, selected row).
- [ ] Implement CSS + light markup; day separators if straightforward; keep all header features.
- [ ] Commit.

### Task 5: Visual verify

- [ ] DevTools: list filters, group chat, 1:1 chat, mobile widths; confirm markdown toolbar present.
