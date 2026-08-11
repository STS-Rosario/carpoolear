# Trip card verified shield (after trips count)

**Date:** 2026-08-02  
**Repo:** `carpoolear` (legacy Vue)  
**Out of scope:** backend, `carpoolear-nx`, chat/`UserNameWithBadge` consumers outside trip cards

## Goal

On trip cards (list + ongoing via `TripCardShell`), show a verified-account shield **after the trips count** on the meta row when the driver is verified. Do **not** show a verified badge next to the driver name (avoids clipping long names).

## Behavior

Meta row when verified:

`[thumbs ratings] | N viajes [shield]`

Meta row when not verified:

`[thumbs ratings] | N viajes`

- Shield only if `user.identity_validated` **or** `user.identity_validated_at`
- If trips count label is missing but user is verified, still show the shield after ratings (no orphan `|`)
- Icon: `fa-shield`, green (`--profile-verified` / `#2e7d32` or trip-card token)
- Accessibility: `title` + `aria-label` from `$t('usuarioVerificado')`
- Unverified: no shield node in the DOM

## Name row

- Trip cards must **not** show `UserNameWithBadge`’s check after the name
- Prefer rendering the driver name without the badge on the shell (e.g. plain name, or `UserNameWithBadge` with badge forced off), without changing global badge behavior for conversations / other screens

## Approach

Implement in `TripCardShell.vue` + `trip-card.css`. Both `Trip.vue` and `OngoingTripCard.vue` pick it up automatically.

No API changes — trip user already exposes `identity_validated_at` (and may expose `identity_validated`).

## Testing (TDD)

1. View test: shell shows shield after trips meta when verified; no shield when not
2. View test: name area does not include `identity-validated-badge` / check for trip card driver name
3. Optional CSS assertion for verified shield color class under trip-card styles
