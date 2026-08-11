# Trip Detail Redesign (Mobile) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle mobile trip detail to the mock reading order (driver → DETALLE → mensaje → CONDICIONES → YA SE SUMARON → CTAs → map), keep CTA business rules with primary/secondary hierarchy when both show, and expose backend `first_name` plus a reduced public `passenger[]` for non-privileged viewers.

**Architecture:** Backend adds `first_name` on `TripUserTransformer` and fills `passenger[]` with reduced objects for non-owner/non-passenger viewers. Frontend keeps desktop `columnComponent` composition; on mobile (`isMobile`) renders an explicit `.trip-detail` linear stack with section labels, restyles via `trip-detail.css`, updates `TripPassengers` / `TripButtons` / driver header tokens.

**Tech Stack:** Laravel/PHPUnit (`carpoolear_backend`), Vue 3 Options API + Vitest source tests (`carpoolear`), existing `UserRatingsCounts` / trip-card chips patterns, dayjs.

**Spec:** `docs/superpowers/specs/2026-08-01-trip-detail-redesign-design.md`

## Global Constraints

- Mobile only (≤767px / existing `isMobile`); desktop trip detail composition unchanged.
- CTA visibility/business rules unchanged; when both Enviar mensaje and Solicitar asiento are visible → mensaje `btn-primary`, solicitar secondary (`btn` without primary).
- Public passenger labels use API `first_name` only (no client split of `name` in YA SE SUMARON).
- Non-privileged `passenger[]` must not include full `name` / `email` / private trip-user fields.
- Do not edit `carpoolear-nx/`.
- TDD: `test:` then `feat:`/`fix:` commits. Backend and frontend are **separate git repos** — commit in the repo you touch.
- Prefer CSS + light markup under `.trip-detail`; do not rewrite the Leaflet map (keep it last on mobile).

## File map

| File | Responsibility |
|------|----------------|
| `carpoolear_backend/app/Transformers/TripUserTransformer.php` | `first_name` on full transform; `transformPublic()` reduced payload; first-token helper |
| `carpoolear_backend/tests/Unit/Transformers/TripUserTransformerTest.php` | Shape + first_name + public payload tests |
| `carpoolear_backend/app/Transformers/TripTransformer.php` | Fill reduced `passenger[]` for non-privileged viewers; admin gets full `passenger[]` |
| `carpoolear_backend/tests/Unit/Transformers/TripTransformerTest.php` | Public vs privileged passenger tests |
| `carpoolear/src/styles/components/trip-detail.css` | Mobile section stack, labels, chips, CTA hierarchy, passengers |
| `carpoolear/src/styles/tripDetail.styles.test.js` | CSS contracts |
| `carpoolear/src/styles/main.css` | Import trip-detail.css |
| `carpoolear/src/components/elements/TripPassengers.vue` | Public YA SE SUMARON from `trip.passenger`; `first_name`; owner actions gated |
| `carpoolear/src/components/elements/TripPassengers.view.test.js` | Visibility + first_name contracts |
| `carpoolear/src/components/elements/TripButtons.vue` | Secondary class on solicitar when both CTAs show |
| `carpoolear/src/components/elements/TripButtons.view.test.js` | Primary/secondary contract |
| `carpoolear/src/components/elements/TripDriver.vue` | Mobile header alignment (thumbs / viajes) under trip-detail |
| `carpoolear/src/components/elements/TripStats.vue` | Compact stats under DETALLE on mobile |
| `carpoolear/src/components/elements/TripDescription.vue` | Section label MENSAJE DEL CONDUCTOR when description present |
| `carpoolear/src/components/views/Trip.vue` | `.trip-detail` root; mobile linear stack; map last |
| `carpoolear/src/components/views/Trip.view.test.js` | Mobile section order / labels |
| `carpoolear/src/language/i18n.js` | Section keys (es + en) |

---

### Task 1: Backend `first_name` on `TripUserTransformer`

**Repo:** `carpoolear_backend/`

**Files:**
- Modify: `app/Transformers/TripUserTransformer.php`
- Modify: `tests/Unit/Transformers/TripUserTransformerTest.php`

**Interfaces:**
- Produces:
  - `TripUserTransformer::extractFirstName(?string $name): string` — trim; first whitespace token; `''` if empty
  - Full `transform()` / `missingUser()` include `first_name`
  - `transformPublic(User $user): array` → `['id' => int, 'image' => string|null, 'first_name' => string]`
  - `transformPublicOrMissing(?User $user, ?int $userId = null): array` for deleted users → `id`, `image` `''`, `first_name` from placeholder name token (`Usuario`)

- [ ] **Step 1: Write failing tests**

Add to `TripUserTransformerTest.php` (update existing key-list assertion to expect `first_name` after `name`):

```php
public function test_extract_first_name_uses_first_whitespace_token(): void
{
    $this->assertSame('Juan', TripUserTransformer::extractFirstName('  Juan Pérez  '));
    $this->assertSame('Ana', TripUserTransformer::extractFirstName('Ana'));
    $this->assertSame('', TripUserTransformer::extractFirstName('   '));
    $this->assertSame('', TripUserTransformer::extractFirstName(null));
}

public function test_transform_includes_first_name(): void
{
    $viewer = User::factory()->create();
    $user = User::factory()->create([
        'name' => 'María López',
        'last_connection' => '2026-04-30 15:00:00',
    ]);

    $payload = (new TripUserTransformer($viewer))->transform($user->fresh());

    $this->assertSame('María', $payload['first_name']);
}

public function test_transform_public_returns_only_safe_fields(): void
{
    $viewer = User::factory()->create();
    $user = User::factory()->create([
        'name' => 'Pedro Gómez',
        'image' => 'p.png',
        'last_connection' => '2026-04-30 15:00:00',
    ]);

    $payload = (new TripUserTransformer($viewer))->transformPublic($user->fresh());

    $this->assertSame(['id', 'image', 'first_name'], array_keys($payload));
    $this->assertSame($user->id, $payload['id']);
    $this->assertSame('p.png', $payload['image']);
    $this->assertSame('Pedro', $payload['first_name']);
    $this->assertArrayNotHasKey('name', $payload);
    $this->assertArrayNotHasKey('email', $payload);
    $this->assertArrayNotHasKey('private_note', $payload);
}

public function test_missing_user_includes_first_name_token(): void
{
    $payload = (new TripUserTransformer(User::factory()->create()))->missingUser(99);

    $this->assertSame('Usuario', $payload['first_name']);
}
```

Also insert `'first_name'` into the existing `array_keys($payload)` expectation in `test_transform_returns_expected_trip_user_payload_shape_and_values` (immediately after `'name'`).

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
cd carpoolear_backend
php artisan test --filter=TripUserTransformerTest
```

Expected: FAIL (missing method / missing key).

- [ ] **Step 3: Implement**

In `TripUserTransformer.php`:

```php
public static function extractFirstName(?string $name): string
{
    $trimmed = trim((string) $name);
    if ($trimmed === '') {
        return '';
    }

    return preg_split('/\s+/u', $trimmed, 2)[0];
}

public function transformPublic(User $user): array
{
    return [
        'id' => $user->id,
        'image' => $user->image,
        'first_name' => self::extractFirstName($user->name),
    ];
}

public function transformPublicOrMissing(?User $user, ?int $userId = null): array
{
    return $user
        ? $this->transformPublic($user)
        : [
            'id' => $userId,
            'image' => '',
            'first_name' => self::extractFirstName('Usuario ya no existe'),
        ];
}
```

In `transform()` `$data`, add `'first_name' => self::extractFirstName($user->name)` after `'name'`.

In `missingUser()`, add `'first_name' => self::extractFirstName('Usuario ya no existe')` after `'name'`.

- [ ] **Step 4: Run tests to verify they pass**

```bash
php artisan test --filter=TripUserTransformerTest
```

Expected: PASS.

- [ ] **Step 5: Commit (backend repo)**

```bash
git add app/Transformers/TripUserTransformer.php tests/Unit/Transformers/TripUserTransformerTest.php
git commit -m "$(cat <<'EOF'
test: add first_name to trip user transformer

EOF
)"
# if test commit already landed tests only, follow with feat commit after implement;
# preferred: commit tests first then implementation as separate commits when doing true TDD.
```

Use two commits when following strict TDD: `test:` after Step 1 (red), then `feat:` after Step 3 (green).

---

### Task 2: Backend public `passenger[]` in `TripTransformer`

**Repo:** `carpoolear_backend/`

**Files:**
- Modify: `app/Transformers/TripTransformer.php` (passenger block ~87–116)
- Modify: `tests/Unit/Transformers/TripTransformerTest.php`

**Interfaces:**
- Consumes: `TripUserTransformer::transform`, `transformPublic` / `transformPublicOrMissing`
- Produces:
  - Privileged (owner **or** accepted passenger **or** admin): full `passenger[]` (+ `first_name` via Task 1)
  - Other authenticated viewers: `passenger[]` of reduced public objects for accepted passengers only; still no `allPassengerRequest` / emails
  - Unauthenticated (`$this->user` null): leave `passenger` as `[]` (unchanged)

- [ ] **Step 1: Write failing tests**

```php
public function test_transform_includes_first_name_on_owner_passenger(): void
{
    $owner = User::factory()->create(['is_admin' => false]);
    $acceptedUser = User::factory()->create(['name' => 'Lucía Fernández']);
    $trip = $this->makeTrip([
        'user_id' => $owner->id,
        'state' => Trip::STATE_READY,
    ]);
    Passenger::query()->create([
        'user_id' => $acceptedUser->id,
        'trip_id' => $trip->id,
        'passenger_type' => Passenger::TYPE_PASAJERO,
        'request_state' => Passenger::STATE_ACCEPTED,
        'canceled_state' => null,
    ]);

    $payload = (new TripTransformer($owner))->transform($trip->fresh(['passengerAccepted']));

    $this->assertSame('Lucía', $payload['passenger'][0]['first_name']);
    $this->assertSame('Lucía Fernández', $payload['passenger'][0]['name']);
}

public function test_transform_exposes_reduced_passengers_to_unrelated_viewer(): void
{
    $owner = User::factory()->create(['is_admin' => false]);
    $viewer = User::factory()->create(['is_admin' => false]);
    $acceptedUser = User::factory()->create([
        'name' => 'Diego Ruiz',
        'image' => 'diego.png',
    ]);
    $trip = $this->makeTrip([
        'user_id' => $owner->id,
        'state' => Trip::STATE_READY,
    ]);
    Passenger::query()->create([
        'user_id' => $acceptedUser->id,
        'trip_id' => $trip->id,
        'passenger_type' => Passenger::TYPE_PASAJERO,
        'request_state' => Passenger::STATE_ACCEPTED,
        'canceled_state' => null,
    ]);

    $payload = (new TripTransformer($viewer))->transform(
        $trip->fresh(['user', 'passengerAccepted', 'passengerPending'])
    );

    $this->assertArrayNotHasKey('allPassengerRequest', $payload);
    $this->assertCount(1, $payload['passenger']);
    $this->assertSame(['id', 'image', 'first_name'], array_keys($payload['passenger'][0]));
    $this->assertSame($acceptedUser->id, $payload['passenger'][0]['id']);
    $this->assertSame('Diego', $payload['passenger'][0]['first_name']);
    $this->assertArrayNotHasKey('name', $payload['passenger'][0]);
}

public function test_transform_includes_full_passengers_for_admin(): void
{
    $owner = User::factory()->create(['is_admin' => false]);
    $admin = User::factory()->create(['is_admin' => true]);
    $acceptedUser = User::factory()->create(['name' => 'Sofía Díaz']);
    $trip = $this->makeTrip([
        'user_id' => $owner->id,
        'state' => Trip::STATE_READY,
    ]);
    Passenger::query()->create([
        'user_id' => $acceptedUser->id,
        'trip_id' => $trip->id,
        'passenger_type' => Passenger::TYPE_PASAJERO,
        'request_state' => Passenger::STATE_ACCEPTED,
        'canceled_state' => null,
    ]);

    $payload = (new TripTransformer($admin))->transform(
        $trip->fresh(['passengerAccepted', 'passenger'])
    );

    $this->assertCount(1, $payload['passenger']);
    $this->assertSame('Sofía Díaz', $payload['passenger'][0]['name']);
    $this->assertSame('Sofía', $payload['passenger'][0]['first_name']);
}
```

- [ ] **Step 2: Run to verify fail**

```bash
php artisan test --filter='test_transform_includes_first_name_on_owner_passenger|test_transform_exposes_reduced_passengers_to_unrelated_viewer|test_transform_includes_full_passengers_for_admin'
```

Expected: FAIL (empty passenger for viewer / admin; missing first_name).

- [ ] **Step 3: Implement**

In `TripTransformer::transform`, adjust the authenticated passenger block:

1. Keep `allPassengerRequest` gating as today for owner / accepted passenger / admin.
2. Change the full `passenger[]` fill so **admin** is included with owner/accepted passenger (use full `transform()`).
3. After that privileged branch (or in an `else`), if `$data['passenger']` is still empty and the viewer is authenticated but not in the privileged full-data path for accepted list, fill:

```php
foreach ($trip->passengerAccepted as $passenger) {
    $data['passenger'][] = $userTranforms->transformPublicOrMissing(
        $passenger->user,
        $passenger->user_id ?? null
    );
}
```

Ensure pending-only viewers still get `request = 'send'` and **also** get the reduced accepted list (accepted co-passengers visible). Prefer filling reduced passengers for any authenticated non-privileged case once, without duplicating when privileged already filled.

Minimal shape:

```php
$isPrivilegedViewer = $trip->isPassenger($this->user)
    || $trip->user_id == $this->user->id
    || $this->user->is_admin;

if ($isPrivilegedViewer) {
    // existing allPassengerRequest / counts / pending mutation …
    if ($trip->isPassenger($this->user) || $trip->user_id == $this->user->id || $this->user->is_admin) {
        foreach ($trip->passengerAccepted as $passenger) {
            $data['passenger'][] = $userTranforms->transformOrMissing(
                $passenger->user,
                $passenger->user_id ?? null
            );
        }
    }
    // keep car / request_count behavior for owner/passenger as today; admin may follow owner-like car exposure only if already true — do not invent new car leaks for unrelated viewers
} else {
    if ($trip->isPending($this->user)) {
        $data['request'] = 'send';
    }
    foreach ($trip->passengerAccepted as $passenger) {
        $data['passenger'][] = $userTranforms->transformPublicOrMissing(
            $passenger->user,
            $passenger->user_id ?? null
        );
    }
}
```

Refactor carefully against existing tests (`test_transform_includes_owner_context_passenger_data_and_counts`, pending requester, etc.). Prefer smallest diff: after the current big `if`, add:

```php
if ($this->user && count($data['passenger']) === 0) {
    foreach ($trip->passengerAccepted as $passenger) {
        $data['passenger'][] = $userTranforms->transformPublicOrMissing(
            $passenger->user,
            $passenger->user_id ?? null
        );
    }
}
```

…and widen the inner full-transform loop condition to include `$this->user->is_admin` so admin gets full objects (then the empty-fill above will not run).

- [ ] **Step 4: Run tests**

```bash
php artisan test --filter=TripTransformerTest
```

Expected: PASS (including new + existing).

- [ ] **Step 5: Commit**

```bash
git add app/Transformers/TripTransformer.php tests/Unit/Transformers/TripTransformerTest.php
git commit -m "$(cat <<'EOF'
feat: expose public trip passengers with first_name

EOF
)"
```

---

### Task 3: Frontend trip-detail CSS tokens + import

**Repo:** `carpoolear/`

**Files:**
- Create: `src/styles/components/trip-detail.css`
- Create: `src/styles/tripDetail.styles.test.js`
- Modify: `src/styles/main.css`

- [ ] **Step 1: Failing CSS contract test**

```js
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const css = fs.readFileSync(
    path.resolve(__dirname, 'components/trip-detail.css'),
    'utf8'
);

describe('trip-detail.css', () => {
    it('scopes mobile section labels and stack under .trip-detail', () => {
        expect(css).toContain('.trip-detail');
        expect(css).toContain('.trip-detail__section-title');
        expect(css).toMatch(/@media\s*\(max-width:\s*767px\)/);
        expect(css).toContain('.trip-detail__stack');
        expect(css).toContain('.trip-detail__cta .btn-primary');
        expect(css).toContain('.trip-detail__passengers');
    });
});
```

- [ ] **Step 2: Run fail**

```bash
npm run test:unit -- --run src/styles/tripDetail.styles.test.js
```

Expected: FAIL (file missing).

- [ ] **Step 3: Implement CSS + import**

Create `trip-detail.css` with mobile-first section title uppercase/tracking matching mock, stack spacing, compact stats row, passenger rows, CTA full-width stack. Keep desktop selectors inert (mobile media query or `.trip-detail--mobile` class set from Vue).

Import in `main.css` next to other component CSS:

```css
@import './components/trip-detail.css';
```

- [ ] **Step 4: Pass + commit**

```bash
npm run test:unit -- --run src/styles/tripDetail.styles.test.js
git add src/styles/components/trip-detail.css src/styles/tripDetail.styles.test.js src/styles/main.css
git commit -m "$(cat <<'EOF'
feat: add trip-detail mobile style shell

EOF
)"
```

---

### Task 4: i18n section labels

**Repo:** `carpoolear/`

**Files:**
- Modify: `src/language/i18n.js` (es + en locales)

- [ ] **Step 1: Add keys** (reuse `detallesDelViaje` if it already matches “Detalle”; otherwise add explicit keys):

```js
// es
tripDetailSection: 'Detalle',
tripDetailDriverMessage: 'Mensaje del conductor',
tripDetailConditions: 'Condiciones',
tripDetailJoined: 'Ya se sumaron',

// en
tripDetailSection: 'Details',
tripDetailDriverMessage: 'Driver message',
tripDetailConditions: 'Conditions',
tripDetailJoined: 'Already joined',
```

Optional: assert keys exist via a tiny `i18n` source test if the repo has a pattern; otherwise cover via `Trip.view.test.js` in Task 6.

- [ ] **Step 2: Commit**

```bash
git add src/language/i18n.js
git commit -m "$(cat <<'EOF'
feat: add trip detail section i18n labels

EOF
)"
```

---

### Task 5: `TripPassengers` — public list + `first_name`

**Repo:** `carpoolear/`

**Files:**
- Modify: `src/components/elements/TripPassengers.vue`
- Create or modify: `src/components/elements/TripPassengers.view.test.js`

**Interfaces:**
- Consumes: `trip.passenger` (`id`, `image`, `first_name`, and for owners also full fields); `trip.allPassengerRequest` for owner waiting-payment / remove actions
- Produces: section visible when accepted display list length > 0; label `$t('tripDetailJoined')` on mobile trip-detail (or always for this component once restyled); display `passenger.first_name`; owner-only chat/remove

- [ ] **Step 1: Failing view test**

```js
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const src = fs.readFileSync(path.resolve(__dirname, 'TripPassengers.vue'), 'utf8');

describe('TripPassengers.vue public joined list', () => {
    it('shows accepted passengers from trip.passenger using first_name', () => {
        expect(src).toContain('trip.passenger');
        expect(src).toContain('first_name');
        expect(src).toContain("$t('tripDetailJoined')");
        expect(src).not.toMatch(/\{\{\s*p\.name\s*\}\}/);
    });

    it('keeps owner-only remove/chat actions', () => {
        expect(src).toContain('removePassenger');
        expect(src).toMatch(/v-if="owner"/);
    });
});
```

- [ ] **Step 2: Run fail**

```bash
npm run test:unit -- --run src/components/elements/TripPassengers.view.test.js
```

- [ ] **Step 3: Implement**

Replace owner-only outer `v-if` so the joined list shows for any viewer when there are accepted passengers:

```js
displayPassengers() {
    if (Array.isArray(this.trip.passenger) && this.trip.passenger.length) {
        return this.trip.passenger;
    }
    return [];
},
```

Template sketch:

```html
<div class="row passengers trip-detail__passengers" v-if="displayPassengers.length">
  <div class="col-xs-24">
    <h4 class="title-margined trip-detail__section-title">
      <strong>{{ $t('tripDetailJoined') }}</strong>
    </h4>
    <div v-for="p in displayPassengers" :key="p.id" class="list-item">
      <span @click="toUserProfile(p)" class="trip_driver_img circle-box passenger trip_passenger_image" v-imgSrc:profile="p.image"></span>
      <a href="#" @click="toUserProfile(p)" class="trip_passenger_name">{{ p.first_name }}</a>
      <a v-if="owner" … chat …></a>
      <button v-if="owner" @click="removePassenger(p)" …></button>
    </div>
  </div>
  <!-- keep waiting-for-payment owner block using allPassengerRequest -->
</div>
```

`removePassenger` must still resolve the passenger request row from `allPassengerRequest` by user id when `p` comes from transformed `trip.passenger` (map id → request). Adjust `removePassenger` if it currently expects request-shaped objects.

Remove the `console.log` in `acceptedPassengers` while touching this file.

- [ ] **Step 4: Pass + commit**

```bash
npm run test:unit -- --run src/components/elements/TripPassengers.view.test.js
git add src/components/elements/TripPassengers.vue src/components/elements/TripPassengers.view.test.js
git commit -m "$(cat <<'EOF'
feat: show trip passengers to everyone with first_name

EOF
)"
```

---

### Task 6: `TripButtons` CTA hierarchy

**Repo:** `carpoolear/`

**Files:**
- Modify: `src/components/elements/TripButtons.vue`
- Modify: `src/components/elements/TripButtons.view.test.js`

- [ ] **Step 1: Failing test**

```js
describe('TripButtons.vue message/request hierarchy', () => {
    it('marks solicitar asiento secondary when both CTAs can show', () => {
        expect(viewSource).toContain('btn-primary');
        expect(viewSource).toMatch(
            /class="btn(?:\s+trip-detail__cta-secondary)?"[\s\S]*?solicitarAsiento|solicitarAsiento[\s\S]*?class="btn"/
        );
        // Prefer an explicit secondary class on the request button:
        expect(viewSource).toContain('trip-detail__cta-secondary');
    });
});
```

- [ ] **Step 2: Implement**

Keep visibility `v-if`s identical. On the **Solicitar asiento / Reservar** request button (the one that is not the dedicated Enviar mensaje control), change `class="btn btn-primary"` → `class="btn trip-detail__cta-secondary"` (or `btn btn-secondary` if that token exists). Leave the dedicated Enviar mensaje button as `btn-primary`.

Do **not** change `module_coordinate_by_message` label behavior.

- [ ] **Step 3: Pass + commit**

```bash
npm run test:unit -- --run src/components/elements/TripButtons.view.test.js
git commit -m "$(cat <<'EOF'
feat: secondary solicitar CTA when messaging is primary

EOF
)"
```

---

### Task 7: Mobile linear stack in `Trip.vue` + section chrome

**Repo:** `carpoolear/`

**Files:**
- Modify: `src/components/views/Trip.vue`
- Modify: `src/components/views/Trip.view.test.js`
- Modify as needed: `TripDriver.vue`, `TripLocation.vue` / `TripDate.vue`, `TripStats.vue`, `TripDescription.vue`, `TripPrice.vue` / `TripSeats` / `TripData` for section titles under `.trip-detail`

**Approach:** When `isMobile`, render an explicit stack instead of relying on `columnComponent` order. Desktop continues to use existing columns.

- [ ] **Step 1: Failing Trip.view tests**

```js
describe('Trip.vue mobile trip-detail stack', () => {
    it('uses trip-detail root and mobile stack section labels', () => {
        expect(viewSource).toContain('trip-detail');
        expect(viewSource).toContain('trip-detail__stack');
        expect(viewSource).toContain("$t('tripDetailSection')");
        expect(viewSource).toContain("$t('tripDetailDriverMessage')");
        expect(viewSource).toContain("$t('tripDetailConditions')");
        expect(viewSource).toContain("$t('tripDetailJoined')");
    });

    it('keeps map after CTAs in mobile markup', () => {
        const mobileStack = viewSource.match(
            /trip-detail__stack[\s\S]*?trip-route-map/
        );
        expect(mobileStack).not.toBeNull();
        expect(mobileStack[0].indexOf('TripButtons')).toBeLessThan(
            mobileStack[0].indexOf('trip-route-map')
        );
    });
});
```

Adjust selectors to match the final template; the assertion intent is order: buttons before map inside the mobile stack.

- [ ] **Step 2: Implement mobile stack**

On root:

```html
<div class="container trip-detail" :class="{ 'trip-detail--mobile': isMobile }">
```

(or add `trip-detail` beside existing `trip-detail-component`).

When `isMobile && trip && !isPassengersView`:

```html
<div class="trip-detail__stack">
  <TripDriver />
  <section class="trip-detail__section">
    <h3 class="trip-detail__section-title">{{ $t('tripDetailSection') }}</h3>
    <TripLocation />
    <TripDate />
    <TripStats />
  </section>
  <section v-if="trip.description" class="trip-detail__section">
    <h3 class="trip-detail__section-title">{{ $t('tripDetailDriverMessage') }}</h3>
    <!-- description body only; avoid duplicate car block if TripDescription bundles car — split or prop -->
    <p class="trip-detail__driver-message">{{ trip.description }}</p>
  </section>
  <section class="trip-detail__section">
    <h3 class="trip-detail__section-title">{{ $t('tripDetailConditions') }}</h3>
    <TripPrice />
    <TripSeats />
    <TripData />
  </section>
  <TripPassengers />
  <div class="trip-detail__cta">
    <TripButtons …existing listeners/props… />
  </div>
  <div ref="tripMapEl" class="trip-route-map" …></div>
</div>
```

Hide the desktop column/map markup when `isMobile` to avoid duplicate maps/components. Keep modals/warnings above the stack.

**TripDriver (mobile):** prefer `UserNameWithBadge` + `UserRatingsCounts` + viajes count (already partially present on non-light path); under `.trip-detail--mobile` hide stars/total-count-only presentations.

**TripStats (mobile):** compact inline `12 km · 2 h · 1.80 kg CO₂` without long labels; gate with trip-detail CSS / `isMobile`.

**TripDescription:** if still used on desktop only, leave as is; mobile stack can inline description to control the section title.

- [ ] **Step 3: Pass targeted tests + commit**

```bash
npm run test:unit -- --run src/components/views/Trip.view.test.js src/components/elements/TripPassengers.view.test.js src/components/elements/TripButtons.view.test.js src/styles/tripDetail.styles.test.js
git add src/components/views/Trip.vue src/components/views/Trip.view.test.js src/components/elements/TripDriver.vue src/components/elements/TripStats.vue src/components/elements/TripDescription.vue
git commit -m "$(cat <<'EOF'
feat: restyle mobile trip detail section stack

EOF
)"
```

---

### Task 8: Verification

**Backend**

```bash
cd carpoolear_backend
php artisan test --filter='TripUserTransformerTest|TripTransformerTest'
```

Expected: PASS.

**Frontend**

```bash
cd carpoolear
npm run test:unit -- --run src/styles/tripDetail.styles.test.js src/components/elements/TripPassengers.view.test.js src/components/elements/TripButtons.view.test.js src/components/views/Trip.view.test.js src/components/elements/TripDriver.view.test.js
```

Expected: PASS. Fix any regressions in `TripDriver.view.test.js` / `TripDescription.view.test.js` if markup contracts shifted.

**Manual (mobile width)**

1. Open a trip as non-owner with accepted passengers → YA SE SUMARON shows first names only; no full name.
2. Same trip as owner → first names + remove/chat.
3. Non-owner with both message + request CTAs → mensaje primary, solicitar secondary.
4. Map at bottom; desktop trip detail looks unchanged.

---

## Spec coverage check

| Spec requirement | Task |
|------------------|------|
| Mobile section order + labels | 4, 7 |
| CTA rules + primary/secondary | 6 |
| Public passengers + first_name UI | 5 |
| Backend first_name + reduced passenger[] | 1, 2 |
| Desktop unchanged | 7 (mobile-only stack) |
| Map last on mobile | 7 |
| CSS scoped trip-detail | 3 |
| Tests backend + frontend | 1, 2, 3, 5, 6, 7, 8 |
