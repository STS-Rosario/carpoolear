# Admin content card + page title

**Date:** 2026-08-02  
**Status:** Approved (follow-up to admin desktop spacing)  
**Repo:** `carpoolear`

## Problem

Admin main sections sit on bare page chrome. Page titles use Bootstrap/global `h2` styling (`color: #036686`), so they look like the old blue marketing headings instead of the dark regular page title used on Login (`AppPageTitle` / `--ds-text-primary`).

## Goals

1. Every admin main content section lives in a white card (DS card tokens).
2. Page titles use regular dark page-title styling (Login parity), not blue `h2`.
3. Apply via `AdminLayout` so all Admin* pages pick it up without per-page markup churn where possible.

## Approach

- Wrap `AdminLayout` content slot in `.admin-layout-card` using `--ds-card-bg`, `--ds-card-radius`, `--ds-card-shadow`, padded.
- Inside the card, style page headings / `.app-page-title` with `--ds-text-primary` and page-title size/weight (override global blue `h2`).
- Keep subsection hierarchy readable: `h2` / first-level titles match AppPageTitle; nested `h3` stay dark but slightly smaller.
- Out of scope: migrating every page to `<AppPageTitle>` markup in this pass (CSS parity is enough); Administración menu item.

## Success

- Manual verifications and other admin pages: content in a white card; title dark, not teal/blue.
- Layout spacing tests still pass; new assertions for card + title color.
