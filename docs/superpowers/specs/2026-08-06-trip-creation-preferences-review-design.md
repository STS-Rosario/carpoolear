# Trip Creation Preferences + Review Steps Design

**Date:** 2026-08-06  
**Scope:** Legacy `carpoolear/` wizard (`STEP.DESCRIPTION`, `STEP.LAST_DETAILS`)

## Goal

Match mockups:

1. **Preferencias y detalles** — preferences toggles, friends autoaccept (drivers), required passenger comments  
2. **Revisá tu viaje** — summary with Editar links; drivers must check no-lucrar (Más info modal) before publish

Keep step numbers: `DESCRIPTION = 9`, `LAST_DETAILS = 10`.

## Preferences step (`STEP.DESCRIPTION`)

### Drivers

- Title: Preferencias y detalles  
- **Preferencias del viaje** (`preferenciasViaje` — replace “Características”; trip detail screens that reuse the key update too)
- Three toggle rows (icons + label + switch), order Infancias → Fumar → Mascotas:
  - Infancias copy (keep Infancias, not niños), binds `allow_kids`
  - Fumar → `allow_smoking`
  - Mascotas → `allow_animals`
- **Amigos**: autoaccept friends toggle + helper subtitle; binds `autoaccept_friends_requests`
- **Comentarios para los pasajeros** (required — no “Opcional”) + textarea (`trip.description`); empty fails validation (already required)

### Passengers

- Same preferences + required comment  
- Hide Amigos / autoaccept (same as today)

### Removed from last details

Preference cards and autoaccept move here; last details no longer hosts them.

## Review step (`STEP.LAST_DETAILS`)

### Header

- Title: Revisá tu viaje  
- Subtitle: Antes de publicarlo, chequeá que esté todo bien.

### Sections (each with Editar → `setCurrentStep`)

| Section | Content | Editar target | Visibility |
|---|---|---|---|
| Recorrido | Origin → destination (incl. intermediates if any) + date/time chips | `STEP.ORIGIN` | Always |
| Vehículo | Brand/model · plate | `STEP.CAR` | Drivers |
| Lugares disponibles | Seat count pill | `STEP.SEATS` | Always |
| Aporte | Formatted price + “por persona” | `STEP.CONTRIBUTION` | Drivers + seat-price module |
| Preferencias | Infancias / Fumar / Mascotas SI\|NO tags | `STEP.DESCRIPTION` | Always |

Comment text is not shown on review (editable via Preferencias → DESCRIPTION).

### No lucrar (drivers only)

- Compact commitment row: checkbox + “Me comprometo a no lucrar con el viaje”  
- Supporting line: collaborative copy + **Más info** link  
- Unchecked → publish disabled / submit blocked (existing `no_lucrar` validation)  
- **Más info** opens modal: title “¿Por qué no se puede lucrar?”, body explaining community / max contribution / tickets / account risk; **Cerrar** + X dismiss

### Passengers

- Same review sections minus Vehículo, Aporte, no-lucrar  
- Publish enabled when prior steps valid (no no-lucrar gate)

### Submit CTA

- Drivers: Publicar viaje (existing submit on last step)  
- Keep Atrás navigation

## i18n

- Update `preferenciasViaje` → Preferencias del viaje / Preferences  
- New/updated keys for preferences title, toggle labels (Infancias), friends helper, comments section (required), review titles/sections/Editar/Más info modal, SI/NO tags  
- Preserve Infancias wording in ES locales (`tripInfanciasLabels` still applies)

## Out of scope

- Backend payload changes  
- Changing contribution / car / seats step internals beyond Editar navigation targets  
- Showing description body on the review summary
