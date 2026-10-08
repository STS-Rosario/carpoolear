# Exceso de contribución: low amounts, admin máxima, post-trip report

**Date:** 2026-10-08  
**Branch:** `exceso-contribucion-changes` (legacy `carpoolear/` and `carpoolear_backend/`)  
**Out of scope:** `carpoolear-nx/`, admin UI for overcharge reports, inferring “meant $16000” from $16

## Goal

Catch drivers who type a contribución like $16 when they mean $16000 (máxima often ~$14000), surface those trips in admin next to the per-person máxima, and log after the trip whether passengers paid more than the stated per-person contribución.

## Thresholds

Amounts are currency units (pesos), the same unit as the creation input and as `suspected_contribution`. `seat_price_cents / 100` is the stored input.

| Check | Range | Examples |
| --- | --- | --- |
| Trip-creation warning (input) | `amount > 0` and `amount < 2000` | $16 warns; $0 / voluntary does not; $2000 does not |
| LLM / admin flag | `amount > 1` and `amount < 2000` | $16 flags; $1.00 does not; $2000 does not |

`$1` warns in the wizard and does not flag for admin. That mismatch is intentional.

## 1. Trip-creation warning

Keep the existing modal and copy (`tripContributionExcessModal*`).

`shouldShowContributionExcessWarning` in `carpoolear/src/utils/tripCreationContributionExcessWarning.js` still returns true when the description asks more than the per-seat máxima.

It also returns true when the contribution **input** is implausibly low (`> 0` and `< 2000`), even if the description is empty.

Unchanged:

- Only on contribution and description steps
- Once per creation (`alreadyShown`)
- Not while editing
- Voluntary / empty / invalid price still does not warn from the description-vs-máxima rule; the new input rule also skips `<= 0`

## 2. LLM check and admin flag

The queued job `CheckTripContributionWithLlm` still writes through `TripContributionCheckApplier`. A trip is flagged (`has_potential_excess_contribution = true`, status `pendiente` if unset) when **any** of these hold:

1. Existing: description exceeds the per-seat máxima (`exceeds_max` and suspected amount `>` máxima, or exceeds without an amount)
2. Existing: phone in description
3. New: chosen `seat_price_cents` converts to an amount `> 1` and `< 2000`
4. New: LLM `suspected_contribution` is `> 1` and `< 2000`

A later clean LLM result **must not** clear the flag if (3) or (4) still apply. Empty description already calls the applier with a clean result; that path must keep (3).

If OpenRouter is not configured, the job must still run the applier with a clean LLM result so (3) can flag $16 trips.

Prompt (`OpenRouterContributionChecker`): also treat a per-person amount in the description that is over $1 and under $2000 as `exceeds_max: true` (understated amount, e.g. $16 meaning $16000). Do not invent a multiplied amount.

When the only reason to flag is a low seat price or low suspected amount, do not invent `description_potential_seat_price_cents`. Keep `suspected_contribution` as the LLM returned it. Excess percentage stays null unless there is a real potential seat price from a high suspected amount.

Shared backend helper (e.g. `STS\Services\ContributionCheck\ImplausiblyLowContribution`) owns the `> 1 && < 2000` comparison so the applier and tests do not duplicate bounds.

## 3. Admin list: contribución máxima

List payload (`TripExcessContributionListService::serializeRow`) includes `maximum_seat_price_cents` from `TripMaximumSeatPrice::centsFor` (already on the detail payload).

Admin table (`AdminExcesoContribucion.vue`) adds a sortable **Contribución máxima** column immediately after **Contribución**, formatted like the other peso columns (`formatTripContributionPesosLabel`). Detail view also shows it.

i18n key `contribucionMaximaColumna` (arg/esp: `Contribución máxima`; en: `Maximum contribution`). Do not reuse `contribucionMaxima` (that key is the long FAQ paragraph).

Sort: column key `maximum_seat_price_cents`, implemented by ordering on stored `trips.maximum_trip_price_cents` (occupant divisor is ignored for sort order). Add the key to `TRIP_EXCESS_CONTRIBUTION_SORT_COLUMNS` and `TripExcessContributionSort::ALLOWED_SORTS`.

## 4. Post-trip “¿Pagaste más…?”

### Who sees it

Only when **all** of:

- Rater is a passenger rating the driver (`user_to_type === DRIVER` / `Passenger::TYPE_CONDUCTOR`)
- Trip `seat_price_cents > 0` (not voluntary `-1`, not 0)

Drivers rating passengers, and trips with no charged contribución, skip the question. Submit does not send `paid_more` in that case.

### UI

`RatePending.vue`, in the expanded comment box, required before send:

- Question: `ratePendingPaidMoreThanContribution` — `¿Pagaste más de {amount}?` with `{amount}` = `formatTripContributionPesosLabel(trip.seat_price_cents)` (already includes `$`)
- Options: existing `si` / `no`
- Legend: `ratePendingPaidMoreLegend`

Spanish (arg and esp):

> Esta información sólo la verá el equipo de Carpoolear, no será pública. Queremos hacer un Carpoolear más justo, y eso significa que sólo se dividan los gastos, que es el valor de la contribución por persona en el detalle del viaje. Si tuviste que pagar más, avisanos para poder avisarle a la persona que creó el viaje que sólo se pueden dividir gastos.

English equivalent of the same meaning. All three locales (`arg`, `esp`, `en`).

Client: cannot submit while the question applies and no option is chosen (same pattern as required comments). Pass `paid_more: true|false` on the existing rate API body from `useRatesStore.vote`.

### Persistence

New table `trip_contribution_overcharge_reports`:

| Column | Type |
| --- | --- |
| `id` | bigIncrements |
| `user_id` | unsignedInteger, FK `users.id` cascade |
| `trip_id` | unsignedInteger, FK `trips.id` cascade |
| `paid_more` | boolean |
| `created_at` / `updated_at` | timestamps |
| unique | `(user_id, trip_id)` |

`user_id` is the passenger who answered. Store **every** Sí and No. No admin UI.

`RatingManager::rateUser` (including hash / logged-optional):

- If the question applies and `paid_more` is missing or not boolean → validation error, do not save the rating
- If the question applies and is valid → insert the report in the same success path as the rating
- If the question does not apply → ignore `paid_more` if sent; do not insert

No public field on ratings list transformers beyond what the rate endpoint needs.

## Error handling

- Creation warning is client-only; dismissing it still lets them create the trip
- LLM failures stay as today (retries, trip create does not fail)
- Missing `paid_more` when required: 422-style validation via existing `ExceptionWithErrors` / RatingManager errors
- Unique `(user_id, trip_id)`: a passenger rates a driver once; do not insert a second row

## Testing

TDD in both repos (`test:` then `feat:` commits per `docs/tech/testing-and-tdd.md` prefixes).

Frontend:

- Warning helper: low input warns; $0 / $2000 / already shown / edit do not; description-over-máxima still does
- Rate gating helper: question visibility; submit blocked without answer; `paid_more` on the vote payload
- i18n keys present in arg, esp, en
- Admin column key and list markup

Backend:

- Applier flags $16 seat price with a clean LLM result and does not clear it
- Applier flags suspected_contribution in `(1, 2000)`
- Applier does not flag $1.00 or $2000 from those new rules
- Prompt includes the understated-amount instruction
- Unconfigured OpenRouter still applies the numeric seat-price rule
- List/detail JSON includes `maximum_seat_price_cents`; sort allow-list
- Rating: passenger→driver with seat price requires `paid_more` and inserts; driver→passenger does not; missing answer rejects
