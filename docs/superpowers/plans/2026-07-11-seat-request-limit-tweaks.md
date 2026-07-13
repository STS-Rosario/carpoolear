# Seat Request Limit Tweaks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expose seat-request limit status on trip payloads and disable passenger actions / warn drivers when a trip has reached the driver’s unanswered limit.

**Architecture:** Backend `UsersManager` exposes a shared `seatRequestLimitStatus($trip)` used by `TripTransformer` so UI flags match conversation/seat-request blocking. Frontend utils drive `TripButtons`, trip detail, and My Trips card warnings. Counting rules stay unchanged (pending seat requests + unanswered conversations).

**Tech Stack:** Laravel/PHPUnit (`carpoolear_backend`), Vue 3 + Vitest source tests (`carpoolear`). Branches: `seat-request-limit-tweaks` in both repos.

**Spec:** `carpoolear/docs/superpowers/specs/2026-07-11-seat-request-limit-tweaks-design.md`

---

## File map

| File | Responsibility |
|------|----------------|
| `carpoolear_backend/app/Services/Logic/UsersManager.php` | `seatRequestLimitStatus($trip)` → `limit` + `reached` |
| `carpoolear_backend/app/Transformers/TripTransformer.php` | Add `seat_request_limit`, `seat_request_limit_reached` for authenticated viewers |
| `carpoolear_backend/tests/Unit/Services/Logic/UsersManagerTest.php` | Unit tests for status helper |
| `carpoolear_backend/tests/Unit/Transformers/TripTransformerTest.php` | Payload field tests |
| `carpoolear/src/utils/tripSeatRequestsWarning.js` | Passenger/driver visibility helpers; suppress generic pending warning when limit reached |
| `carpoolear/src/utils/tripSeatRequestsWarning.test.js` | Unit tests for helpers |
| `carpoolear/src/components/elements/TripButtons.vue` | Disable buttons + passenger message |
| `carpoolear/src/components/elements/TripButtons.view.test.js` | View contract tests |
| `carpoolear/src/components/views/Trip.vue` | Prefer driver limit warning over generic pending |
| `carpoolear/src/components/views/Trip.view.test.js` | View contract tests |
| `carpoolear/src/components/sections/Trip.vue` | Driver limit warning on My Trips cards |
| `carpoolear/src/components/sections/Trip.view.test.js` | View contract tests |
| `carpoolear/src/language/i18n.js` | Passenger + driver limit message keys (all locales) |

---

### Task 1: Backend — `UsersManager::seatRequestLimitStatus` (TDD)

**Files:**
- Modify: `carpoolear_backend/app/Services/Logic/UsersManager.php`
- Test: `carpoolear_backend/tests/Unit/Services/Logic/UsersManagerTest.php`

- [ ] **Step 1: Write failing tests**

Append to `UsersManagerTest.php` (same mock style as existing unanswered tests):

```php
public function test_seat_request_limit_status_returns_null_limit_when_module_disabled(): void
{
    Config::set('carpoolear.module_unaswered_message_limit', false);

    $trip = (object) [
        'id' => 201,
        'user_id' => 21,
        'user' => (object) ['unaswered_messages_limit' => 3],
    ];

    $userRepo = Mockery::mock(UserRepository::class);
    $userRepo->shouldReceive('unansweredConversationOrRequestsByTrip')->never();
    $manager = new UsersManager($userRepo, Mockery::mock(TripRepository::class));

    $this->assertSame(
        ['limit' => null, 'reached' => false],
        $manager->seatRequestLimitStatus($trip)
    );
}

public function test_seat_request_limit_status_returns_null_limit_when_driver_limit_not_positive(): void
{
    Config::set('carpoolear.module_unaswered_message_limit', true);

    $trip = (object) [
        'id' => 202,
        'user_id' => 22,
        'user' => (object) ['unaswered_messages_limit' => 0],
    ];

    $userRepo = Mockery::mock(UserRepository::class);
    $userRepo->shouldReceive('unansweredConversationOrRequestsByTrip')->never();
    $manager = new UsersManager($userRepo, Mockery::mock(TripRepository::class));

    $this->assertSame(
        ['limit' => null, 'reached' => false],
        $manager->seatRequestLimitStatus($trip)
    );
}

public function test_seat_request_limit_status_reached_when_count_at_limit(): void
{
    Config::set('carpoolear.module_unaswered_message_limit', true);

    $trip = (object) [
        'id' => 203,
        'user_id' => 23,
        'user' => (object) ['unaswered_messages_limit' => 2],
    ];

    $userRepo = Mockery::mock(UserRepository::class);
    $userRepo->shouldReceive('unansweredConversationOrRequestsByTrip')
        ->once()
        ->with(23, 203)
        ->andReturn(2);
    $manager = new UsersManager($userRepo, Mockery::mock(TripRepository::class));

    $this->assertSame(
        ['limit' => 2, 'reached' => true],
        $manager->seatRequestLimitStatus($trip)
    );
}

public function test_seat_request_limit_status_not_reached_when_count_below_limit(): void
{
    Config::set('carpoolear.module_unaswered_message_limit', true);

    $trip = (object) [
        'id' => 204,
        'user_id' => 24,
        'user' => (object) ['unaswered_messages_limit' => 5],
    ];

    $userRepo = Mockery::mock(UserRepository::class);
    $userRepo->shouldReceive('unansweredConversationOrRequestsByTrip')
        ->once()
        ->with(24, 204)
        ->andReturn(4);
    $manager = new UsersManager($userRepo, Mockery::mock(TripRepository::class));

    $this->assertSame(
        ['limit' => 5, 'reached' => false],
        $manager->seatRequestLimitStatus($trip)
    );
}
```

Ensure `use Illuminate\Support\Facades\Config;` and `TripRepository` import exist (add if missing).

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd carpoolear_backend && php artisan test --filter=test_seat_request_limit_status
```

Expected: FAIL — `seatRequestLimitStatus` does not exist.

- [ ] **Step 3: Commit red**

```bash
cd carpoolear_backend
git add tests/Unit/Services/Logic/UsersManagerTest.php
git commit -m "$(cat <<'EOF'
test: seatRequestLimitStatus cases for module and limit

EOF
)"
```

- [ ] **Step 4: Minimal implementation**

In `UsersManager.php`, after `unansweredConversationOrRequestsByTrip`:

```php
public function seatRequestLimitStatus($trip): array
{
    $moduleEnabled = config('carpoolear.module_unaswered_message_limit', false);
    $limit = isset($trip->user->unaswered_messages_limit)
        ? (int) $trip->user->unaswered_messages_limit
        : 0;

    if (! $moduleEnabled || $limit <= 0) {
        return ['limit' => null, 'reached' => false];
    }

    $allow = $this->unansweredConversationOrRequestsByTrip($trip);

    return [
        'limit' => $limit,
        'reached' => ! $allow,
    ];
}
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
cd carpoolear_backend && php artisan test --filter=test_seat_request_limit_status
```

Expected: PASS

- [ ] **Step 6: Commit green**

```bash
cd carpoolear_backend
git add app/Services/Logic/UsersManager.php
git commit -m "$(cat <<'EOF'
feat: add UsersManager::seatRequestLimitStatus

EOF
)"
```

- [ ] **Step 7: Refactor if needed (keep green), then commit**

Only if duplication/naming cleanup is warranted. Otherwise skip with no empty commit.

```bash
# if refactor happened:
git add -u
git commit -m "$(cat <<'EOF'
refactor: clarify seatRequestLimitStatus

EOF
)"
```

---

### Task 2: Backend — TripTransformer fields (TDD)

**Files:**
- Modify: `carpoolear_backend/app/Transformers/TripTransformer.php`
- Test: `carpoolear_backend/tests/Unit/Transformers/TripTransformerTest.php`

- [ ] **Step 1: Write failing tests**

Append to `TripTransformerTest.php`:

```php
public function test_transform_exposes_seat_request_limit_not_reached_when_module_on_and_under_limit(): void
{
    \Illuminate\Support\Facades\Config::set('carpoolear.module_unaswered_message_limit', true);
    $owner = User::factory()->create([
        'is_admin' => false,
        'unaswered_messages_limit' => 3,
    ]);
    $viewer = User::factory()->create(['is_admin' => false]);
    $trip = $this->makeTrip(['user_id' => $owner->id, 'state' => Trip::STATE_READY]);

    Passenger::query()->create([
        'user_id' => User::factory()->create()->id,
        'trip_id' => $trip->id,
        'passenger_type' => Passenger::TYPE_PASAJERO,
        'request_state' => Passenger::STATE_PENDING,
        'canceled_state' => null,
    ]);

    $payload = (new TripTransformer($viewer))->transform($trip->fresh(['user', 'passengerPending']));

    $this->assertSame(3, $payload['seat_request_limit']);
    $this->assertFalse($payload['seat_request_limit_reached']);
}

public function test_transform_exposes_seat_request_limit_reached_when_pending_count_meets_limit(): void
{
    \Illuminate\Support\Facades\Config::set('carpoolear.module_unaswered_message_limit', true);
    $owner = User::factory()->create([
        'is_admin' => false,
        'unaswered_messages_limit' => 1,
    ]);
    $viewer = User::factory()->create(['is_admin' => false]);
    $trip = $this->makeTrip(['user_id' => $owner->id, 'state' => Trip::STATE_READY]);

    Passenger::query()->create([
        'user_id' => User::factory()->create()->id,
        'trip_id' => $trip->id,
        'passenger_type' => Passenger::TYPE_PASAJERO,
        'request_state' => Passenger::STATE_PENDING,
        'canceled_state' => null,
    ]);

    $payload = (new TripTransformer($viewer))->transform($trip->fresh(['user', 'passengerPending']));

    $this->assertSame(1, $payload['seat_request_limit']);
    $this->assertTrue($payload['seat_request_limit_reached']);
}

public function test_transform_seat_request_limit_null_when_module_disabled(): void
{
    \Illuminate\Support\Facades\Config::set('carpoolear.module_unaswered_message_limit', false);
    $owner = User::factory()->create([
        'is_admin' => false,
        'unaswered_messages_limit' => 2,
    ]);
    $viewer = User::factory()->create(['is_admin' => false]);
    $trip = $this->makeTrip(['user_id' => $owner->id, 'state' => Trip::STATE_READY]);

    $payload = (new TripTransformer($viewer))->transform($trip->fresh(['user']));

    $this->assertNull($payload['seat_request_limit']);
    $this->assertFalse($payload['seat_request_limit_reached']);
}

public function test_transform_omits_seat_request_limit_fields_without_viewer(): void
{
    \Illuminate\Support\Facades\Config::set('carpoolear.module_unaswered_message_limit', true);
    $trip = $this->makeTrip();

    $payload = (new TripTransformer(null))->transform($trip->fresh(['user']));

    $this->assertArrayNotHasKey('seat_request_limit', $payload);
    $this->assertArrayNotHasKey('seat_request_limit_reached', $payload);
}
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd carpoolear_backend && php artisan test --filter=test_transform_exposes_seat_request_limit
```

Expected: FAIL — keys missing / assertions fail.

- [ ] **Step 3: Commit red**

```bash
cd carpoolear_backend
git add tests/Unit/Transformers/TripTransformerTest.php
git commit -m "$(cat <<'EOF'
test: TripTransformer seat request limit payload fields

EOF
)"
```

- [ ] **Step 4: Minimal implementation**

Inside `TripTransformer::transform`, within `if ($this->user) { ... }` (near `passengerPending_count`), add:

```php
$usersManager = app(\STS\Services\Logic\UsersManager::class);
$seatRequestLimitStatus = $usersManager->seatRequestLimitStatus($trip);
$data['seat_request_limit'] = $seatRequestLimitStatus['limit'];
$data['seat_request_limit_reached'] = $seatRequestLimitStatus['reached'];
```

Ensure `$trip->user` is available (relation already used above for `TripUserTransformer`).

- [ ] **Step 5: Run tests — expect PASS**

```bash
cd carpoolear_backend && php artisan test --filter='test_transform_exposes_seat_request_limit|test_transform_seat_request_limit|test_transform_omits_seat_request_limit'
```

Expected: PASS

- [ ] **Step 6: Commit green**

```bash
cd carpoolear_backend
git add app/Transformers/TripTransformer.php
git commit -m "$(cat <<'EOF'
feat: expose seat request limit fields on trip payload

EOF
)"
```

- [ ] **Step 7: Refactor if needed, commit**

```bash
# optional refactor commit only if code cleaned up
```

---

### Task 3: Frontend — warning util helpers (TDD)

**Files:**
- Modify: `carpoolear/src/utils/tripSeatRequestsWarning.js`
- Modify: `carpoolear/src/utils/tripSeatRequestsWarning.test.js`

- [ ] **Step 1: Write failing tests**

Replace/extend `tripSeatRequestsWarning.test.js`:

```js
import { describe, expect, it } from 'vitest';
import {
    shouldShowTripSeatRequestsWarning,
    shouldShowDriverSeatRequestLimitWarning,
    shouldShowPassengerSeatRequestLimitMessage,
} from './tripSeatRequestsWarning.js';

describe('shouldShowTripSeatRequestsWarning', () => {
    it('returns true when the driver owns the trip and there are pending seat requests', () => {
        expect(shouldShowTripSeatRequestsWarning(true, 1)).toBe(true);
        expect(shouldShowTripSeatRequestsWarning(true, 3)).toBe(true);
    });

    it('returns false when the viewer is not the trip owner', () => {
        expect(shouldShowTripSeatRequestsWarning(false, 2)).toBe(false);
    });

    it('returns false when there are no pending seat requests', () => {
        expect(shouldShowTripSeatRequestsWarning(true, 0)).toBe(false);
        expect(shouldShowTripSeatRequestsWarning(true, undefined)).toBe(false);
        expect(shouldShowTripSeatRequestsWarning(true, null)).toBe(false);
    });

    it('returns false when seat request limit is reached even if pending exist', () => {
        expect(shouldShowTripSeatRequestsWarning(true, 3, true)).toBe(false);
    });
});

describe('shouldShowDriverSeatRequestLimitWarning', () => {
    it('returns true for owner when limit reached', () => {
        expect(
            shouldShowDriverSeatRequestLimitWarning(true, {
                seat_request_limit_reached: true,
            })
        ).toBe(true);
    });

    it('returns false for non-owner or when not reached', () => {
        expect(
            shouldShowDriverSeatRequestLimitWarning(false, {
                seat_request_limit_reached: true,
            })
        ).toBe(false);
        expect(
            shouldShowDriverSeatRequestLimitWarning(true, {
                seat_request_limit_reached: false,
            })
        ).toBe(false);
    });
});

describe('shouldShowPassengerSeatRequestLimitMessage', () => {
    it('returns true for non-owner when limit reached', () => {
        expect(
            shouldShowPassengerSeatRequestLimitMessage(false, {
                seat_request_limit_reached: true,
            })
        ).toBe(true);
    });

    it('returns false for owner or when not reached', () => {
        expect(
            shouldShowPassengerSeatRequestLimitMessage(true, {
                seat_request_limit_reached: true,
            })
        ).toBe(false);
        expect(
            shouldShowPassengerSeatRequestLimitMessage(false, {
                seat_request_limit_reached: false,
            })
        ).toBe(false);
    });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd carpoolear && npm run test:unit -- src/utils/tripSeatRequestsWarning.test.js
```

Expected: FAIL — missing exports / arity.

- [ ] **Step 3: Commit red**

```bash
cd carpoolear
git add src/utils/tripSeatRequestsWarning.test.js
git commit -m "$(cat <<'EOF'
test: seat request limit warning helper cases

EOF
)"
```

- [ ] **Step 4: Minimal implementation**

```js
export function shouldShowTripSeatRequestsWarning(
    owner,
    passengerPendingCount,
    seatRequestLimitReached = false
) {
    return (
        Boolean(owner) &&
        Number(passengerPendingCount) > 0 &&
        !seatRequestLimitReached
    );
}

export function shouldShowDriverSeatRequestLimitWarning(owner, trip) {
    return Boolean(owner) && Boolean(trip?.seat_request_limit_reached);
}

export function shouldShowPassengerSeatRequestLimitMessage(owner, trip) {
    return !owner && Boolean(trip?.seat_request_limit_reached);
}
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
cd carpoolear && npm run test:unit -- src/utils/tripSeatRequestsWarning.test.js
```

Expected: PASS

- [ ] **Step 6: Commit green**

```bash
cd carpoolear
git add src/utils/tripSeatRequestsWarning.js
git commit -m "$(cat <<'EOF'
feat: seat request limit warning helpers

EOF
)"
```

---

### Task 4: Frontend — i18n strings

**Files:**
- Modify: `carpoolear/src/language/i18n.js`

- [ ] **Step 1: Add keys next to `tripSeatRequestsDriverWarning` in every locale block**

Spanish (and duplicate Spanish locale if present):

```js
tripSeatRequestLimitPassengerMessage:
    'Este viaje ya llegó a su límite de {limit} solicitudes, el conductor las está evaluando, volvé más tarde',
tripSeatRequestLimitDriverWarning:
    'Este viaje llegó al límite de solicitudes de asiento, contestá las solicitudes para poder recibir más de otros usuarios interesados',
```

English:

```js
tripSeatRequestLimitPassengerMessage:
    'This trip has reached its limit of {limit} requests; the driver is reviewing them, try again later',
tripSeatRequestLimitDriverWarning:
    'This trip has reached the seat request limit; answer the requests to receive more from other interested users',
```

- [ ] **Step 2: Commit**

```bash
cd carpoolear
git add src/language/i18n.js
git commit -m "$(cat <<'EOF'
feat: i18n for seat request limit messages

EOF
)"
```

(No separate red/green — pure strings; covered by view tests in Tasks 5–6.)

---

### Task 5: Frontend — TripButtons passenger UX (TDD)

**Files:**
- Modify: `carpoolear/src/components/elements/TripButtons.vue`
- Modify: `carpoolear/src/components/elements/TripButtons.view.test.js`

- [ ] **Step 1: Write failing view tests**

Append to `TripButtons.view.test.js`:

```js
describe('TripButtons.vue seat request limit', () => {
    it('disables message and request actions and shows passenger limit message', () => {
        expect(viewSource).toContain('shouldShowPassengerSeatRequestLimitMessage');
        expect(viewSource).toContain('seatRequestLimitReached');
        expect(viewSource).toContain("$t('tripSeatRequestLimitPassengerMessage'");
        expect(viewSource).toContain('seat_request_limit');
        expect(viewSource).toMatch(
            /:disabled="[^"]*seatRequestLimitReached/
        );
    });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
cd carpoolear && npm run test:unit -- src/components/elements/TripButtons.view.test.js
```

Expected: FAIL

- [ ] **Step 3: Commit red**

```bash
cd carpoolear
git add src/components/elements/TripButtons.view.test.js
git commit -m "$(cat <<'EOF'
test: TripButtons seat request limit UI contract

EOF
)"
```

- [ ] **Step 4: Minimal implementation in `TripButtons.vue`**

1. Import helper:

```js
import { shouldShowPassengerSeatRequestLimitMessage } from '../../utils/tripSeatRequestsWarning.js';
```

2. Computed:

```js
seatRequestLimitReached() {
    return Boolean(this.trip && this.trip.seat_request_limit_reached);
},
showPassengerSeatRequestLimitMessage() {
    return shouldShowPassengerSeatRequestLimitMessage(
        this.owner,
        this.trip
    );
},
```

3. On **Enviar mensaje** and seat-request buttons, extend `:disabled` to include limit, e.g.:

```html
:disabled="sendingStatus || seatRequestLimitReached"
```

4. After the buttons container content (near existing `atencionViajeSolicitado` alert), add:

```html
<div
    class="alert alert-warning"
    role="alert"
    v-if="showPassengerSeatRequestLimitMessage"
>
    {{
        $t('tripSeatRequestLimitPassengerMessage', {
            limit: trip.seat_request_limit,
        })
    }}
</div>
```

Also hide/suppress seat request click when reached (disabled is enough).

- [ ] **Step 5: Run — expect PASS**

```bash
cd carpoolear && npm run test:unit -- src/components/elements/TripButtons.view.test.js
```

- [ ] **Step 6: Commit green**

```bash
cd carpoolear
git add src/components/elements/TripButtons.vue
git commit -m "$(cat <<'EOF'
feat: disable trip actions when seat request limit reached

EOF
)"
```

---

### Task 6: Frontend — driver warnings on trip detail + My Trips (TDD)

**Files:**
- Modify: `carpoolear/src/components/views/Trip.vue`
- Modify: `carpoolear/src/components/views/Trip.view.test.js`
- Modify: `carpoolear/src/components/sections/Trip.vue`
- Modify: `carpoolear/src/components/sections/Trip.view.test.js`

- [ ] **Step 1: Write failing view tests**

In `Trip.view.test.js`, add:

```js
describe('Trip.vue driver seat request limit warning', () => {
    it('prefers limit warning with my-trips link when limit reached', () => {
        expect(viewSource).toContain('shouldShowDriverSeatRequestLimitWarning');
        expect(viewSource).toContain("$t('tripSeatRequestLimitDriverWarning')");
        expect(viewSource).toMatch(
            /tripSeatRequestLimitDriverWarning[\s\S]*?name: 'my-trips'|name: 'my-trips'[\s\S]*?tripSeatRequestLimitDriverWarning/s
        );
        expect(viewSource).toContain('seat_request_limit_reached');
    });
});
```

In `sections/Trip.view.test.js`, add:

```js
describe('Trip card seat request limit warning', () => {
    it('shows driver limit warning on my-trips cards', () => {
        expect(viewSource).toContain('shouldShowDriverSeatRequestLimitWarning');
        expect(viewSource).toContain("$t('tripSeatRequestLimitDriverWarning')");
        expect(viewSource).toContain('seat_request_limit_reached');
    });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
cd carpoolear && npm run test:unit -- src/components/views/Trip.view.test.js src/components/sections/Trip.view.test.js
```

- [ ] **Step 3: Commit red**

```bash
cd carpoolear
git add src/components/views/Trip.view.test.js src/components/sections/Trip.view.test.js
git commit -m "$(cat <<'EOF'
test: driver seat request limit warning view contracts

EOF
)"
```

- [ ] **Step 4: Implement trip detail (`views/Trip.vue`)**

Update import:

```js
import {
    shouldShowTripSeatRequestsWarning,
    shouldShowDriverSeatRequestLimitWarning,
} from '../../utils/tripSeatRequestsWarning.js';
```

Template: add limit warning block (same alert styling), and gate generic pending warning:

```html
<div
    class="alert alert-warning trip-seat-requests-warning"
    role="alert"
    v-if="showSeatRequestLimitWarning"
>
    <i
        class="fa fa-exclamation-triangle trip-seat-requests-warning__icon"
        aria-hidden="true"
    ></i>
    <router-link :to="{ name: 'my-trips' }">
        {{ $t('tripSeatRequestLimitDriverWarning') }}
    </router-link>
</div>
<div
    class="alert alert-warning trip-seat-requests-warning"
    role="alert"
    v-if="showSeatRequestsWarning"
>
    <!-- existing pending warning content -->
</div>
```

Computed:

```js
showSeatRequestLimitWarning() {
    return shouldShowDriverSeatRequestLimitWarning(this.owner, this.trip);
},
showSeatRequestsWarning() {
    return shouldShowTripSeatRequestsWarning(
        this.owner,
        this.trip?.passengerPending_count,
        this.trip?.seat_request_limit_reached
    );
},
```

- [ ] **Step 5: Implement My Trips card (`sections/Trip.vue`)**

Import helpers. Add computed `isTripOwner` (`user.id === trip.user.id`) and `showSeatRequestLimitWarning`. Near top of card body (after sellado legend is fine), add:

```html
<div
    class="alert alert-warning trip-seat-request-limit-warning"
    role="alert"
    v-if="showSeatRequestLimitWarning"
    @click.stop
>
    {{ $t('tripSeatRequestLimitDriverWarning') }}
</div>
```

- [ ] **Step 6: Run — expect PASS**

```bash
cd carpoolear && npm run test:unit -- src/components/views/Trip.view.test.js src/components/sections/Trip.view.test.js
```

- [ ] **Step 7: Commit green**

```bash
cd carpoolear
git add src/components/views/Trip.vue src/components/sections/Trip.vue
git commit -m "$(cat <<'EOF'
feat: driver seat request limit warnings on detail and my trips

EOF
)"
```

---

### Task 7: Final verification

- [ ] **Step 1: Backend tests**

```bash
cd carpoolear_backend && php artisan test --filter='seat_request_limit|SeatRequestLimit|unanswered_conversation_or_requests'
```

Expected: PASS

- [ ] **Step 2: Frontend unit tests for touched files**

```bash
cd carpoolear && npm run test:unit -- src/utils/tripSeatRequestsWarning.test.js src/components/elements/TripButtons.view.test.js src/components/views/Trip.view.test.js src/components/sections/Trip.view.test.js
```

Expected: PASS

- [ ] **Step 3: Frontend lint + build**

```bash
cd carpoolear && npm run lint && npm run build
```

Expected: exit 0

- [ ] **Step 4: Fix any failures, commit fixes with `fix:` / `refactor:` as appropriate (still TDD if behavior changes)

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Keep counting (requests + conversations) | Task 1 uses existing `unansweredConversationOrRequestsByTrip` |
| `seat_request_limit` / `seat_request_limit_reached` on trip | Task 2 |
| Disable Enviar mensaje + seat request for passengers | Task 5 |
| Passenger message with configured `{limit}` | Tasks 4–5 |
| Driver warning on trip detail with my-trips link | Task 6 |
| Prefer limit warning over generic pending | Tasks 3, 6 |
| Driver warning on My Trips cards | Task 6 |
| API error fallback kept | No change required (already in stores) |
| Lint/build + backend tests | Task 7 |
| Out of scope: nx, counting change | Not in plan |
