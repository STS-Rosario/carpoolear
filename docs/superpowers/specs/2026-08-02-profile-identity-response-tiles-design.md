# Profile identity & response tiles

**Date:** 2026-08-02  
**Repo:** `carpoolear` (legacy Vue)  
**Out of scope:** backend changes, `carpoolear-nx`

## Goal

On the Perfil tab (own and other profiles), always show two status tiles matching the mock:

1. **Identity** — verified (green shield) or unverified copy  
2. **Response rate** — stats when available, otherwise placeholder copy  

## Behavior

### Identity (always visible)

| State | Title | Sub | Icon |
|-------|--------|-----|------|
| Verified | Identidad verificada | Verificó su DNI con Carpoolear | Green shield in grey circle |
| Unverified | Identidad no verificada | Este usuario aún debe verificar su identidad | Grey shield in grey circle |

Same third-person copy for own profile. Verified when `identity_validated` or `identity_validated_at`.

### Response (visible when `module_conversation_average_delay` is on)

| State | Title | Sub |
|-------|--------|-----|
| Has data | Responde el {n}% de los mensajes | Tiempo promedio: {delay} |
| No data | Sin datos de respuesta aún | Todavía no hay suficientes mensajes |

Hide the response tile entirely when the module is off.

### Layout

- Mobile + desktop: bordered rounded cards; desktop side-by-side  
- Icon in a light grey circular chip  

## Approach

Extend existing `ProfileInfo` tiles + `profile-page.css`; add i18n keys. No new components.

## Testing

- View/i18n tests for verified/unverified keys and always-visible identity tile  
- Placeholder response keys and module gate  
- Verified icon uses a green modifier class  
