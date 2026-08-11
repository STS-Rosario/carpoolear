# Admin desktop layout spacing

**Date:** 2026-08-02  
**Status:** Approved (via follow-up screenshots / spacing notes)  
**Repo:** `carpoolear` (legacy Vue frontend)

## Problem

Admin desktop screens show excess empty space and awkward chrome:

1. Large gap under the global header (double top offset: `admin-nav` and `admin-layout-content` both use ~72px `margin-top` on top of view-container header padding).
2. Large horizontal gap between sidebar and main content (nested Bootstrap `container` + `col-md-offset-*` inside `col-md-20`).
3. Needless horizontal scroll when content would fit (`overflow-x: auto` on an over-wide nested grid).
4. AdminPaginationBar “Ítems por página” stretches full content width when the pager is hidden.
5. Admin user profile action/nav buttons sit flush after AppButton migration (CSS still targets `.btn`).

## Goals

1. Compact, aligned admin shell: modest top spacing after the app header; sidebar close to content.
2. No horizontal scrollbar on desktop when content fits.
3. Pagination per-page control is content-sized (`fit-content` / auto width).
4. Button clusters in admin user profile (and other leftover `.btn`-margin clusters) use flex gap for AppButton.

## Approach

### AdminLayout + adminNav

- Desktop shell: flex row with fixed-width sidebar (~240px) and fluid content (`flex: 1; min-width: 0`).
- Single modest top spacing on the shell (not duplicated on nav + content).
- Neutralize nested `.container` width and `col-md-offset-*` margins inside `.admin-layout-content`.
- Keep overflow-x as a safety for truly wide tables, without forcing scroll from layout chrome.

### AdminPaginationBar

- Bar and per-page AppField size to content (`width: fit-content` / `auto`), not stretch to 100% when alone.

### Button clusters

- Replace `.user-admin-view-nav .btn` / `.user-admin-view-actions .btn` margins with flex + gap on those wrappers (target `.app-button`).
- Spot-check other admin clusters still using `.btn` adjacent margins.

## Out of scope

- Administración entry in profile / Mi cuenta menus (separate spec).
- Full admin visual redesign / new IA.

## Success

- Manual verifications / users / dashboard: no large empty band under header; content starts near sidebar.
- Per-page select fits its control; does not span the content column alone.
- Admin user detail nav/action AppButtons have visible gaps.
- Source tests cover layout spacing, pagination width, and button gap selectors.
