# Admin support Club column Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a Club badge on the admin support ticket list and always list open Club Carpoolear tickets first, then the admin’s chosen column.

**Architecture:** Backend `SupportTicketAdminListSort` applies a Club-first `ORDER BY` and stamps `club_carpoolear_active` on each list row. Frontend reuses the existing admin sort URL pattern (`sort` + `direction`) and adds a non-sortable Club column after Prioridad.

**Tech Stack:** Laravel + PHPUnit in `carpoolear_backend/`; Vue 2 + Vitest in `carpoolear/`. i18n locales: `arg`, `chl`, `en`.

## Global Constraints

- Legacy `carpoolear/` and `carpoolear_backend/` only (not `carpoolear-nx/`)
- Branch: `support-club` in both repos
- TDD: commit `test:` on RED, then `feat:` on GREEN; optional `refactor:` if cleanup is separate
- Club member = `ClubCarpoolearMembershipService::isActiveMember` ( `monthly_donate` OR authorized `donation_subscriptions` ). Public badge opt-in does not matter
- Open = status not in `Resuelto`, `Cerrado`
- Club-first applies only to **open** Club tickets; closed/resolved Club tickets still show the logo
- Allowed sorts: `subject`, `priority`, `created_at`, `updated_at`, `status`, `assigned_to`, `type`
- Default order when `sort` omitted/invalid: Club-first, then `support_tickets.id` desc
- `club_carpoolear_active` is integer `0`/`1` on the ticket root of the **index** payload only
- Column order: Asunto | Prioridad | Club | Creado | Actualizado | Estado | Asignado a | Categoría
- Club header is not clickable
- First click: `created_at`/`updated_at`/`priority` → `desc`; others → `asc`
- i18n key `columnaClub` = `Club` in arg, chl, en (do not reuse `adminClubCarpoolear` for the header)
- Logo: `static/img/badges/club-carpoolear.png` at 20×20; alt = `$t('adminClubCarpoolear')`
- No Club filter, no detail-page badge, do not change stored ticket `priority`

**Spec:** `carpoolear/docs/superpowers/specs/2026-10-09-support-club-design.md`

---

### Task 1: Backend Club-first sort helper

**Files:**
- Create: `carpoolear_backend/tests/Unit/Support/SupportTicketAdminListSortTest.php`
- Create: `carpoolear_backend/app/Support/SupportTicketAdminListSort.php`

**Interfaces:**
- Consumes: `SupportTicket` query builder; `sort` / `direction` query strings
- Produces:
  - `SupportTicketAdminListSort::ALLOWED_SORTS`
  - `resolveSort(?string $sort): ?string`
  - `resolveDirection(?string $direction): string` — `asc` only if lowercase is `asc`, else `desc`
  - `apply(Builder $query, ?string $sort, ?string $direction): Builder` — always Club-first, then column or `id desc`, then `id desc` tiebreaker
  - `decorateClubActive(iterable $tickets): void` — sets `club_carpoolear_active` 0/1 on each model from current membership of `user_id`

Work from: `/Users/gonzalogm/Work/carpoolear/carpoolear_backend`

- [ ] **Step 1: Write the failing tests**

```php
<?php

namespace Tests\Unit\Support;

use Illuminate\Database\Eloquent\Builder;
use STS\Models\DonationSubscription;
use STS\Models\SupportTicket;
use STS\Models\User;
use STS\Support\SupportTicketAdminListSort;
use Tests\TestCase;

class SupportTicketAdminListSortTest extends TestCase
{
    public function test_resolve_sort_accepts_allowed_columns(): void
    {
        foreach ([
            'subject',
            'priority',
            'created_at',
            'updated_at',
            'status',
            'assigned_to',
            'type',
        ] as $sort) {
            $this->assertSame($sort, SupportTicketAdminListSort::resolveSort($sort));
        }
    }

    public function test_resolve_sort_returns_null_for_invalid_columns(): void
    {
        $this->assertNull(SupportTicketAdminListSort::resolveSort('not_a_column'));
        $this->assertNull(SupportTicketAdminListSort::resolveSort('club'));
        $this->assertNull(SupportTicketAdminListSort::resolveSort(null));
    }

    public function test_resolve_direction_defaults_to_desc_and_accepts_asc(): void
    {
        $this->assertSame('desc', SupportTicketAdminListSort::resolveDirection(null));
        $this->assertSame('asc', SupportTicketAdminListSort::resolveDirection('asc'));
        $this->assertSame('desc', SupportTicketAdminListSort::resolveDirection('DESC'));
        $this->assertSame('desc', SupportTicketAdminListSort::resolveDirection('nope'));
    }

    public function test_apply_orders_open_club_members_first_then_id_desc_by_default(): void
    {
        $query = SupportTicketAdminListSort::apply(SupportTicket::query(), null, null);
        $sql = strtolower($query->toSql());

        $this->assertInstanceOf(Builder::class, $query);
        $this->assertStringContainsString("status not in ('resuelto', 'cerrado')", $sql);
        $this->assertStringContainsString('monthly_donate', $sql);
        $this->assertStringContainsString('donation_subscriptions', $sql);
        $this->assertStringContainsString('authorized', $sql);
        $this->assertMatchesRegularExpression('/order by .+ `support_tickets`\\.`id` desc/', $sql);
    }

    public function test_apply_orders_by_priority_high_normal_low_after_club(): void
    {
        $query = SupportTicketAdminListSort::apply(SupportTicket::query(), 'priority', 'desc');
        $sql = strtolower($query->toSql());

        $this->assertStringContainsString("status not in ('resuelto', 'cerrado')", $sql);
        $this->assertStringContainsString("when `support_tickets`.`priority` = 'high' then 3", $sql);
        $this->assertStringContainsString("when `support_tickets`.`priority` = 'normal' then 2", $sql);
        $this->assertStringContainsString("when `support_tickets`.`priority` = 'low' then 1", $sql);
    }

    public function test_decorate_club_active_uses_current_membership_not_public_flag(): void
    {
        $hiddenMember = User::factory()->create([
            'monthly_donate' => true,
            'show_club_carpoolear_membership' => false,
        ]);
        $subscriber = User::factory()->create(['monthly_donate' => false]);
        DonationSubscription::create([
            'user_id' => $subscriber->id,
            'status' => 'authorized',
            'transaction_amount_cents' => 500000,
        ]);
        $outsider = User::factory()->create(['monthly_donate' => false]);

        $tickets = [
            new SupportTicket(['user_id' => $hiddenMember->id]),
            new SupportTicket(['user_id' => $subscriber->id]),
            new SupportTicket(['user_id' => $outsider->id]),
        ];

        SupportTicketAdminListSort::decorateClubActive($tickets);

        $this->assertSame(1, $tickets[0]->club_carpoolear_active);
        $this->assertSame(1, $tickets[1]->club_carpoolear_active);
        $this->assertSame(0, $tickets[2]->club_carpoolear_active);
    }
}
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd /Users/gonzalogm/Work/carpoolear/carpoolear_backend && composer test -- --filter=SupportTicketAdminListSortTest`

Expected: FAIL because `STS\Support\SupportTicketAdminListSort` does not exist.

- [ ] **Step 3: Commit RED**

```bash
git add tests/Unit/Support/SupportTicketAdminListSortTest.php
git commit -m "$(cat <<'EOF'
test: fail until admin support tickets sort Club-first

EOF
)"
```

- [ ] **Step 4: Minimal implementation**

Create `app/Support/SupportTicketAdminListSort.php` mirroring `ManualIdentityValidationSort` / `TripExcessContributionSort`:

- `ALLOWED_SORTS` as listed above
- Club-first SQL (always, including default):

```sql
CASE WHEN support_tickets.status NOT IN ('Resuelto', 'Cerrado')
  AND (
    EXISTS (SELECT 1 FROM users WHERE users.id = support_tickets.user_id AND users.monthly_donate = 1)
    OR EXISTS (
      SELECT 1 FROM donation_subscriptions
      WHERE donation_subscriptions.user_id = support_tickets.user_id
        AND donation_subscriptions.status = 'authorized'
    )
  )
THEN 0 ELSE 1 END
```

- Default after that: `orderBy('support_tickets.id', 'desc')`
- Explicit: `subject` → `support_tickets.subject`; `created_at`/`updated_at`/`status`/`type` → those columns; `priority` CASE high=3 normal=2 low=1; `assigned_to` left join assigned user as `support_ticket_assignees` (alias to avoid clashing with ticket owner), `orderByRaw('support_ticket_assignees.name IS NULL')` then name, unassigned last in both directions
- Always finish with `orderBy('support_tickets.id', 'desc')`
- `decorateClubActive`: batch-load user ids that are active members (monthly_donate true OR authorized subscription), set integer 0/1. Do not N+1.

- [ ] **Step 5: Run tests to verify they pass**

Run: `composer test -- --filter=SupportTicketAdminListSortTest`

Expected: PASS

- [ ] **Step 6: Commit GREEN**

```bash
git add app/Support/SupportTicketAdminListSort.php
git commit -m "$(cat <<'EOF'
feat: sort admin support tickets Club-first then chosen column

EOF
)"
```

If cleanup is needed, commit `refactor:` separately. Do not add controller wiring in this task.

---

### Task 2: Backend index payload and ordering

**Files:**
- Modify: `carpoolear_backend/app/Http/Controllers/Api/Admin/SupportTicketController.php` (`index` only)
- Modify: `carpoolear_backend/tests/Feature/Http/AdminSupportTicketControllerIntegrationTest.php`

**Interfaces:**
- Consumes: `SupportTicketAdminListSort` from Task 1
- Produces: `GET api/admin/support/tickets` honors `sort` + `direction`; each `data[]` row has `club_carpoolear_active` 0/1; Club-first SQL order; `show` unchanged

Work from: `/Users/gonzalogm/Work/carpoolear/carpoolear_backend`

- [ ] **Step 1: Write failing integration tests** in `AdminSupportTicketControllerIntegrationTest`

Reuse `adminUser()` / `makeTicket()`. Create owners with `monthly_donate` / `DonationSubscription` as in Task 1.

```php
public function test_index_includes_club_carpoolear_active_for_current_members(): void
{
    // hidden public badge still 1; non-member 0
}

public function test_index_lists_older_open_club_ticket_before_newer_open_non_club_ticket(): void
{
    // non-club ticket created second (higher id); club ticket must still be first
}

public function test_index_does_not_boost_older_closed_club_ticket_over_newer_open_non_club_ticket(): void
{
    // closed Club lower id, open non-club higher id → non-club first under default id desc
}

public function test_index_keeps_open_club_first_when_sorting_by_priority_desc(): void
{
    // open Club low, open Club high, open non-club high, open non-club low
    // expected: club high, club low, non-club high, non-club low
}

public function test_index_ignores_invalid_sort_and_still_applies_club_first(): void
{
    // sort=not_a_column still Club-first then id desc
}
```

- [ ] **Step 2: Run** `composer test -- --filter=AdminSupportTicketControllerIntegrationTest::test_index_includes_club_carpoolear_active`

Expected: FAIL (key missing).

- [ ] **Step 3: Commit RED** (`test: expose Club membership on admin support ticket list`)

- [ ] **Step 4: Wire `index`**

Replace `$query->orderByDesc('id')->paginate(...)` with:

```php
$query = SupportTicketAdminListSort::apply(
    $query,
    $request->query('sort'),
    $request->query('direction')
);
$paginator = $query->paginate($perPage, ['*'], 'page', $page);
SupportTicketAdminListSort::decorateClubActive($paginator->items());
```

Do not pass extra columns into `paginate` (that would drop eager loads / `*`). Do not change `show`.

- [ ] **Step 5: Run the new tests plus existing index filter tests.** PASS.

- [ ] **Step 6: Commit GREEN** (`feat: expose Club membership on admin support ticket list`)

---

### Task 3: Frontend sort params and first-click directions

**Files:**
- Modify: `carpoolear/src/utils/adminSupportTicketListFilters.js`
- Modify: `carpoolear/src/utils/adminSupportTicketListFilters.test.js`
- Modify: `carpoolear/src/stores/tickets.test.js` (extend the existing `fetchAdminList` params assertion)

**Interfaces:**
- Produces:
  - `ADMIN_SUPPORT_TICKET_SORT_COLUMNS` = `[{ key, labelKey }]` for `subject`, `priority`, `created_at`, `updated_at`, `status`, `assigned_to`, `type` (no Club)
  - `getNextAdminSupportTicketSortState(currentKey, currentDir, column)` — toggle if same key; else desc for `created_at`/`updated_at`/`priority`, asc otherwise
  - `buildAdminSupportTicketListParams` adds `sort` + `direction` when `sortKey` is set
  - `parseAdminSupportTicketListFiltersFromRoute` reads `sort` / `direction`; unknown sort → `sortKey: null`; direction only `asc` or `desc` (default `desc` if sort present and direction missing/invalid)

Work from: `/Users/gonzalogm/Work/carpoolear/carpoolear`

- [ ] **Step 1: Failing tests** for columns, next-state table, build/parse URL params.

- [ ] **Step 2: Run** `npx vitest run src/utils/adminSupportTicketListFilters.test.js` — FAIL.

- [ ] **Step 3: Commit RED** (`test: persist admin support ticket column sort in the URL`)

- [ ] **Step 4: Implement helpers.** Follow `adminManualIdentityValidationsList.js` / `adminTripExcessContributionList.js`.

- [ ] **Step 5: Tests PASS.** Update `tickets.test.js` so `fetchAdminList({ sortKey: 'priority', sortDir: 'desc' })` sends `{ sort: 'priority', direction: 'desc' }`.

- [ ] **Step 6: Commit GREEN** (`feat: persist admin support ticket column sort in the URL`)

---

### Task 4: Club column, logo, and sortable headers

**Files:**
- Modify: `carpoolear/src/components/views/AdminSupportTickets.vue`
- Modify: `carpoolear/src/components/views/AdminSupportTickets.view.test.js`
- Modify: `carpoolear/src/language/i18n.js` (`columnaClub: 'Club'` in `arg`, `chl`, `en`, next to `adminClubCarpoolear`)
- Create: `carpoolear/src/language/adminSupportClubColumn.test.js` (assert the three locales)
- Modify: `carpoolear/src/styles/supportTicketsTableCompact.css` (optional 20×20 club img class)
- Modify: `carpoolear/src/utils/adminSupportTicketListFilters.js` if a tiny `ticketOwnerIsClubMember` / badge URL helper is cleaner — only if tests live next to it

**Interfaces:**
- Consumes: Task 3 helpers; `ticket.club_carpoolear_active`
- Produces: Club column after Prioridad; 20×20 logo when flag is truthy (`Number(flag) === 1` or truthy 1); empty otherwise; sortable headers except Club; `sort`/`direction` in route query and `listFilters`; click resets page to 1

Work from: `/Users/gonzalogm/Work/carpoolear/carpoolear`

- [ ] **Step 1: Failing view + i18n tests**

View tests (source assertions, same style as the existing file):

- thead: `prioridad` then `columnaClub` then `creado`
- Club `<th>` has no `@click="toggleSort"`
- other headers call `toggleSort('subject'|'priority'|'created_at'|...)`
- row: Club `<td>` after priority cell, `v-if="ticketOwnerIsClubMember(ticket)"`, `width="20"` `height="20"`, `badges/club-carpoolear.png`, `$t('adminClubCarpoolear')` alt
- `syncFiltersToRoute` writes `sort` and `direction`

- [ ] **Step 2: Run** `npx vitest run src/components/views/AdminSupportTickets.view.test.js src/language/adminSupportClubColumn.test.js` — FAIL.

- [ ] **Step 3: Commit RED** (`test: show Club badge on admin support ticket list`)

- [ ] **Step 4: Implement**

Badge URL: same as `ProfileInfo` (`process.env.ROUTE_BASE + 'img/badges/club-carpoolear.png'`). Header click styling can copy `.admin-manual-th-sort` as `.admin-support-th-sort`. Club `<th>` is not a button.

`listFilters` includes `sortKey` / `sortDir`. `initFiltersFromRoute` / `syncFiltersToRoute` persist them. `toggleSort` uses `getNextAdminSupportTicketSortState` and resets `listPage` to 1.

- [ ] **Step 5: Tests PASS.** Existing AdminSupportTickets view tests that assumed Club-less column order must be updated so they still pass (priority then Club then dates).

- [ ] **Step 6: Commit GREEN** (`feat: show Club badge on admin support ticket list`)

- [ ] **Step 7:** If the Vue file needs a small extract for membership/badge URL, `refactor:` commit after green.

---

## Self-review

1. Spec coverage: membership, open-only boost, payload flag, sort allow-list, default id desc, UI column order, non-clickable Club, URL sort, first-click directions, i18n, tests — each has a task.
2. No placeholders.
3. Sort keys in Task 1 match Task 3/4. `columnaClub` and `club_carpoolear_active` names are consistent.
