# DatePicker + full admin DS migration

**Date:** 2026-08-01  
**Status:** Approved

## Goal

Remove Bootstrap `form-control` from shared `DatePicker`, then migrate all Admin* leftover inputs/CTAs onto AppInput / AppField / AppTextarea / AppButton.

## Slice 1 — DatePicker

- Replace `form-control picker` / `form-control form-control-with-icon form-control-date` with semantic classes (`date-picker__surface`, `date-picker__surface--mobile`).
- Update selectors in `app-field.css`, wizard deep CSS, `base.css` / DatePicker scoped styles that target old class names.
- Wrap UpdateProfile birthday and AdminSearchTrips dates in AppField when not already nested.
- No date value / min-max / clear behavior changes.

## Slice 2 — All Admin* leftovers

Migrate `form-control` and Bootstrap primary/default CTAs in Admin* surfaces, including:

- Support: tickets list/detail/new, reply templates
- AdminSearchTrips
- Manual identity validation list/review, MP rejected validations
- Car brands/models/colors
- Changelogs
- Maintenance
- Users list/detail, migrations
- Trips admin, pagination bar, rating/reference cards

Phased TDD by area. Prefer AppField+borderless select / AppInput / AppTextarea / AppButton patterns already used in user-facing pages.

## Out of scope

- Non-admin pages already migrated
- New admin IA/layout
- Backend changes

## Success

- `DatePicker.vue` has no Bootstrap `form-control*` class strings
- Admin* editable fields/CTAs in scope use App* (no leftover user-facing `form-control` / `btn btn-primary` in those files except justified exceptions like file inputs using a dedicated class)
