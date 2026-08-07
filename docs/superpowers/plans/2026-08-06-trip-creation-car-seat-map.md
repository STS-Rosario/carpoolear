# Trip Creation Car + Seat Map Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use TDD. Commit after each RED / GREEN / REFACTOR phase.

**Goal:** Custom car dropdown + 4/5 layout cards; driver seat-map toggles with min 1 offered.

---

### Task 1: Seat layout / availability helpers

**Files:** `src/utils/tripSeatLayout.js`, `src/utils/tripSeatLayout.test.js`

- `maxOfferedSeatsForLayout(4|5)` → 3|4
- `rearMaxTwoFromLayout(4|5)` → true|false
- `createPassengerSeatAvailability(layout)` → all `true`
- `countAvailableSeats(availability)`
- `togglePassengerSeat(availability, index)` — refuse if would leave 0? (UI can warn; allow toggle, validate on next)
- `formatCarDropdownLabel(car)` → `Make Model · PATENTE` (in `carFields.js`)

### Task 2: i18n

Keys for car subtitle, layout prompt/tip, seat map copy, seat labels, footer strings.

### Task 3: TripCarStepPanel redesign

Custom dropdown + layout cards; props for `seatLayoutCapacity`; emit updates; validate wiring in wizard.

### Task 4: TripSeatMapPanel + wizard seats step

Driver: seat map; passenger: keep steppers. Sync `total_seats` / `rear_max_two_passengers`.

### Task 5: Validation + form state

`seatLayoutCapacity` / `passengerSeatAvailability` on form reset; `validateCar` requires layout; layout change resets seats.

### Task 6: Verify unit tests + lint
