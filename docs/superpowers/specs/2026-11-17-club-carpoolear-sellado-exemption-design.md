# Club Carpoolear — sellado / Un litro exemption

**Date:** 2026-11-17  
**Branches:** `feat/club-carpoolear-sellado-exemption` in `carpoolear/` and `carpoolear_backend/`  
**Out of scope:** `carpoolear-nx/`, donation/subscription signup flows, Mercado Pago / QR payment plumbing itself, non-sellado Club perks, inventing a new persisted “club-waived” trip flag

## Goal

When Un litro para Carpoolear (sellado) is enabled, active Club Carpoolear members must not be charged on trip **create or edit**. Pricing must omit sellado for those members. Un litro info cards must show member-specific copy instead of the join promo.

## Decisions

| Topic | Choice |
| --- | --- |
| Create + edit | Exempt on both |
| Card visibility | Still show the card for members (thank-you state), do not hide it |
| Pricing | Omit sellado from recommended price / pricing breakdown for the member |
| Architecture | Central sellado **charge policy** (Approach 2), not scattered early-exits only |
| Delivery | Two coordinated PRs (backend + frontend) |
| Trip history / quota | Club-member trips still count toward sellado trip history (fair if membership lapses) |
| Member notice punctuation | `¡Gracias por ser parte del Club Carpoolear!` (exclamation, not question) |

## Architecture

### Backend (`carpoolear_backend/`) — source of truth

Introduce a dedicated sellado decision policy (name TBD in implementation, e.g. `SelladoChargePolicy` / `SelladoRequirement`) that answers whether a user must pay sellado for a given route context.

**Inputs**

- Module enabled (`module_trip_creation_payment_enabled`)
- Route needs payment (geo / `routeNeedsPayment`)
- Free-trip threshold / current trip count
- Unused empty-trip (complimentary) credit
- Active Club membership via existing `ClubCarpoolearMembershipService::isActiveMember`

**Outputs**

- Whether to charge
- Skip reason when not charging: `disabled` | `route_not_eligible` | `club_member` | `under_threshold` | `complimentary_credit` | (or equivalent enum/string set locked by tests)
- Charge outcome: `charge`

**Callers (all must use the policy — no duplicated membership checks)**

| Caller | Behavior when `club_member` (or not charge) |
| --- | --- |
| `TripRepository` create path (`maybeRequireSelladoPayment` or successor) | No MP preference; trip stays ready; `needs_sellado = false` |
| `TripRepository` edit path | Same as create |
| Trip-info / `buildTripInfoMetricsForRoute` (authenticated driver context) | Do not add sellado cents to breakdown / recommended max |
| `selladoViaje` (or equivalent quota API) | Expose enough for the frontend (e.g. `club_member_exempt` and/or skip reason) |

Membership definition remains existing: `monthly_donate` **or** `DonationSubscription` with `status === 'authorized'`.

### Frontend (`carpoolear/`)

- Prefer API truth from `selladoViaje` / trip-info when present.
- Keep a thin client helper in `tripSelladoUi` (and callers such as `NewTrip.vue`) that includes active Club membership so wizard preview stays correct before/alongside API fields.
- Active member helper remains `isActiveClubCarpoolearMember` / profile `club_carpoolear_active`.

### UI — `UnLitroInfoCard` (all call sites)

When the card is shown for an active Club member on a sellado-relevant route:

| Element | Copy |
| --- | --- |
| Title | `Por ser parte del Club Carpoolear no pagás Un litro para Carpoolear` |
| Notice (with Club logo; **not** a join CTA to donate) | `¡Gracias por ser parte del Club Carpoolear!` |

Non-members keep current charged title + pink “sumate” promo linking to donate.

Primary surfaces already using the card: contribution step, review step, trip detail, creation success / pay cards — all inherit via `UnLitroInfoCard` + i18n keys.

## Data flow

```text
route + user
    → SelladoChargePolicy
        → charge? → MP / awaiting_payment / needs_sellado
        → club_member → ready trip, no sellado in pricing, UI thank-you card
        → other skips → existing behavior (threshold, complimentary credit, disabled, route)
```

Frontend mirrors charge vs club-exempt for card state; backend remains authoritative for actually creating payment requirements.

## Error handling / edge cases

- Sellado module off → no card charge path; Club copy N/A (existing hide rules).
- Member under free-trip threshold → still club-exempt messaging when the Un litro card would show for that route; never charged either way.
- Complimentary credit vs club: both skip charge; policy reasons stay distinct for API/tests; UI prefers club thank-you when member is active.
- Membership lapses after trips were created while exempt → those trips stay as created (no backfill charge); future trips use current membership.

## Testing (TDD)

### Backend (PHPUnit)

1. Policy unit tests first for each skip reason + charge path (especially `club_member`).
2. `TripRepository` create + edit: active member → no `awaiting_payment`, no `needs_sellado`, no MP preference creation.
3. Trip-info / pricing for authenticated club member → no sellado in breakdown.
4. `selladoViaje` (or equivalent) exposes club exemption signal for the client.

### Frontend (Vitest)

1. `tripSelladoUi`: club member → not charged; card can still show in exempt/thank-you state.
2. `UnLitroInfoCard`: member title + thank-you notice with logo; non-member promo unchanged.
3. Existing wizard/review tests updated only where they assert Un litro charged state.

### Commits

Follow TDD step commits (`test` / `feat` / `refactor`) per project testing docs; open two PRs when done.

## Success criteria

- Active Club member never enters sellado payment on create or edit while the module is enabled.
- Recommended contribution / pricing breakdown does not include sellado for that member.
- Un litro cards show the member title and thank-you notice (with logo) instead of the join promo.
- Non-members and disabled-module behavior unchanged.
