# Trip Creation Car + Seat Map Redesign

**Date:** 2026-08-06  
**Scope:** Legacy `carpoolear/` trip creation wizard (driver flow)

## Goal

Match mockups for:
1. **Car step** — custom vehicle dropdown + required 4/5 seat-layout cards
2. **Seats step** — toggleable seat map (min 1 offered); rear row 2 or 3 seats from layout

## Data mapping

| UI | Field |
|----|--------|
| 4 lugares | `seatLayoutCapacity = 4` → `rear_max_two_passengers = true`, max offered = 3 |
| 5 lugares | `seatLayoutCapacity = 5` → `rear_max_two_passengers = false`, max offered = 4 |
| Disponible seat count | `trip.total_seats` |
| Per-seat toggles | form `passengerSeatAvailability: boolean[]` (not sent to API) |

Defaults: layout **unset** until user picks; after pick, all passenger seats **ON**. Changing layout resets availability to all ON.

## Car step UI

- Custom select: car icon + `Marca Modelo · PATENTE` + chevron
- Link: “+ Agregar nuevo vehículo” → existing cars modal
- Layout cards with `4-seats.svg` / `5-seats.svg` (`currentColor`); one required
- Copy per mockup (i18n)

## Seats step UI (drivers)

- Question + explainer per mockup
- Grid: driver fixed; Acompañante; rear seats labeled 1…N
- Toggle ON/OFF; footer **Ofrecés N lugares** or **Ofrecé al menos un lugar**
- Cannot continue with 0; seat price block unchanged if enabled
- Passengers: keep existing numeric cupos UI

## Validation

- Car step: car + layout required
- Seats step: `total_seats >= 1` (existing) synced from availability

## Out of scope

- Passenger seat map
- Driver initial badge on layout SVG
