# Exceso de contribución Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Warn and flag implausibly low per-person contribución ($16-style), show contribución máxima in admin, and log passenger “paid more than stated” answers after the trip.

**Architecture:** Extend the existing creation-warning helper and `TripContributionCheckApplier`. Add `ImplausiblyLowContribution` for the admin-flag range. New `trip_contribution_overcharge_reports` rows are written from `RatingManager::rateUser` when a passenger rates the driver.

**Tech Stack:** Vue 2 + Vitest in `carpoolear/`; Laravel + PHPUnit in `carpoolear_backend/`. i18n locales: `arg`, `chl`, `en`.

## Global Constraints

- Legacy `carpoolear/` and `carpoolear_backend/` only (not `carpoolear-nx/`)
- Branch: `exceso-contribucion-changes`
- TDD: `test:` then `feat:` commits; auto-commit those prefixes
- Warning range: `amount > 0 && amount < 2000` (input units)
- Admin/LLM range: `amount > 1 && amount < 2000`
- Do not invent a multiplied amount from $16
- Paid-more question: passenger→driver only, `seat_price_cents > 0`

---

### Task 1: Frontend creation warning for low input

**Files:**
- Modify: `carpoolear/src/utils/tripCreationContributionExcessWarning.js`
- Modify: `carpoolear/src/utils/tripCreationContributionExcessWarning.test.js`
- Modify: `carpoolear/src/components/views/NewTripCreationWizard.contributionExcess.view.test.js`

**Interfaces:**
- Produces: `shouldShowContributionExcessWarning` also true when `parseSeatPriceInput(price) > 0 && < 2000`, even with empty description / no máxima. Still respects alreadyShown, isEdit, and contribution/description steps.

- [ ] **Step 1:** Add failing tests for `$16` (warns), `$0` / `$2000` / empty (no warn from this rule), empty description + `$16` (warns), `$16` with max-price module off (still warns).
- [ ] **Step 2:** Run tests, confirm fail.
- [ ] **Step 3:** Implement: check low input before the máxima/description heuristic.
- [ ] **Step 4:** Tests pass. Wizard view test: leaving contribution step with `price: '16'` opens the modal.
- [ ] **Step 5:** Commit `test:` then `feat:`.

### Task 2: Backend implausibly-low helper + applier

**Files:**
- Create: `carpoolear_backend/app/Services/ContributionCheck/ImplausiblyLowContribution.php`
- Create: `carpoolear_backend/tests/Unit/Services/ContributionCheck/ImplausiblyLowContributionTest.php`
- Modify: `carpoolear_backend/app/Services/ContributionCheck/TripContributionCheckApplier.php`
- Modify: `carpoolear_backend/tests/Unit/Services/ContributionCheck/TripContributionCheckApplierTest.php`

**Interfaces:**
- Produces: `ImplausiblyLowContribution::matches(?float $amount): bool` (`> 1 && < 2000`); `matchesSeatPriceCents(?int $cents): bool` (null/≤0 false; else `matches($cents / 100)`).
- Applier flags when existing excess/phone **or** low seat price **or** low suspected amount. Clean LLM result must not clear those. Do not set `description_potential_seat_price_cents` for low-amount-only flags.

- [ ] Failing helper + applier tests ($16 flags; $1 and $2000 do not; clean result keeps $16 flag; suspected 16 flags without potential cents).
- [ ] Implement helper and applier.
- [ ] Commit `test:` then `feat:`.

### Task 3: LLM prompt + unconfigured job still applies numeric rule

**Files:**
- Modify: `carpoolear_backend/app/Services/ContributionCheck/OpenRouterContributionChecker.php`
- Modify: `carpoolear_backend/tests/Unit/Services/ContributionCheck/OpenRouterContributionCheckerTest.php`
- Modify: `carpoolear_backend/app/Jobs/CheckTripContributionWithLlm.php`
- Modify: `carpoolear_backend/tests/Unit/Jobs/CheckTripContributionWithLlmTest.php`

- [ ] Prompt test: user prompt mentions over $1 and under $2000 as exceeds_max (understated).
- [ ] Job: missing API key still calls applier; $16 trip is flagged; $15000 trip stays unflagged. Keep the info log.
- [ ] Empty description + $16 flags.
- [ ] Commit `test:` then `feat:`.

### Task 4: Admin contribución máxima column

**Files:**
- Modify: `carpoolear_backend/app/Services/Admin/TripExcessContributionListService.php`
- Modify: `carpoolear_backend/app/Support/TripExcessContributionSort.php`
- Modify: `carpoolear_backend/tests/Feature/Http/AdminTripExcessContributionControllerIntegrationTest.php`
- Modify: `carpoolear_backend/tests/Unit/Support/TripExcessContributionSortTest.php`
- Modify: `carpoolear/src/utils/adminTripExcessContributionList.js`
- Modify: `carpoolear/src/utils/adminTripExcessContributionList.test.js`
- Modify: `carpoolear/src/components/views/AdminExcesoContribucion.vue`
- Modify: `carpoolear/src/components/views/AdminExcesoContribucionDetail.vue`
- Modify: `carpoolear/src/components/views/AdminExcesoContribucion.view.test.js`
- Modify: `carpoolear/src/language/i18n.js` (`contribucionMaximaColumna` in arg/chl/en)

- [ ] List serializeRow includes `maximum_seat_price_cents` immediately after `seat_price_cents`.
- [ ] Sort allow-list + `orderBy maximum_trip_price_cents`.
- [ ] Frontend column after contribución; detail paragraph; hardcoded tbody `<td>` inserted in the same place.
- [ ] Commit `test:` then `feat:` per repo.

### Task 5: Overcharge report table + rating API

**Files:**
- Create: `carpoolear_backend/database/migrations/2026_10_08_120000_create_trip_contribution_overcharge_reports_table.php`
- Create: `carpoolear_backend/app/Models/TripContributionOverchargeReport.php`
- Create: `carpoolear_backend/tests/Unit/Models/TripContributionOverchargeReportTest.php`
- Modify: `carpoolear_backend/app/Services/Logic/RatingManager.php`
- Modify: `carpoolear_backend/tests/Unit/Services/Logic/RatingManagerTest.php`
- Modify: `carpoolear_backend/tests/Feature/Http/RatingApiTest.php`

**Interfaces:**
- Table: `id`, `user_id` FK users cascade, `trip_id` FK trips cascade, `paid_more` boolean, timestamps, unique `(user_id, trip_id)`.
- Require `paid_more` boolean when `user_to_type === Passenger::TYPE_CONDUCTOR` and `seat_price_cents > 0`. Insert on successful rate. Ignore otherwise. Missing answer: errors, no rating save.

- [ ] Model/migration tests.
- [ ] RatingManager: passenger→driver with price requires `paid_more` and inserts; driver→passenger does not; missing rejects; existing tests stay green (factory trips have null seat price).
- [ ] Feature: passenger rates driver with `paid_more: true` persists report.
- [ ] Commit `test:` then `feat:`.

### Task 6: RatePending UI + vote payload

**Files:**
- Create: `carpoolear/src/utils/tripContributionOvercharge.js` (+ test)
- Modify: `carpoolear/src/utils/tripRating.js` (or keep gating in the new util)
- Modify: `carpoolear/src/components/RatePending.vue`
- Modify: `carpoolear/src/components/RatePending.view.test.js`
- Modify: `carpoolear/src/stores/rates.js`
- Modify: `carpoolear/src/language/i18n.js`
- Create: `carpoolear/src/language/ratePendingPaidMoreCopy.test.js`

**Interfaces:**
- `shouldAskPaidMoreThanContribution({ userToType, seatPriceCents })` — driver target (`0`) and `seatPriceCents > 0`.
- `canSubmitRatingVote` extended or wrapper that also requires `paidMore` boolean when the question applies.
- Vote payload includes `paid_more` only when the question applies.
- Copy: `ratePendingPaidMoreThanContribution` (`¿Pagaste más de {amount}?`), `ratePendingPaidMoreLegend` (spec Spanish; English equivalent). Reuse `si` / `no`. `{amount}` = `formatTripContributionPesosLabel(trip.seat_price_cents)`.

- [ ] Failing helper + i18n + view tests.
- [ ] Implement RatePending radios in the comment box; store passes `paid_more`.
- [ ] Commit `test:` then `feat:`.

### Task 7: Verify

- [ ] Frontend: `npm run test:unit -- --run` on touched files + lint.
- [ ] Backend: `php artisan test` on touched tests.
- [ ] Browser: trip-creation warning with $16; admin list column if a local admin session exists; rating form if a pending passenger→driver rating exists. If the app is not running, say what was not verified.
