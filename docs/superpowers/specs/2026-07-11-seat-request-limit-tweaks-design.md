# Seat request limit tweaks

**Date:** 2026-07-11  
**Branch:** `seat-request-limit-tweaks`  
**Repos:** `carpoolear_backend` (legacy API) + `carpoolear` (legacy Vue frontend)  
**Out of scope:** `carpoolear-nx`

## Problem

When a driver’s unanswered seat-request / conversation limit is reached (`module_unaswered_message_limit`), the API rejects new conversations and seat requests with `user_has_reach_request_limit`. Passengers only learn this after clicking; drivers get no clear signal that the trip has hit the cap.

## Goals

1. Expose limit status on trip data so the UI can disable actions proactively.
2. Disable both **Enviar mensaje** and seat-request actions for passengers when the limit is reached, with an explanatory message.
3. Warn the driver on trip detail and My Trips when their trip has reached the limit, with a path to answer requests.
4. Keep existing counting rules (pending seat requests **plus** unanswered conversations).

## Non-goals

- Changing how the limit is counted (conversations still count).
- Changing the driver’s ability to configure `unaswered_messages_limit`.
- Nx / new stack work.

## Approach

**A — Boolean + limit on trip payload** (chosen): backend computes `seat_request_limit_reached` and `seat_request_limit` using the same rule already used to block conversation create and seat requests. Frontend reads those fields.

## Backend design

### Existing behavior (unchanged)

- Config: `carpoolear.module_unaswered_message_limit`.
- Per-driver limit: `users.unaswered_messages_limit`.
- Count: `UserRepository::unansweredConversationOrRequestsByTrip` = pending seat requests for the trip + unanswered conversations for the trip (existing semantics).
- Block when count ≥ limit in:
  - `ConversationsManager::findOrCreatePrivateConversation`
  - `PassengersManager::newRequest`

### New trip fields (`TripTransformer`)

When the authenticated viewer loads a trip:

| Field | Type | When |
|--------|------|------|
| `seat_request_limit` | `int \| null` | Driver’s `unaswered_messages_limit` if module is on and limit `> 0`; otherwise `null` |
| `seat_request_limit_reached` | `bool` | `true` iff module is on, limit `> 0`, and combined unanswered count ≥ limit; otherwise `false` |

Computation must reuse the same allow/deny logic as conversation create / seat request (via `UsersManager::unansweredConversationOrRequestsByTrip` or an equivalent shared helper) so UI and API cannot disagree.

## Frontend design

### Passenger (non-owner) — trip detail `TripButtons`

When `trip.seat_request_limit_reached`:

- Disable **Enviar mensaje** (keep visible).
- Disable seat-request / Solicitar asiento / coordinate-by-message button.
- Below the buttons, show i18n message:  
  *“Este viaje ya llegó a su límite de {limit} solicitudes, el conductor las está evaluando, volvé más tarde”*  
  where `{limit}` = `trip.seat_request_limit`.

Keep existing store/API error handling for `user_has_reach_request_limit` as a fallback.

### Driver (owner) — trip detail

When `trip.seat_request_limit_reached`:

- Show limit warning:  
  *“Este viaje llegó al límite de solicitudes de asiento, contestá las solicitudes para poder recibir más de otros usuarios interesados”*
- Link the warning to Mis viajes (`my-trips`), same pattern as the existing pending-requests warning.

When there are pending requests but the limit is **not** reached:

- Keep the existing “Tenés pedidos de asiento…” warning (`shouldShowTripSeatRequestsWarning`).

When the limit **is** reached:

- Prefer the new limit warning (do not also show the generic pending warning).

### Driver (owner) — My Trips cards (`sections/Trip.vue`)

When `trip.seat_request_limit_reached`:

- Show the same limit warning text (no self-link; user is already on My Trips).

## Testing (TDD)

Commits after each phase: failing test (red) → minimum implementation (green) → refactor. Use `test` / `feat` / `refactor` prefixes per project TDD conventions.

### Backend

- `TripTransformer` tests for field presence and true/false/null cases (module off, no limit, under limit, at/over limit).
- Ensure flag aligns with existing UsersManager allow/deny behavior.

### Frontend

- Small util for passenger vs driver visibility rules (limit reached + owner).
- View tests for disabled buttons + passenger message in `TripButtons`.
- View tests for driver limit warning on trip detail (with `my-trips` link) and My Trips card.
- i18n keys for passenger and driver messages (es + existing locales as the project requires).

## Verification (done when finished)

- Backend: relevant PHPUnit suite passes.
- Frontend: lint and build pass.
