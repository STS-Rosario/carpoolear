# Vehicle Fuel Type & Consumption Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox syntax. TDD: commit after red, green, and refactor.

**Goal:** Mandatory per-car fuel type + consumption; trip fuel snapshot; gate + UI + fuel_abuse denuncia.

**Architecture:** FuelPricingResolver → car fields → trip create snapshot → breakdown/display. Trip edit keeps snapshot.

**Tech Stack:** Laravel PHPUnit, Vue 3 + Vitest, existing Modal patterns.

## Global Constraints

- Fuel types: gnc, diesel, diesel_premium, nafta_super, nafta_premium
- Levels: low, medium, high
- Rates: Nafta 7/10/12 L; Diesel 6/8/10 L; GNC 7/9/11 m³ per 100km
- Snapshot immutable on trip edit
- fuel_abuse tickets; logged-in non-drivers only; no auto-suspend
- Legacy apps only

### Fuel price env vars

| Env var | Unit | Notes |
| --- | --- | --- |
| `MODULE_MAX_PRICE_FUEL_PRICE` | $/L | Legacy fallback (esp. nafta premium) |
| `MODULE_MAX_PRICE_FUEL_PRICE_NAFTA_SUPER` | $/L | |
| `MODULE_MAX_PRICE_FUEL_PRICE_NAFTA_PREMIUM` | $/L | Optional; falls back to `MODULE_MAX_PRICE_FUEL_PRICE` |
| `MODULE_MAX_PRICE_FUEL_PRICE_DIESEL` | $/L | |
| `MODULE_MAX_PRICE_FUEL_PRICE_DIESEL_PREMIUM` | $/L | |
| `MODULE_MAX_PRICE_FUEL_PRICE_GNC` | $/m³ | Default `500` |

See design: `docs/superpowers/specs/2026-11-19-vehicle-fuel-type-consumption-design.md`

---

### Task 1: FuelPricingResolver (backend)

**Files:**
- Create: `app/Helpers/FuelPricingResolver.php`
- Create: `tests/Unit/Helpers/FuelPricingResolverTest.php`
- Modify: `config/carpoolear.php`, `.env.example`

- [ ] RED: tests for resolve nafta/diesel/gnc rates + prices + legacy default
- [ ] GREEN: implement resolver + config keys
- [ ] Commit test then feat

### Task 2: TripPricingBreakdown snapshot-aware

**Files:**
- Modify: `app/Helpers/TripPricingBreakdown.php`
- Modify: `tests/Unit/Helpers/TripPricingBreakdownTest.php`

- [ ] RED: forTrip uses snapshot; units for GNC
- [ ] GREEN: minimal changes
- [ ] Commit

### Task 3: Schema + Car/Trip API

**Files:**
- Migrations for cars + trips
- Models, transformers, Car validation, TripRepository create/update, trip-info
- SupportTicket `fuel_abuse`

- [ ] RED/GREEN/REFACTOR per slice with commits

### Task 4–6: Frontend carFields, CarForm, gate modal, display, denuncia

- [ ] RED/GREEN/REFACTOR per slice with commits

### Task 7: Verify + PRs

- [ ] Lint + build frontend; backend tests; two linked PRs
