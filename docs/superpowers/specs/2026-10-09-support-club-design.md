# Admin support tickets: Club column and Club-first sort

**Date:** 2026-10-09  
**Branch:** `support-club` (legacy `carpoolear/` and `carpoolear_backend/`)  
**Out of scope:** `carpoolear-nx/`, Club filter on the list, Club badge on ticket detail, changing a ticket’s stored `priority`

## Goal

Give Club Carpoolear members visible and queue priority on the admin support ticket list: a Club column with the badge, and open Club tickets always listed before everyone else, even when an admin sorts by another column.

## Membership

A ticket owner is a Club member when `ClubCarpoolearMembershipService::isActiveMember` is true **right now**:

- `users.monthly_donate` is true, **or**
- they have a `donation_subscriptions` row with `status = authorized`

Public profile opt-in (`show_club_carpoolear_membership`) does not matter. Membership is not frozen at ticket creation; if they leave Club, the logo and sort boost go away on the next list load.

## 1. API: flag and sort

`GET /api/admin/support/tickets` keeps existing filters (`type`, `priority`, `needs_reply`, `open`, `created_by_admin`, `user_id`, pagination).

### Payload

Each item in `data[]` includes `club_carpoolear_active` at the **ticket root** as `0` or `1` (same integer style as `ProfileTransformer`). It is true only for current active members.

The nested `user` relation stays `id` + `name`. Ticket detail (`show`) does not gain this field.

### Query params

| Param | Allowed | Default |
| --- | --- | --- |
| `sort` | `subject`, `priority`, `created_at`, `updated_at`, `status`, `assigned_to`, `type` | omitted |
| `direction` | `asc`, `desc` | `desc` when omitted with a valid `sort`; ignored when `sort` is omitted |

Invalid `sort` or `direction` is ignored (same pattern as other admin lists). Club-first still applies.

### Order

Always:

1. **Open Club first.** Open = `status` not in `Resuelto`, `Cerrado` (same as `SupportTicket::scopeOpen`). Club = current active member of the ticket **owner**.
2. **Chosen column** when `sort` is valid; otherwise newest as today (`support_tickets.id` descending).
3. **Tiebreaker:** `support_tickets.id` descending.

`priority` is not alphabetical: `high` > `normal` > `low`. `assigned_to` sorts by the assignee’s `users.name`; unassigned rows sit last in both directions.

Pagination uses this SQL order, so older open Club tickets still appear on page 1.

Closed or resolved tickets owned by Club members **do not** get the boost. In a mixed list they sit in the second group, ordered only by the chosen column (or `id`). They still expose `club_carpoolear_active = 1` when the owner is a member now.

Implementation: a focused helper next to `ManualIdentityValidationSort` (e.g. `STS\Support\SupportTicketAdminListSort`) applied from `SupportTicketController::index`. Membership SQL must match `isActiveMember` (monthly donate **or** authorized subscription subquery), not `club_carpoolear_joined_at` / `left_at` alone.

## 2. Admin list UI

File: `carpoolear/src/components/views/AdminSupportTickets.vue`.

### Columns

Asunto | Prioridad | **Club** | Creado | Actualizado | Estado | Asignado a | Categoría

Club header label: new i18n key `columnaClub` — `Club` in `arg`, `esp`, and `en`. Do not reuse `adminClubCarpoolear` (that string is the full “Club Carpoolear” nav title).

### Club cell

If `club_carpoolear_active` is truthy, show `static/img/badges/club-carpoolear.png` at **20×20** via the same `ROUTE_BASE + 'img/...'` pattern as `ProfileInfo` badge URLs. `alt` = `Club Carpoolear` (use `$t('adminClubCarpoolear')`). Empty cell otherwise, including unknown/missing flag.

Logo still shows on closed/resolved tickets when the owner is a current member.

### Column sort

Every header except Club is clickable, same interaction as `AdminManualIdentityValidations`:

- Click a column: it becomes the active sort
- Click the active column: toggle `asc` / `desc`
- Active column shows ▲ / ▼
- Sort change resets to page 1
- URL query keeps `sort` and `direction` next to existing filters
- API request sends the same keys through `buildAdminSupportTicketListParams` / the tickets store

First click on a new column:

| Column | First direction |
| --- | --- |
| `created_at`, `updated_at` | `desc` (newest first) |
| `priority` | `desc` (high first) |
| `subject`, `status`, `assigned_to`, `type` | `asc` |

Club is not a sort key and its header is not clickable.

No Club filter checkbox.

## Error handling

- Bad `sort` / `direction`: list still 200, default order, Club-first still on
- Missing `club_carpoolear_active`: treat as not a member (no logo)
- List request failures: existing error/empty handling, unchanged

## Testing

TDD in both repos (`test:` then `feat:` per slice; optional `refactor:`).

Backend (`AdminSupportTicketControllerIntegrationTest` and/or a unit test on the sort helper):

- Open Club ticket is listed before a newer open non-Club ticket
- Closed/resolved Club ticket does not outrank an open non-Club ticket
- With `sort=priority&direction=desc`, open Club tickets still come first, then high → normal → low
- Member who hides the public badge still has `club_carpoolear_active = 1`
- Non-member has `0`
- Invalid `sort` falls back to `id` desc with Club-first still applied

Frontend:

- Column order: Club immediately after Prioridad
- Logo 20×20 only when the flag is set; absent otherwise
- Sortable headers except Club; `sort` / `direction` on the API params and in the route query
- First-click direction table above
- `columnaClub` present in arg, esp, en
