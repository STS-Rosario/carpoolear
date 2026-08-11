# Trip Detail Desktop Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle desktop trip detail (≥768px) as a single card that reuses the mobile redesign components, with two-column DETALLE, seats|passengers above contribution|CTAs, and the map inside the card.

**Architecture:** Show one `.trip-detail__stack` for both breakpoints (when `trip && !isPassengersView`). Mobile keeps today’s single-column section order via mobile-only blocks. Desktop adds card chrome + CSS grids and desktop-only rows. Remove the legacy `v-if="!isMobile"` column tree once the shared stack covers desktop.

**Tech Stack:** Vue 3 Options API, Vitest source/style tests, existing `trip-detail.css` + `--ds-card-*` tokens.

**Spec:** `docs/superpowers/specs/2026-08-01-trip-detail-desktop-design.md`

## Global Constraints

- Desktop ≥768px (`!isMobile`); mobile ≤767px stack order and CTA rules stay as today’s redesign.
- CTA visibility/business rules unchanged.
- Condiciones on desktop DETALLE row exclude price; price only in contribución column.
- Map is the last block **inside** the card on desktop.
- Do not edit `carpoolear-nx/`.
- TDD: `test:` then `feat:`/`fix:` commits in `carpoolear/`.
- Prefer CSS + light markup wrappers; do not rewrite Leaflet.

## File map

| File | Responsibility |
|------|----------------|
| `src/components/views/Trip.vue` | Shared stack for mobile+desktop; desktop wrappers; remove legacy column tree |
| `src/components/views/Trip.view.test.js` | Stack gating, desktop section order, no legacy `TripLocation` path |
| `src/styles/components/trip-detail.css` | Card shell, desktop grids, grey driver band on desktop |
| `src/styles/tripDetail.styles.test.js` | CSS contracts for card + grids |
| `src/components/elements/TripSeats.vue` | Optional compact class for desktop lugares libres column (only if needed) |
| `src/language/i18n.js` | Section title for lugares libres if a new key is required (prefer existing `lugaresLibres`) |

---

### Task 1: Desktop CSS contracts (card + grids)

**Files:**
- Modify: `src/styles/tripDetail.styles.test.js`
- Modify: `src/styles/components/trip-detail.css`

**Interfaces:**
- Produces CSS hooks (no JS yet):
  - `.trip-detail--desktop` root modifier styles
  - `.trip-detail__card` card surface using `--ds-card-bg`, `--ds-card-radius`, `--ds-card-shadow`
  - `.trip-detail__detalle-grid`, `.trip-detail__seats-passengers`, `.trip-detail__price-cta` as two-column grids at `min-width: 768px`

- [ ] **Step 1: Write the failing test**

Append to `src/styles/tripDetail.styles.test.js`:

```js
describe('trip detail desktop card layout', () => {
    it('defines desktop card shell and two-column grids', () => {
        expect(css).toContain('.trip-detail--desktop');
        expect(css).toContain('.trip-detail__card');
        expect(css).toMatch(
            /\.trip-detail__card\s*\{[^}]*border-radius:\s*var\(--ds-card-radius/
        );
        expect(css).toMatch(
            /\.trip-detail__card\s*\{[^}]*box-shadow:\s*var\(--ds-card-shadow/
        );
        expect(css).toMatch(
            /\.trip-detail__card\s*\{[^}]*background:\s*var\(--ds-card-bg/
        );
        expect(css).toContain('.trip-detail__detalle-grid');
        expect(css).toContain('.trip-detail__seats-passengers');
        expect(css).toContain('.trip-detail__price-cta');
        expect(css).toMatch(
            /@media\s*\(min-width:\s*768px\)[\s\S]*\.trip-detail__detalle-grid\s*\{[^}]*grid-template-columns:\s*1fr\s*1fr/
        );
        expect(css).toMatch(
            /@media\s*\(min-width:\s*768px\)[\s\S]*\.trip-detail__seats-passengers\s*\{[^}]*grid-template-columns:\s*1fr\s*1fr/
        );
        expect(css).toMatch(
            /@media\s*\(min-width:\s*768px\)[\s\S]*\.trip-detail__price-cta\s*\{[^}]*grid-template-columns:\s*1fr\s*1fr/
        );
        expect(css).toMatch(
            /\.trip-detail--desktop\s+\.trip-driver\s*\{[^}]*background:\s*var\(--trip-detail-driver-bg/
        );
    });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd carpoolear && npx vitest run src/styles/tripDetail.styles.test.js`

Expected: FAIL — missing `.trip-detail--desktop` / grid selectors.

- [ ] **Step 3: Write minimal CSS**

Update the file header comment in `trip-detail.css` to note mobile + desktop layers.

Add tokens reuse on a shared root when useful, then desktop rules (keep all existing `.trip-detail--mobile` rules intact):

```css
.trip-detail.trip-detail--desktop {
    --trip-detail-canvas: #fff;
    --trip-detail-driver-bg: #f0f0f0;
    --trip-detail-divider: #e6e6e6;
    --trip-detail-label: #888;
    font-family: var(--ds-font-family);
    font-weight: var(--ds-font-weight-normal, 400);
    color: var(--ds-text-primary, #333);
    box-sizing: border-box;
}

.trip-detail--desktop .trip-detail__card {
    width: 100%;
    box-sizing: border-box;
    background: var(--ds-card-bg);
    border-radius: var(--ds-card-radius);
    box-shadow: var(--ds-card-shadow);
    overflow: hidden;
}

.trip-detail--desktop .trip-detail__stack {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0;
}

.trip-detail--desktop .trip-driver {
    background: var(--trip-detail-driver-bg);
    border-bottom: 1px solid #d6d4cf;
}

.trip-detail__detalle-grid,
.trip-detail__seats-passengers,
.trip-detail__price-cta {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    box-sizing: border-box;
}

@media (min-width: 768px) {
    .trip-detail__detalle-grid,
    .trip-detail__seats-passengers,
    .trip-detail__price-cta {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem 2rem;
        align-items: start;
    }
}

.trip-detail--desktop .trip-detail__section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--trip-detail-divider);
    background: var(--trip-detail-canvas);
    box-sizing: border-box;
}

.trip-detail--desktop .trip-detail__section-title {
    margin: 0;
    font-size: 0.875rem;
    font-weight: var(--ds-font-weight-normal, 400);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--trip-detail-label);
}

.trip-detail--desktop .trip-route-map {
    width: 100%;
    height: 420px;
    margin: 0;
    border-radius: 0;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd carpoolear && npx vitest run src/styles/tripDetail.styles.test.js`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/styles/tripDetail.styles.test.js src/styles/components/trip-detail.css
git commit -m "test: add desktop trip-detail card and grid CSS contracts"
```

If CSS was added in the same change set as the failing-then-passing cycle, prefer:

```bash
git commit -m "feat: add desktop trip-detail card and grid styles"
```

(Use `test:` only when committing red tests alone; this repo’s TDD practice allows `feat:` when green in one commit after red locally.)

---

### Task 2: Gate shared stack for desktop + bind `--desktop`

**Files:**
- Modify: `src/components/views/Trip.view.test.js`
- Modify: `src/components/views/Trip.vue`

**Interfaces:**
- Consumes: existing `isMobile` from device store
- Produces:
  - Root class binding includes `'trip-detail--desktop': !isMobile`
  - Stack visible when `trip && !isPassengersView` (both breakpoints)
  - Wrapper `.trip-detail__card` around stack on desktop (or always, with desktop-only card styles)

- [ ] **Step 1: Write the failing test**

Update/add in `Trip.view.test.js`:

```js
describe('Trip.vue shared trip-detail stack', () => {
    it('binds mobile and desktop trip-detail modifiers', () => {
        expect(viewSource).toContain("'trip-detail--mobile': isMobile");
        expect(viewSource).toContain("'trip-detail--desktop': !isMobile");
    });

    it('shows the redesign stack for any breakpoint when trip is loaded', () => {
        expect(viewSource).toMatch(
            /v-if="trip\s*&&\s*!isPassengersView"[\s\S]*?trip-detail__stack|trip-detail__stack[\s\S]*?v-if="trip\s*&&\s*!isPassengersView/
        );
        expect(viewSource).not.toMatch(
            /v-if="isMobile\s*&&\s*trip\s*&&\s*!isPassengersView"/
        );
    });
});
```

Keep existing mobile section-label tests; adjust the gating test that required `isMobile && trip` so it matches the new condition.

- [ ] **Step 2: Run test to verify it fails**

Run: `cd carpoolear && npx vitest run src/components/views/Trip.view.test.js`

Expected: FAIL — missing `trip-detail--desktop` / still gated on `isMobile`.

- [ ] **Step 3: Minimal Trip.vue changes**

1. Root class:

```vue
:class="{
    'trip-detail--mobile': isMobile,
    'trip-detail--desktop': !isMobile
}"
```

2. Change stack `v-if` from `isMobile && trip && !isPassengersView` to `trip && !isPassengersView`.

3. Wrap stack contents in:

```vue
<div class="trip-detail__card">
  ...existing stack children...
</div>
```

Do **not** remove the legacy `v-if="!isMobile"` column tree yet (Task 4). Temporarily both trees would render on desktop — acceptable for one commit if Task 4 follows immediately; otherwise hide legacy with `v-if="false"` or skip rendering legacy once stack is shared:

Prefer in this step: change legacy block to `v-if="false"` **or** delete it in Task 4 only. **This task:** only open the stack to desktop; **leave legacy in place behind `v-if="!isMobile"`** and accept double UI for a moment **only if Task 4 is next in the same session**. Safer: set legacy to `v-if="false"` with a comment `<!-- legacy desktop removed; see trip-detail desktop redesign -->` here.

Recommended for this task: set legacy desktop tree `v-if="false"` so desktop only shows the stack (even before column wrappers), avoiding a broken double layout.

- [ ] **Step 4: Run tests**

Run: `cd carpoolear && npx vitest run src/components/views/Trip.view.test.js src/styles/tripDetail.styles.test.js`

Expected: PASS (update any obsolete tests that required `isMobile &&` stack gating).

- [ ] **Step 5: Commit**

```bash
git add src/components/views/Trip.vue src/components/views/Trip.view.test.js
git commit -m "feat: show trip-detail stack on desktop with card shell"
```

---

### Task 3: Desktop column markup (DETALLE, seats|passengers, price|CTAs)

**Files:**
- Modify: `src/components/views/Trip.view.test.js`
- Modify: `src/components/views/Trip.vue`

**Interfaces:**
- Consumes: `TripDetailRoute`, `TripStats`, `TripData`, `TripPrice`, `TripSeats`, `TripPassengers`, `TripButtons`
- Produces markup structure (order):

```
TripDriver
DETALLE
  .trip-detail__detalle-grid
    .trip-detail__detalle-main → TripDetailRoute
    .trip-detail__detalle-aside → TripStats + (desktop) TripData
mensaje (if description)
mobile-only: CONDICIONES (TripPrice + TripData), TripPassengers, CTA
desktop-only:
  .trip-detail__seats-passengers
    left: section lugares libres + TripSeats
    right: TripPassengers (joined title)
  .trip-detail__price-cta
    left: TripPrice
    right: TripButtons
map
```

- [ ] **Step 1: Write the failing test**

```js
describe('Trip.vue desktop column bands', () => {
    it('orders seats-passengers before price-cta before map in the stack', () => {
        const stack = viewSource.match(
            /trip-detail__stack[\s\S]*?trip-route-map/
        )[0];
        const seatsIdx = stack.indexOf('trip-detail__seats-passengers');
        const priceIdx = stack.indexOf('trip-detail__price-cta');
        const mapIdx = stack.indexOf('trip-route-map');
        expect(seatsIdx).toBeGreaterThan(-1);
        expect(priceIdx).toBeGreaterThan(seatsIdx);
        expect(mapIdx).toBeGreaterThan(priceIdx);
    });

    it('splits DETALLE into main route and aside stats/condiciones', () => {
        const stack = viewSource.match(
            /trip-detail__stack[\s\S]*?trip-route-map/
        )[0];
        expect(stack).toContain('trip-detail__detalle-grid');
        expect(stack).toContain('trip-detail__detalle-main');
        expect(stack).toContain('trip-detail__detalle-aside');
        expect(stack).toMatch(
            /trip-detail__detalle-main[\s\S]*TripDetailRoute[\s\S]*trip-detail__detalle-aside[\s\S]*TripStats/
        );
    });

    it('keeps mobile condiciones with price; desktop puts TripData in DETALLE aside and TripPrice in price-cta', () => {
        expect(viewSource).toMatch(
            /v-if="isMobile"[\s\S]*tripDetailConditions[\s\S]*TripPrice[\s\S]*TripData/
        );
        expect(viewSource).toMatch(
            /trip-detail__detalle-aside[\s\S]*v-if="!isMobile"[\s\S]*TripData|trip-detail__detalle-aside[\s\S]*TripData[\s\S]*v-if="!isMobile"/
        );
        expect(viewSource).toMatch(
            /trip-detail__price-cta[\s\S]*TripPrice[\s\S]*TripButtons/
        );
    });
});
```

Relax regexes if needed to match the exact `v-if` placement you implement; assertions must encode: mobile price+data together; desktop data without price in DETALLE; desktop price with buttons.

- [ ] **Step 2: Run test to verify it fails**

Run: `cd carpoolear && npx vitest run src/components/views/Trip.view.test.js`

Expected: FAIL — missing grid class names / desktop bands.

- [ ] **Step 3: Implement stack markup**

Replace the inner stack (inside `.trip-detail__card`) with approximately:

```vue
<TripDriver />
<section class="trip-detail__section">
    <h3 class="trip-detail__section-title">{{ $t('tripDetailSection') }}</h3>
    <div class="trip-detail__detalle-grid">
        <div class="trip-detail__detalle-main">
            <TripDetailRoute />
        </div>
        <div class="trip-detail__detalle-aside">
            <TripStats />
            <div v-if="!isMobile" class="trip-detail__condiciones">
                <h3 class="trip-detail__section-title">
                    {{ $t('tripDetailConditions') }}
                </h3>
                <TripData />
            </div>
        </div>
    </div>
</section>
<section v-if="trip.description" class="trip-detail__section">
    <h3 class="trip-detail__section-title">
        {{ $t('tripDetailDriverMessage') }}
    </h3>
    <p class="trip-detail__driver-message">{{ trip.description }}</p>
</section>

<!-- Mobile-only: condiciones + passengers + CTAs (current order) -->
<template v-if="isMobile">
    <section class="trip-detail__section">
        <h3 class="trip-detail__section-title">
            {{ $t('tripDetailConditions') }}
        </h3>
        <div class="trip-detail__condiciones">
            <TripPrice />
            <TripData />
        </div>
    </section>
    <TripPassengers :section-title="$t('tripDetailJoined')" />
    <div class="trip-detail__cta">
        <TripButtons
            @deleteTrip="deleteTrip()"
            @toMessages="toMessages()"
            @toGroupChat="toGroupChat()"
            @onMakeRequest="onMakeRequest()"
            @cancelRequest="cancelRequest()"
            :sending="sending"
            :isPassengersView="isPassengersView"
        />
    </div>
</template>

<!-- Desktop-only bands -->
<template v-else>
    <section class="trip-detail__section trip-detail__seats-passengers">
        <div class="trip-detail__lugares">
            <h3 class="trip-detail__section-title">
                {{ $t('lugaresLibres') }}
            </h3>
            <TripSeats />
        </div>
        <div class="trip-detail__joined">
            <TripPassengers :section-title="$t('tripDetailJoined')" />
        </div>
    </section>
    <section class="trip-detail__section trip-detail__price-cta">
        <div class="trip-detail__contribucion">
            <TripPrice />
        </div>
        <div class="trip-detail__cta">
            <TripButtons
                @deleteTrip="deleteTrip()"
                @toMessages="toMessages()"
                @toGroupChat="toGroupChat()"
                @onMakeRequest="onMakeRequest()"
                @cancelRequest="cancelRequest()"
                :sending="sending"
                :isPassengersView="isPassengersView"
            />
        </div>
    </section>
</template>

<div
    ref="tripMapEl"
    class="trip-route-map"
    :style="isMobile ? mobileMapInlineStyle : undefined"
></div>
```

Extract the current mobile map inline style into a data/computed `mobileMapInlineStyle` **or** keep the inline style on mobile only as above. Prefer moving desktop map sizing fully to CSS (Task 1). For mobile, keep existing inline width/height/margin until a follow-up.

Ensure `TripSeats` is registered in `components` (already imported).

Update obsolete mobile test that asserted `stack.not.toContain('<TripSeats')` — seats may appear in the desktop `v-else` branch in the same file source; assert instead:

```js
expect(stack).toMatch(/v-if="isMobile"[\s\S]*?(?!TripSeats)[\s\S]*?v-else[\s\S]*TripSeats|trip-detail__lugares[\s\S]*TripSeats/);
```

Simpler: `expect(stack).toContain('trip-detail__lugares'); expect(stack).toContain('<TripSeats');` and keep mobile condiciones assertions.

- [ ] **Step 4: Run tests**

Run: `cd carpoolear && npx vitest run src/components/views/Trip.view.test.js src/styles/tripDetail.styles.test.js`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/views/Trip.vue src/components/views/Trip.view.test.js
git commit -m "feat: add desktop trip-detail column bands in shared stack"
```

---

### Task 4: Remove legacy desktop column tree

**Files:**
- Modify: `src/components/views/Trip.view.test.js`
- Modify: `src/components/views/Trip.vue`

**Interfaces:**
- Produces: no primary `v-if="!isMobile"` `.row.form` column composition for trip detail content
- Keep passengers-view / modals / warnings that are outside that tree

- [ ] **Step 1: Write the failing test**

```js
it('does not render the legacy desktop columnComponent form row', () => {
    expect(viewSource).not.toMatch(
        /v-if="!isMobile"[\s\S]*?class="row form"/
    );
    expect(viewSource).not.toContain('<TripLocation');
});
```

(Only if `TripLocation` is unused elsewhere in Trip.vue — if still used in passengers view, narrow the assertion to the removed block.)

- [ ] **Step 2: Run test to verify it fails**

Run: `cd carpoolear && npx vitest run src/components/views/Trip.view.test.js`

Expected: FAIL if legacy tree still present.

- [ ] **Step 3: Delete legacy tree**

Remove the large `v-if="!isMobile"` `.row.form` block and unused imports/components only if nothing else references them (`TripLocation`, `TripDate`, `TripDescription`, `TripShare`, `columnComponent` computed, etc.). Keep anything still required by modals or passengers view.

Clean dead computed (`columnComponent`, `columnClass`, `themeClasses`) if unused.

- [ ] **Step 4: Run tests**

Run: `cd carpoolear && npx vitest run src/components/views/Trip.view.test.js src/styles/tripDetail.styles.test.js`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/views/Trip.vue src/components/views/Trip.view.test.js
git commit -m "feat: remove legacy desktop trip-detail column layout"
```

---

### Task 5: Polish desktop seats column + map + mobile regression

**Files:**
- Modify: `src/styles/components/trip-detail.css`
- Modify: `src/styles/tripDetail.styles.test.js`
- Modify: `src/components/elements/TripSeats.vue` (only if Bootstrap offsets break the card)
- Optional: `src/components/elements/TripSeats.view.test.js` if it exists / create minimal source test

**Interfaces:**
- Desktop `.trip-detail--desktop .trip-seats` clears float/offset column classes visually (width 100%, no large offset)
- Map inside card full width

- [ ] **Step 1: Write failing style assertions**

```js
it('neutralizes TripSeats bootstrap offsets inside desktop trip detail', () => {
    expect(css).toMatch(
        /\.trip-detail--desktop\s+\.trip-seats[\s\S]*?\.trip_seats-available/
    );
    expect(css).toMatch(
        /\.trip-detail--desktop\s+[\s\S]*?col-xs-offset-2|\.trip-detail--desktop\s+\.trip-seats\s+[^{]*\{[^}]*width:\s*100%/
    );
});
```

Prefer a concrete rule you will add, e.g.:

```js
expect(css).toMatch(
    /\.trip-detail--desktop\s+\.trip-seats\s+\.trip_seats-available\s*\{[^}]*margin-left:\s*0/
);
expect(css).toMatch(
    /\.trip-detail--desktop\s+\.trip-seats\s+\.trip_seats-available\s*\{[^}]*width:\s*100%/
);
```

- [ ] **Step 2: Run to verify fail**

Run: `cd carpoolear && npx vitest run src/styles/tripDetail.styles.test.js`

- [ ] **Step 3: Add CSS overrides**

```css
.trip-detail--desktop .trip-seats .trip_seats-available {
    float: none;
    width: 100%;
    margin-left: 0;
    padding-left: 0;
}

.trip-detail--desktop .trip-seats .row {
    margin: 0;
}
```

Also ensure mobile map still works; desktop map uses `.trip-detail--desktop .trip-route-map` from Task 1.

Manually verify (or DevTools): mobile stack order unchanged (condiciones still has price).

- [ ] **Step 4: Run full related suite**

Run:

```bash
cd carpoolear && npx vitest run \
  src/styles/tripDetail.styles.test.js \
  src/components/views/Trip.view.test.js \
  src/components/elements/TripDetailRoute.view.test.js \
  src/components/elements/TripButtons.view.test.js
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/styles/components/trip-detail.css src/styles/tripDetail.styles.test.js src/components/elements/TripSeats.vue
git commit -m "feat: polish desktop trip-detail seats column and map"
```

---

## Spec coverage check

| Spec requirement | Task |
|------------------|------|
| Single card shell (`--ds-card-*`) | 1, 2 |
| Grey driver band | 1 |
| DETALLE two columns; condiciones without price on right | 3 |
| Mensaje del conductor | 3 (existing) |
| Lugares libres \| Ya se sumaron above contribución \| CTAs | 3 |
| Contribución \| CTAs | 3 |
| Map inside card last | 1, 3 |
| Mobile unchanged order | 3 (`v-if="isMobile"` block) |
| CTA rules unchanged | 3 (same `TripButtons` wiring) |
| Remove legacy desktop tree | 4 |

## Placeholder scan

No TBD / “implement later” steps; commands and selectors are explicit.

---

**Plan complete and saved to `docs/superpowers/plans/2026-08-01-trip-detail-desktop.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — fresh subagent per task, review between tasks  
**2. Inline Execution** — execute tasks in this session with checkpoints  

Which approach?
