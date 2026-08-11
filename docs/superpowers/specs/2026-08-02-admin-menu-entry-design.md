# Admin entry in profile menu + Mi cuenta

**Date:** 2026-08-02  
**Status:** Approved (placement A)  
**Repo:** `carpoolear`

## Goal

Admins (`user.is_admin`) can open Administración from:

1. **Desktop** header profile dropdown — after **Ayuda**, still above the logout divider (same middle nav block).
2. **Mobile** **Mi cuenta** — a dedicated Administración row/section linking to the admin dashboard.

## Behavior

- Label: `$t('administracion')` (existing i18n).
- Route: `{ name: 'admin-dashboard' }`.
- Icon: `fa-cogs` (matches admin chrome weight; not the same as Configuración’s `fa-cog`).
- Hidden for non-admins.

## Out of scope

- Desktop MyAccountNav sidebar (desktop entry is the header dropdown).
- Admin IA / layout changes.

## Success

- Source/unit tests assert dropdown order (Ayuda → Administración → divider → logout) and `v-if` on `user.is_admin`.
- Mobile sections include Administración only when `isAdmin` is true.
