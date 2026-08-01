# Task 7 report: Mobile linear stack in `Trip.vue` + section chrome

## Status: DONE

## Commits

1. `23162b38` — `test: add failing specs for Trip.vue mobile trip-detail stack`
2. `182473b7` — `feat: restyle mobile trip detail section stack`

## TDD evidence

**RED** (`npm run test:unit -- --run src/components/views/Trip.view.test.js`, before implementation):

```
FAIL  Trip.vue mobile trip-detail stack > uses trip-detail root and mobile stack section labels
FAIL  Trip.vue mobile trip-detail stack > keeps map after CTAs in mobile markup
FAIL  Trip.vue mobile trip-detail stack > adds trip-detail root classes with mobile modifier binding
FAIL  Trip.vue mobile trip-detail stack > gates the mobile stack on isMobile, trip and not passengers view
Test Files  1 failed (1)
     Tests  4 failed | 8 passed (12)
```

**GREEN** (after implementation):

```
npm run test:unit -- --run src/components/views/Trip.view.test.js \
  src/components/elements/TripPassengers.view.test.js \
  src/components/elements/TripButtons.view.test.js \
  src/components/elements/TripDriver.view.test.js \
  src/components/elements/TripDescription.view.test.js \
  src/styles/tripDetail.styles.test.js

Test Files  6 passed (6)
     Tests  24 passed (24)
```

Full suite (`npm run test:unit -- --run`): `330 passed | 2 failed (332 files)`, `1607 passed | 5 failed (1612 tests)`. The 2 failing files (`SearchTrip.view.test.js`, `stores/conversations.test.js`) fail identically on a clean stash of this branch before this task's changes (pre-existing `NotificationApi` mock gap / unrelated CSS assertion) — confirmed unrelated via `git stash`.

## Files changed

- `src/components/views/Trip.vue` — added `trip-detail` / `trip-detail--mobile` root classes; gated desktop `columnComponent` row, driver-container, structure-div (matching users + map) and desktop `TripButtons` behind `!isMobile`; moved the two carpoodatos modals to always render (still above the stack) regardless of viewport; added the explicit `trip-detail__stack` (TripDriver → DETALLE section with TripLocation/TripDate/TripStats → MENSAJE DEL CONDUCTOR (inline description, omitted when empty) → CONDICIONES section with TripPrice/TripSeats/TripData → TripPassengers → `trip-detail__cta` wrapping `TripButtons` → map) rendered when `isMobile && trip && !isPassengersView`. The `ref="tripMapEl"` map div exists exactly once at a time (mobile stack vs. desktop structure-div are mutually exclusive via `isMobile`).
- `src/components/views/Trip.view.test.js` — added the brief's RED specs plus two extra specs asserting the mobile-modifier class binding and the `isMobile && trip && !isPassengersView` stack gate.
- `src/components/elements/TripPassengers.vue` — added optional `sectionTitle` prop (`joinedTitle` computed falls back to `$t('tripDetailJoined')`) so Trip.vue can pass the label explicitly from the mobile stack without duplicating the heading.
- `src/components/elements/TripDriver.vue` — added a compact mobile header branch (avatar + `UserNameWithBadge` + `UserRatingsCounts` + viajes-count label via new `driverTripsLabel` computed / `normalizeTripsCount`), shown whenever `isMobile`, ahead of the existing light/non-light branches (both still used for desktop).
- `src/components/elements/TripStats.vue` — added a compact inline mobile variant (`12 km · 2 h · 1.80 kg CO₂` using the existing `.trip-detail__stats` / `.trip-detail__stats-sep` CSS) gated on `isMobile`; desktop markup unchanged.

## Reviewer fix: duplicate `TripSeats` on mobile light theme

**Finding:** with `trip_card_design: 'light'` + mobile, `TripSeats` rendered twice: once embedded inside `TripLocation.vue` (`v-if="tripCardTheme === 'light' && isMobile"`) and once unconditionally in the new CONDICIONES section of the `Trip.vue` mobile stack.

**Fix:** removed the embedded `<TripSeats>` from `TripLocation.vue` entirely (along with its now-unused `TripSeats` import/registration and the now-unused `isMobile`/`useDeviceStore` mapping), so the mobile stack's single `<TripSeats />` in CONDICIONES is the only instance. Desktop is unaffected: desktop light theme already gets `TripSeats` via the explicit `columnComponent` entry (`[TripLocation, TripDate, TripPrice, TripSeats, TripPassengers]`), and TripLocation's old embed only ever fired for the light+mobile combo, which no longer needs it since `columnComponent` markup is hidden on mobile in favor of the explicit stack.

Added tests:
- `TripLocation.view.test.js` — new spec asserting the source no longer references `TripSeats`.
- `Trip.view.test.js` — new spec asserting `<TripSeats />` appears exactly once inside the mobile stack (between `trip-detail__stack` and `trip-route-map`).

**Command:**

```bash
cd /Users/gonzalogm/Work/carpoolear/carpoolear
npm run test:unit -- --run src/components/views/Trip.view.test.js src/components/elements/TripLocation.view.test.js src/components/elements/TripSeats.view.test.js
```

**Output summary:**

```
Test Files  3 passed (3)
     Tests  25 passed (25)
```

Full suite re-run (`npm run test:unit -- --run`): `330 passed | 2 failed (332 files)`, `1609 passed | 5 failed (1614 tests)` — same 2 pre-existing, unrelated failures (`SearchTrip.view.test.js`, `stores/conversations.test.js`) as before this fix; no new regressions.

**Commit:** `fix: stop TripSeats from rendering twice on mobile light trip detail`

## Concerns / follow-ups

- Owner-only "matcheos del viaje" (matching users) panel is now hidden entirely on mobile (previously shown regardless of viewport) since it wasn't part of the mobile mock's primary stack and its markup isn't mobile-adapted. Flagging in case product wants it surfaced somewhere below the stack later.
- `TripDescription`'s car-details block (`TripCarDetails`) is not shown in the mobile MENSAJE DEL CONDUCTOR section (mobile stack inlines `trip.description` only, per brief/design). Car details remain visible on desktop only.
- Did not touch `carpoolear-nx` per workspace rule.
