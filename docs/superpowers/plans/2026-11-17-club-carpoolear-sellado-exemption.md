# Club Carpoolear sellado exemption Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Active Club Carpoolear members are never charged Un litro (sellado) on trip create/edit when the module is enabled; pricing omits sellado; Un litro cards show member thank-you copy.

**Architecture:** Central `SelladoChargePolicy` on the backend returns a decision (`should_charge` + `reason`). Create, edit, `selladoViaje`, and trip-info pricing all use it. Frontend mirrors via `clubMemberExempt` / `isActiveClubCarpoolearMember` and a new `UnLitroInfoCard` state.

**Tech Stack:** Laravel/PHPUnit (`carpoolear_backend/`), Vue 2 + Vitest (`carpoolear/`), existing `ClubCarpoolearMembershipService`.

## Global Constraints

- Branches: `feat/club-carpoolear-sellado-exemption` in both repos
- Do not touch `carpoolear-nx/`
- TDD: `test` commit then `feat` commit per slice (user rule)
- Member title: `Por ser parte del Club Carpoolear no pagás Un litro para Carpoolear`
- Member notice: `¡Gracias por ser parte del Club Carpoolear!` (with logo, not donate CTA)
- Two PRs when done (backend + frontend)
- Club trips still count toward sellado trip history

---

## File map

| File | Responsibility |
| --- | --- |
| `carpoolear_backend/app/Services/Sellado/SelladoChargeDecision.php` | Value object: `shouldCharge(): bool`, `reason(): string` |
| `carpoolear_backend/app/Services/Sellado/SelladoChargePolicy.php` | Decides charge/skip from enabled, route, club, threshold, credit |
| `carpoolear_backend/tests/Unit/Services/Sellado/SelladoChargePolicyTest.php` | Policy unit tests |
| `carpoolear_backend/app/Repository/TripRepository.php` | Use policy in create/edit/`selladoViaje`/trip-info metrics |
| `carpoolear_backend/tests/Unit/Repository/TripRepositoryTest.php` | Create/edit/selladoViaje/pricing club cases |
| `carpoolear/src/utils/tripSelladoUi.js` | `shouldChargeSellado` + helpers take `clubMemberExempt` |
| `carpoolear/src/utils/tripSelladoUi.test.js` | Club exempt cases |
| `carpoolear/src/components/elements/UnLitroInfoCard.vue` | `clubMemberExempt` UI state |
| `carpoolear/src/language/i18n.js` + `unLitroLabels.test.js` | New i18n keys |
| `carpoolear/src/components/views/NewTrip.vue` | Pass club exempt into charge helpers / card |

---

### Task 1: Backend SelladoChargePolicy (TDD)

**Files:**
- Create: `carpoolear_backend/app/Services/Sellado/SelladoChargeDecision.php`
- Create: `carpoolear_backend/app/Services/Sellado/SelladoChargePolicy.php`
- Test: `carpoolear_backend/tests/Unit/Services/Sellado/SelladoChargePolicyTest.php`

**Interfaces:**
- Produces: `SelladoChargePolicy::decide(User $user, bool $routeNeedsPayment, ?int $excludeTripId = null): SelladoChargeDecision`
- Reasons: `disabled`, `route_not_eligible`, `club_member`, `under_threshold`, `complimentary_credit`, `charge`
- Order: disabled → route → club → threshold → credit → charge

- [ ] **Step 1:** Write failing policy tests for each reason (club before threshold; membership via `monthly_donate` and/or authorized subscription).
- [ ] **Step 2:** Run `./vendor/bin/phpunit tests/Unit/Services/Sellado/SelladoChargePolicyTest.php` — expect FAIL (class missing).
- [ ] **Step 3:** Commit `test(api): add SelladoChargePolicy club exemption cases`
- [ ] **Step 4:** Implement `SelladoChargeDecision` + `SelladoChargePolicy` using `ClubCarpoolearMembershipService`, `SelladoTripCount`, `SelladoEmptyTripCredit`, config flags.
- [ ] **Step 5:** Run tests — PASS. Commit `feat(api): add SelladoChargePolicy for sellado decisions`

---

### Task 2: Wire create + edit charge paths

**Files:**
- Modify: `carpoolear_backend/app/Repository/TripRepository.php` (`maybeRequireSelladoPayment` + update sellado block ~221–254)
- Test: `carpoolear_backend/tests/Unit/Repository/TripRepositoryTest.php`

- [ ] **Step 1:** Failing tests: active club member over quota on qualifying route — create does not charge; edit from unpaid→paid route does not charge.
- [ ] **Step 2:** Run filtered phpunit — RED.
- [ ] **Step 3:** Commit `test(api): club members skip sellado on create and edit`
- [ ] **Step 4:** Refactor `maybeRequireSelladoPayment` to use policy; on edit, only enter charge branch when `decide(...)->shouldCharge()`. Keep complimentary credit redemption inside create path when reason is `complimentary_credit` (policy can expose reason; create path redeems when that reason would apply — either policy returns before credit and a separate check, or policy method `decide` returns credit reason and create redeems then). Prefer: policy returns `complimentary_credit` without side effects; `maybeRequireSelladoPayment` redeems when decision reason is that.
- [ ] **Step 5:** GREEN. Commit `feat(api): exempt Club members from sellado charge on create/edit`

---

### Task 3: selladoViaje + trip-info pricing

**Files:**
- Modify: `TripRepository::selladoViaje`, `getTripInfo` / `buildTripInfoMetricsForRoute` (optional `?User $user`)
- Modify: `TripsManager::getTripInfo`, `TripController::getTripInfo` to pass `auth()->user()` when present
- Test: `TripRepositoryTest.php`

- [ ] **Step 1:** Failing tests: `selladoViaje` includes `club_member_exempt: true` for active members; trip-info metrics for club user omit sellado cents when route qualifies.
- [ ] **Step 2:** RED → commit `test(api): expose club sellado exemption in quota and pricing`
- [ ] **Step 3:** Implement — for pricing, `includesSellado` only when module+route and user is not active club member (if user null, keep current route-only behavior for anonymous trip-info).
- [ ] **Step 4:** GREEN → commit `feat(api): omit sellado pricing for Club members`

---

### Task 4: Frontend tripSelladoUi + NewTrip wiring

**Files:**
- Modify: `carpoolear/src/utils/tripSelladoUi.js`
- Modify: `carpoolear/src/utils/tripSelladoUi.test.js`
- Modify: `carpoolear/src/components/views/NewTrip.vue` (and wizard props if needed)
- Possibly: panels that pass `selladoCharged`

- [ ] **Step 1:** Failing tests: `shouldChargeSellado` / complimentary helpers return false when `clubMemberExempt: true`; add `shouldShowClubMemberExemptCard` or equivalent.
- [ ] **Step 2:** RED → commit `test(web): club members do not charge sellado in UI helpers`
- [ ] **Step 3:** Implement helpers; in `NewTrip.vue` set `clubMemberExempt` from `selladoViaje.club_member_exempt` OR `isActiveClubCarpoolearMember(user)`; pass into charge/card computeds. `selladoCharged` false for members; new `selladoClubExempt` true when enabled+routeNeedsPayment+club (card still shows).
- [ ] **Step 4:** GREEN → commit `feat(web): skip sellado charge preview for Club members`

---

### Task 5: UnLitroInfoCard member copy

**Files:**
- Modify: `UnLitroInfoCard.vue`, `UnLitroInfoCard.view.test.js`
- Modify: `i18n.js`, `unLitroLabels.test.js`
- Wire prop through contribution/review panels + NewTrip

- [ ] **Step 1:** Failing view tests for title + thank-you notice with logo (`data-testid="un-litro-club-thanks"`), no donate promo when `clubMemberExempt`.
- [ ] **Step 2:** RED → commit `test(web): Club member Un litro card copy`
- [ ] **Step 3:** Add i18n keys `unLitroClubExemptTitle`, `unLitroClubExemptThanks`; prop `clubMemberExempt`; template branch; style reuse of pink pill but as `<div>` not `router-link`.
- [ ] **Step 4:** GREEN → commit `feat(web): show Club thank-you Un litro card for members`

---

### Task 6: Push and open PRs

- [ ] Push both branches, `gh pr create` for backend and frontend linking the design spec and each other.
- [ ] Return both PR URLs.

---

## Spec coverage check

| Spec item | Task |
| --- | --- |
| Central policy | 1 |
| Create/edit skip charge | 2 |
| Omit pricing sellado | 3 + 4 |
| selladoViaje signal | 3 |
| Card title + thanks + logo | 5 |
| Two PRs | 6 |
| TDD commits | each task |
