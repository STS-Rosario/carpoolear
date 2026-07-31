# Trip Card Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship one unified trip card (mobile + desktop) with thumbs ratings, punto de partida/llegada labels, seats pill, date/time chips, and Ver detalle — shared by list cards and OngoingTripCard.

**Architecture:** Extract `TripCardShell.vue` + `trip-card.css`. Pure helpers in `tripCardDisplay.js` for seats pill + date/time labels. `Trip.vue` and `OngoingTripCard.vue` compose the shell; Trip keeps sellado / seat controls / visibility / modal as slots or wrappers. Drop light/default layout forks on cards.

**Tech Stack:** Vue 3 Options API, Vitest source/string tests, existing `UserRatingsCounts` / `UserNameWithBadge` / `AppButton`, dayjs, design tokens (`--ds-*`).

**Spec:** `docs/superpowers/specs/2026-07-31-trip-card-redesign-design.md`

**Repo root for all paths:** `carpoolear/` (legacy frontend). Do **not** edit `carpoolear-nx/`.

## Global Constraints

- Same card structure on mobile and desktop (spacing tweaks OK; no alternate component).
- Ratings: `UserRatingsCounts` thumbs only — no smileys, no `trip_stars` on the card.
- Profile clicks: avatar, name, ratings (`@click.stop`). Trip clicks: card body + Ver detalle.
- Reuse i18n keys: `puntoDePartida`, `puntoDeLlegada`, `verDetalle`, `perfilViajesParticipados`, `Carpooleado`, `Lugar`, `Lugares`.
- TDD: failing test → implement → pass → commit each logical step (`test:` / `feat:` prefixes).
- Keep Trip sellado, seat-request limit warning, `enableChangeSeats`, `clickModal`, grid classes.

---

## File map

| File | Responsibility |
|------|----------------|
| `src/utils/tripCardDisplay.js` | Seats pill tone/label; date/time chip formatters |
| `src/utils/tripCardDisplay.test.js` | Unit tests for helpers |
| `src/styles/components/trip-card.css` | Shell layout, seats tones, route, chips, CTA |
| `src/styles/tripCard.styles.test.js` | CSS contract tests |
| `src/styles/main.css` | Import `trip-card.css` |
| `src/components/elements/TripCardShell.vue` | Presentational shell |
| `src/components/elements/TripCardShell.view.test.js` | Markup/event contract |
| `src/components/elements/OngoingTripCard.vue` | Compose shell + live share |
| `src/components/elements/OngoingTripCard.view.test.js` | Update expectations |
| `src/components/sections/Trip.vue` | Compose shell; keep Trip-only extras |
| `src/components/sections/Trip.view.test.js` | Update + new shell/ratings assertions |

---

### Task 1: `tripCardDisplay` helpers (TDD)

**Files:**
- Create: `src/utils/tripCardDisplay.js`
- Create: `src/utils/tripCardDisplay.test.js`

**Interfaces:**
- Produces:
  - `getSeatsPillTone(seatsAvailable: number): 'full' | 'low' | 'medium' | 'high'`
  - `getSeatsPillLabel(seatsAvailable: number, t: (key: string) => string): string`
  - `formatTripCardDate(tripDate: string|Date, dayjsFn): string` → e.g. `Dom, 14 Dic`
  - `formatTripCardTime(tripDate: string|Date, dayjsFn): string` → e.g. `16:30 hs`

- [ ] **Step 1: Write failing tests**

```js
import { describe, expect, it } from 'vitest';
import {
    getSeatsPillTone,
    getSeatsPillLabel,
    formatTripCardDate,
    formatTripCardTime
} from './tripCardDisplay.js';
import dayjs from '../dayjs';

describe('getSeatsPillTone', () => {
    it('maps seat counts to tones', () => {
        expect(getSeatsPillTone(0)).toBe('full');
        expect(getSeatsPillTone(1)).toBe('low');
        expect(getSeatsPillTone(2)).toBe('medium');
        expect(getSeatsPillTone(3)).toBe('high');
        expect(getSeatsPillTone(4)).toBe('high');
    });
});

describe('getSeatsPillLabel', () => {
    const t = (key) =>
        ({ Carpooleado: 'Carpooleado', Lugar: 'Lugar', Lugares: 'Lugares' })[key];

    it('uses Carpooleado when full', () => {
        expect(getSeatsPillLabel(0, t)).toBe('Carpooleado');
    });

    it('uses singular and plural lugar labels', () => {
        expect(getSeatsPillLabel(1, t)).toBe('1 lugar');
        expect(getSeatsPillLabel(3, t)).toBe('3 lugares');
    });
});

describe('formatTripCardDate / formatTripCardTime', () => {
    it('formats date and time chips', () => {
        const d = '2025-12-14T16:30:00';
        expect(formatTripCardDate(d, dayjs)).toMatch(/14/);
        expect(formatTripCardTime(d, dayjs)).toBe('16:30 hs');
    });

    it('returns empty string for missing dates', () => {
        expect(formatTripCardDate(null, dayjs)).toBe('');
        expect(formatTripCardTime(null, dayjs)).toBe('');
    });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `npm run test:unit -- --run src/utils/tripCardDisplay.test.js`  
Expected: FAIL (module missing)

- [ ] **Step 3: Implement helpers**

```js
export function getSeatsPillTone(seatsAvailable) {
    const n = Number(seatsAvailable) || 0;
    if (n <= 0) return 'full';
    if (n === 1) return 'low';
    if (n === 2) return 'medium';
    return 'high';
}

export function getSeatsPillLabel(seatsAvailable, t) {
    const n = Number(seatsAvailable) || 0;
    if (n <= 0) return t('Carpooleado');
    if (n === 1) return `1 ${String(t('Lugar')).toLowerCase()}`;
    return `${n} ${String(t('Lugares')).toLowerCase()}`;
}

export function formatTripCardDate(tripDate, dayjsFn) {
    if (!tripDate) return '';
    const formatted = dayjsFn(tripDate).format('ddd, D MMM');
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatTripCardTime(tripDate, dayjsFn) {
    if (!tripDate) return '';
    return `${dayjsFn(tripDate).format('HH:mm')} hs`;
}
```

- [ ] **Step 4: Run tests — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add src/utils/tripCardDisplay.js src/utils/tripCardDisplay.test.js
git commit -m "$(cat <<'EOF'
test: add trip card display helpers for seats and schedule chips

EOF
)"
```

(If repo TDD prefers separate `test:` then `feat:` commits, split: first commit tests-only only if red is already committed; otherwise one `feat:` with tests is fine when both land together after green. Prefer: `test:` commit of failing test is awkward in git — use `feat: add trip card display helpers` including tests after green, OR follow local convention of `test:` then `feat:` amend-free sequential commits where the first commit is the test file asserting desired API and second adds implementation. Follow user rule: TDD commits with test/feat prefixes without asking.)

Preferred commit sequence:
1. After writing failing test only: `git commit -m "test: trip card display helper contracts"`
2. After implementation: `git commit -m "feat: implement trip card display helpers"`

---

### Task 2: `trip-card.css` + import (TDD)

**Files:**
- Create: `src/styles/components/trip-card.css`
- Create: `src/styles/tripCard.styles.test.js`
- Modify: `src/styles/main.css` (add `@import url('./components/trip-card.css');` near other component imports)

**Interfaces:**
- Produces CSS classes used by shell:
  - `.trip-card-shell`
  - `.trip-card-shell__seats--full|low|medium|high`
  - `.trip-card-shell__route-label`
  - `.trip-card-shell__chip`
  - `.trip-card-shell__detail`

- [ ] **Step 1: Write failing style test**

```js
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const css = fs.readFileSync(
    path.resolve(__dirname, 'components/trip-card.css'),
    'utf8'
);
const mainCss = fs.readFileSync(path.resolve(__dirname, 'main.css'), 'utf8');

describe('trip card styles', () => {
    it('defines shell layout, seats tones, route labels, chips and detail CTA', () => {
        expect(css).toContain('.trip-card-shell');
        expect(css).toContain('.trip-card-shell__seats--high');
        expect(css).toContain('.trip-card-shell__seats--medium');
        expect(css).toContain('.trip-card-shell__seats--low');
        expect(css).toContain('.trip-card-shell__seats--full');
        expect(css).toContain('.trip-card-shell__route-label');
        expect(css).toContain('.trip-card-shell__chip');
        expect(css).toContain('.trip-card-shell__detail');
    });

    it('is imported from main.css', () => {
        expect(mainCss).toContain('./components/trip-card.css');
    });
});
```

- [ ] **Step 2: Run — expect FAIL**

Run: `npm run test:unit -- --run src/styles/tripCard.styles.test.js`

- [ ] **Step 3: Add CSS + import**

Create white card with border/radius using tokens (`--ds-neutral-bg`, `--ds-text-primary`, `--ds-action`, success/warning/error for seats). Include:
- flex header with seats pill absolute/top-right
- route column with hollow circle / line / solid dot
- date/time chips stacked
- full-width primary detail button
- `#actions-extra` gap

Map tones:
- `--high` → `--ds-success-bg` / `--ds-success-text`
- `--medium` → `--ds-warning-bg` / `--ds-warning-solid`
- `--low` → `--ds-error-bg` / `--ds-error-solid`
- `--full` → muted/neutral

- [ ] **Step 4: Run — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add src/styles/components/trip-card.css src/styles/tripCard.styles.test.js src/styles/main.css
git commit -m "$(cat <<'EOF'
feat: add trip card shell styles

EOF
)"
```

(Use `test:` then `feat:` if splitting.)

---

### Task 3: `TripCardShell.vue` (TDD)

**Files:**
- Create: `src/components/elements/TripCardShell.vue`
- Create: `src/components/elements/TripCardShell.view.test.js`

**Interfaces:**
- Props:
  - `user: Object|null`
  - `ratings: { positive, neutral, negative }|null`
  - `tripsCountLabel: string` (already i18n-formatted or empty)
  - `seatsAvailable: number`
  - `fromCity`, `fromRegion`, `toCity`, `toRegion: string`
  - `dateLabel`, `timeLabel: string`
  - `showSeatsPill: boolean` (default true; ongoing may hide if desired — default show when seats known)
- Emits: `profile-click`, `detail-click`
- Slots: `actions-extra`, `body-extra`, `footer-extra`

- [ ] **Step 1: Write failing view test**

```js
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewSource = fs.readFileSync(
    path.resolve(__dirname, 'TripCardShell.vue'),
    'utf8'
);

describe('TripCardShell.vue', () => {
    it('renders ratings thumbs, route labels, seats and detail CTA', () => {
        expect(viewSource).toContain('UserRatingsCounts');
        expect(viewSource).toContain('UserNameWithBadge');
        expect(viewSource).toContain("$t('puntoDePartida')");
        expect(viewSource).toContain("$t('puntoDeLlegada')");
        expect(viewSource).toContain("$t('verDetalle')");
        expect(viewSource).toContain('trip-card-shell__route-label');
        expect(viewSource).toContain('getSeatsPillTone');
        expect(viewSource).toContain('getSeatsPillLabel');
    });

    it('routes profile vs detail clicks separately', () => {
        expect(viewSource).toMatch(/@click\.stop(?:\.prevent)?="onProfileClick"|v-on:click\.stop="onProfileClick"/);
        expect(viewSource).toContain('$emit(\'profile-click\'');
        expect(viewSource).toContain('$emit(\'detail-click\'');
        expect(viewSource).toContain('trip-card-shell__detail');
    });

    it('exposes actions-extra and body-extra slots', () => {
        expect(viewSource).toContain('name="actions-extra"');
        expect(viewSource).toContain('name="body-extra"');
    });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement shell**

Structure (template outline):

```vue
<template>
  <div class="trip-card-shell" @click="$emit('detail-click', $event)">
    <div class="trip-card-shell__header">
      <div v-if="user" class="trip-card-shell__driver" @click.stop="onProfileClick">
        <div class="trip-card-shell__avatar circle-box" v-imgSrc:profile="user.image"></div>
        <div>
          <div class="trip-card-shell__name"><UserNameWithBadge :user="user" /></div>
          <div class="trip-card-shell__meta">
            <UserRatingsCounts :ratings="ratings" />
            <span v-if="tripsCountLabel" class="trip-card-shell__trips">| {{ tripsCountLabel }}</span>
          </div>
        </div>
      </div>
      <div
        v-if="showSeatsPill"
        class="trip-card-shell__seats"
        :class="'trip-card-shell__seats--' + seatsTone"
      >
        <i class="fa fa-user" aria-hidden="true"></i>
        {{ seatsLabel }}
      </div>
    </div>

    <div class="trip-card-shell__body">
      <div class="trip-card-shell__route">
        <!-- graphic + labels + cities -->
        <div class="trip-card-shell__endpoint">
          <span class="trip-card-shell__route-label">{{ $t('puntoDePartida') }}</span>
          <span class="trip-card-shell__city">{{ fromCity }}</span>
          <span class="trip-card-shell__region">{{ fromRegion }}</span>
        </div>
        <div class="trip-card-shell__endpoint">
          <span class="trip-card-shell__route-label">{{ $t('puntoDeLlegada') }}</span>
          <span class="trip-card-shell__city">{{ toCity }}</span>
          <span class="trip-card-shell__region">{{ toRegion }}</span>
        </div>
      </div>
      <div class="trip-card-shell__schedule" v-if="dateLabel || timeLabel">
        <div v-if="dateLabel" class="trip-card-shell__chip">
          <i class="fa fa-calendar" aria-hidden="true"></i> {{ dateLabel }}
        </div>
        <div v-if="timeLabel" class="trip-card-shell__chip">
          <i class="fa fa-clock-o" aria-hidden="true"></i> {{ timeLabel }}
        </div>
      </div>
    </div>

    <slot name="body-extra" />

    <div class="trip-card-shell__footer">
      <slot name="actions-extra" />
      <button
        type="button"
        class="trip-card-shell__detail"
        @click.stop="$emit('detail-click', $event)"
      >
        {{ $t('verDetalle') }}
      </button>
      <slot name="footer-extra" />
    </div>
  </div>
</template>
```

Wire computeds for `seatsTone` / `seatsLabel` via helpers + `this.$t`. Use `AppButton` variant primary **only if** existing styles match full-width mockup; otherwise plain button styled in `trip-card.css` is fine.

- [ ] **Step 4: Run — expect PASS**

- [ ] **Step 5: Commit** (`test:` then `feat:` for shell)

---

### Task 4: Wire `OngoingTripCard` to shell (TDD)

**Files:**
- Modify: `src/components/elements/OngoingTripCard.view.test.js`
- Modify: `src/components/elements/OngoingTripCard.vue`

**Interfaces:**
- Consumes: `TripCardShell` props/emits/slots from Task 3
- Consumes: `getTripLocationLabels`, existing ratings/trips/date helpers — prefer shell date via `formatTripCardDate/Time` for consistency with mockup chips
- Keeps: `viajeEnProgreso` heading, live-share `router-link` in `#actions-extra`

- [ ] **Step 1: Update tests to require shell (expect FAIL until wired)**

Replace layout assertions:

```js
it('shows the ongoing trip heading and uses TripCardShell', () => {
    expect(viewSource).toContain('viajeEnProgreso');
    expect(viewSource).toContain('TripCardShell');
    expect(viewSource).toContain('getTripLocationLabels');
});

it('shows driver info, schedule and actions via shell', () => {
    expect(viewSource).toContain('TripCardShell');
    expect(viewSource).toContain('compartirUbicacionTiempoReal');
    expect(viewSource).toContain('compartiendoUbicacionTiempoReal');
    expect(viewSource).toContain('isSharingLiveLocation');
    expect(viewSource).toContain('loadLiveShareStatus');
    expect(viewSource).toContain('verDetalle'); // via shell or still explicit
    expect(viewSource).toContain("name: 'trip_live_share'");
    expect(viewSource).toContain('shouldShowLiveLocationShare');
    expect(viewSource).toContain('showShareLocationLink');
    expect(viewSource).toContain('name="actions-extra"');
});

// Remove obsolete `.ongoing-trip-card__driver-meta :deep(...)` assertion OR retarget to shell class if still needed
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Refactor OngoingTripCard template to compose shell**

- Pass `trip.user`, `driverRatings`, `driverTripsLabel` (without leading `|` — shell adds separator), locations, date/time from `formatTripCard*`, `seatsAvailable: trip.seats_available`
- `@profile-click` → `router.push({ name: 'profile', params: { id: trip.user.id } })` (match existing profile route name used in Trip.vue `goToProfile`)
- `@detail-click` → navigate to `detail_trip` (same as current detail link)
- Slot live-share into `actions-extra`
- Remove old scoped layout CSS that duplicates shell; keep heading + thin ongoing accent wrapper if desired (`ongoing-trip` max-width)

Check `Trip.vue` `goToProfile` for exact route name and reuse the same.

- [ ] **Step 4: Run OngoingTripCard tests — expect PASS**

- [ ] **Step 5: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat: use TripCardShell on OngoingTripCard

EOF
)"
```

---

### Task 5: Wire `Trip.vue` list card to shell (TDD)

**Files:**
- Modify: `src/components/sections/Trip.view.test.js`
- Modify: `src/components/sections/Trip.vue`

**Interfaces:**
- Consumes: `TripCardShell`
- Keep wrapper: `tripCardCountClass`, `trip-needs-sellado`, outer `.trip` click → `clickModal ? openModal() : goToDetail(false)`
- Shell `@detail-click` should call same as card click (stopPropagation on shell root if outer also listens — prefer: remove duplicate by having outer click handler OR shell only; avoid double navigation). Recommended: keep `@click` on `.trip`, make shell root not emit bubble issues — shell `@click` on root can `$emit('detail-click')` and parent handler calls `goToDetail`/`openModal`; **remove** redundant click on `.trip` OR make shell the only click target. Simplest: parent passes `@detail-click="onDetail"` and does **not** also bind click on wrapping `.trip` for navigation (except keep class hooks). Preserve tests that look for `class="trip"` + clickModal pattern — update tests to match new wiring if click moves to shell.

- [ ] **Step 1: Extend Trip.view.test.js**

Add:

```js
describe('Trip card redesign shell', () => {
    it('uses TripCardShell with thumbs ratings and route labels', () => {
        expect(source).toContain('TripCardShell');
        expect(source).toContain('UserRatingsCounts'); // via shell import chain — assert TripCardShell and no trip_stars block
        expect(source).not.toContain("icon="'star'");
        expect(source).not.toContain('tripCardTheme === \'light\'');
    });

    it('keeps sellado, seat limit warning and clickModal behavior', () => {
        expect(source).toContain('showSelladoPending');
        expect(source).toContain('shouldShowDriverSeatRequestLimitWarning');
        expect(source).toMatch(/clickModal:\s*\{[\s\S]*?type:\s*Boolean/);
    });
});
```

Update any assertions that required light-theme markup or old `trip_driver_ratings` count text if they break.

Visibility tooltip tests: if visibility icons move into `#body-extra` / header slot, keep `visibilidadPublico` title assertion working.

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Replace card panel markup with TripCardShell**

Inside `.trip` / panel:

```vue
<TripCardShell
  :user="trip.user"
  :ratings="driverRatings"
  :trips-count-label="driverTripsLabel"
  :seats-available="seats_available"
  :from-city="locationLabels.fromCity"
  ...
  :date-label="cardDateLabel"
  :time-label="cardTimeLabel"
  @profile-click="goToProfile"
  @detail-click="onShellDetailClick"
>
  <template #body-extra>
    <!-- sellado legend, seat request warning, visibility if needed, seat controls -->
  </template>
  <template #footer-extra>
    <!-- enableChangeSeats controls if they were in footer -->
  </template>
</TripCardShell>
```

Add computeds mirroring OngoingTripCard for ratings / trips / locations (`getTripLocationLabels`) / date chips. Remove `tripCardTheme` template branches for layout. Keep `tripCardClass` only if still useful; otherwise drop theme class.

`onShellDetailClick(event)`:
```js
if (event && event.stopPropagation) event.stopPropagation();
if (this.clickModal) this.openModal();
else this.goToDetail(false);
```

Ensure profile still `stopPropagation` via shell.

Preserve `enableChangeSeats` UI in a slot.

- [ ] **Step 4: Run Trip.view.test.js + related tests — expect PASS**

Also run:  
`npm run test:unit -- --run src/components/sections/Trip.view.test.js src/components/elements/OngoingTripCard.view.test.js src/components/elements/TripCardShell.view.test.js src/utils/tripCardDisplay.test.js src/styles/tripCard.styles.test.js`

- [ ] **Step 5: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat: redesign list Trip cards with TripCardShell

EOF
)"
```

---

### Task 6: Visual verify + polish

**Files:** possibly CSS tweaks in `trip-card.css` / deep selectors for `UserRatingsCounts` spacing

- [ ] **Step 1:** Open trips list on mobile width via Chrome DevTools MCP (`http://localhost:8081/` or current Vite port); confirm thumbs, labels, seats tones, Ver detalle, profile vs detail clicks.
- [ ] **Step 2:** Desktop width same card structure.
- [ ] **Step 3:** Confirm ongoing card on home still shows live share + shell.
- [ ] **Step 4:** Fix spacing/alignment issues found; add/adjust style tests if new classes appear.
- [ ] **Step 5: Commit** polish if needed: `fix: polish trip card shell spacing`

---

## Spec coverage check

| Spec requirement | Task |
|------------------|------|
| Shared shell mobile+desktop | 3–5 |
| Thumbs ratings | 3, 5 |
| Punto de partida/llegada | 3 |
| Profile vs trip clicks | 3–5 |
| Seats pill tones | 1–3 |
| Ongoing + live share | 4 |
| Drop light/default card fork | 5 |
| CSS module + tokens | 2 |
| TDD tests listed in spec | 1–5 |

## Placeholder scan

No TBD steps; helpers, classes, and commit messages specified.
