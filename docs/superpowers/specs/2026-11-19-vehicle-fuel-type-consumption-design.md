# Vehicle Fuel Type & Consumption

**Date:** 2026-11-19  
**Branches:** `feat/vehicle-fuel-type-consumption` in `carpoolear/` and `carpoolear_backend/`  
**Out of scope:** `carpoolear-nx/`, automatic suspension, Chile Copec pricing path, backfilling existing cars/trips, separate consumption tables for premium vs non-premium within the same family

## Goal

Drivers must choose fuel type and consumption level on each car. New trips snapshot the resolved pricing inputs so passenger-facing estimates stay stable. Trip detail and contribution breakdown show fuel data and a `fuel_abuse` denuncia path for logged-in non-drivers.

## Decisions

| Topic | Choice |
| --- | --- |
| Fuel types | `gnc`, `diesel`, `diesel_premium`, `nafta_super`, `nafta_premium` |
| Consumption levels | `low`, `medium`, `high` |
| Nafta rates (L/100km) | 7 / 10 / 12 |
| Diesel family rates (L/100km) | 6 / 8 / 10 (shared by diesel + diesel_premium) |
| GNC rates (m³/100km) | 7 / 9 / 11 |
| Pricing snapshot | Full snapshot on trip create: type, level, price/unit, consumption/100, unit |
| Trip edit | Never rewrite fuel snapshot; recalc distance/tolls using existing snapshot |
| Legacy trips | Null snapshot → nafta premium + medium (10 L/100km) via existing defaults |
| Missing fuel on create | Gate with modal; save onto car; block continue until set |
| Suspension copy | Deterrent only; no auto-suspend |
| Denuncia | New ticket type `fuel_abuse`; logged-in non-drivers only |
| Delivery | Two coordinated PRs (backend + frontend), TDD red/green/refactor commits |

## Architecture

### Backend (`carpoolear_backend/`)

**FuelPricingResolver** maps `(fuel_type, fuel_consumption)` → `{ price_per_unit, consumption_per_100, unit, fuel_type, fuel_consumption }` using config prices and fixed rate tables.

**Car columns (nullable for legacy):** `fuel_type`, `fuel_consumption` — required on create/update.

**Trip snapshot columns:** `fuel_type`, `fuel_consumption`, `fuel_price_per_unit`, `fuel_consumption_per_100`, `fuel_unit` (`liter` \| `m3`).

**Config prices (env):**
- `MODULE_MAX_PRICE_FUEL_PRICE_NAFTA_SUPER`
- `MODULE_MAX_PRICE_FUEL_PRICE_NAFTA_PREMIUM` (legacy `MODULE_MAX_PRICE_FUEL_PRICE` aliases this)
- `MODULE_MAX_PRICE_FUEL_PRICE_DIESEL`
- `MODULE_MAX_PRICE_FUEL_PRICE_DIESEL_PREMIUM`
- `MODULE_MAX_PRICE_FUEL_PRICE_GNC`

**TripPricingBreakdown / trip-info / create:** use resolved or snapshotted price + rate. `forTrip()` prefers trip snapshot when present.

**Formula:** `fuel_cost = distance_km × (price_per_unit × consumption_per_100 / 100)`  
Equivalent km-per-unit = `100 / consumption_per_100`.

### Frontend (`carpoolear/`)

- Car form: subtitle “Información del combustible”; required selects; explainer about suspensión
- Trip create gate modal: “Necesitamos unos datos más de tu vehículo” + same paragraph; saves to car
- Trip detail car info + contribution breakdown: fuel type/consumption + “Denunciar abuso” + info tooltip
- Ticket category `fuel_abuse` with prefilled trip/fuel context

## Data flow

```text
car fuel_type + fuel_consumption
  → FuelPricingResolver (current config prices + rate tables)
  → trip-info preview (optional car_id)
  → trip create: write snapshot once + compute recommended/max
  → trip edit: reuse snapshot fuel inputs
  → detail / breakdown: display snapshot (legacy default if null)
```

## Testing

TDD with `test(api|web):` → `feat(api|web):` → optional `refactor:` commits. Finish with frontend lint+build and backend test suite; open two linked PRs.
