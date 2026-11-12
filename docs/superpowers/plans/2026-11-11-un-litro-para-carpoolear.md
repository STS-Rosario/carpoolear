# Un litro para Carpoolear Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship an informational “Un litro para Carpoolear” page on the public website and inside the app, plus an FAQ entry that links to it.

**Architecture:** Separate Blade page on `carpoolear.com.ar` and separate Vue page in the app (duplicated markup/CSS). Shared FAQ Blade HTML links to `/un-litro-para-carpoolear`; the app intercepts that href via `staticPageLinks.js`. Do **not** register the page in `StaticPageContentService`.

**Tech Stack:** Laravel Blade + PHPUnit in `carpoolear_backend/`; Vue 3 + Vue Router + Vitest + Font Awesome 4 in `carpoolear/`.

## Global Constraints

- Legacy `carpoolear/` and `carpoolear_backend/` only (not `carpoolear-nx/`)
- Branch: `feat/un-litro-para-carpoolear` in both repos
- TDD: commit `test:` on RED, then `feat:` on GREEN; optional `refactor:` if cleanup is separate
- URL path: `/un-litro-para-carpoolear` on website and in app
- Vue route name: `un_litro_para_carpoolear`
- i18n key: `unLitroParaCarpoolear` — `arg`: `Un litro para Carpoolear`; `en`: `One liter for Carpoolear` (same placement as `divisionDeGastos`; `chl` has no parallel key today — do not invent one unless already required by other menus)
- FAQ question exact text: `¿Qué es Un litro para Carpoolear?`
- FAQ answer: `Conocé más detalles sobre Un litro para Carpoolear acá.` with link on `más detalles sobre Un litro para Carpoolear acá` → `href="/un-litro-para-carpoolear"`
- Visual reference: mockup screenshot attached to the originating chat (`Frame_1-….jpg`); ignore site header/footer below the blue nonprofit card
- Icons: approximate with FA/Themify + inline SVG jerry-can; final assets later
- Spanish page copy is hardcoded in both implementations (Appendix A); both must match
- No fee/charging backend logic

**Spec:** `carpoolear/docs/superpowers/specs/2026-11-11-un-litro-para-carpoolear-design.md`

---

## File structure

| File | Responsibility |
| --- | --- |
| `carpoolear_backend/resources/views/static-pages/plataforma-preguntas-frecuentes.blade.php` | FAQ Q&A + link |
| `carpoolear_backend/resources/views/un-litro-para-carpoolear.blade.php` | Full website page (HTML + scoped CSS) |
| `carpoolear_backend/app/Http/Controllers/HomeController.php` | `unLitroParaCarpoolear()` → view |
| `carpoolear_backend/routes/web.php` | Public GET route |
| `carpoolear_backend/resources/views/layouts/navbar.blade.php` | Plataforma menu item |
| `carpoolear_backend/tests/Feature/Http/PlataformaPreguntasFrecuentesTest.php` | FAQ assertions |
| `carpoolear_backend/tests/Feature/Http/StaticPageApiTest.php` | FAQ API contains new link |
| `carpoolear_backend/tests/Feature/Http/UnLitroParaCarpoolearPageTest.php` | Website page content |
| `carpoolear_backend/tests/Unit/Http/Controllers/HomeControllerTest.php` | Controller → view mapping |
| `carpoolear_backend/tests/Feature/Http/StaticPageNavigationTest.php` | Include new path in nav smoke data |
| `carpoolear/src/utils/staticPageLinks.js` | Map href → Vue route name |
| `carpoolear/src/router/routes.js` | In-app route |
| `carpoolear/src/language/i18n.js` | Page title key |
| `carpoolear/src/language/menuLabels.test.js` | Title label expectations |
| `carpoolear/src/components/views/UnLitroParaCarpoolear.vue` | In-app page UI |
| `carpoolear/src/components/views/UnLitroParaCarpoolear.view.test.js` | View + route wiring tests |
| `carpoolear/src/utils/staticPageLinks.test.js` | Mapping assertion |
| `carpoolear/src/components/views/StaticHtmlPage.view.test.js` | Route name presence (optional extend) |

---

### Task 1: FAQ entry (backend)

**Files:**
- Modify: `carpoolear_backend/resources/views/static-pages/plataforma-preguntas-frecuentes.blade.php`
- Modify: `carpoolear_backend/tests/Feature/Http/PlataformaPreguntasFrecuentesTest.php`
- Modify: `carpoolear_backend/tests/Feature/Http/StaticPageApiTest.php`

**Interfaces:**
- Consumes: existing FAQ partial served at `/plataforma-preguntas-frecuentes` and `GET api/static-pages/faq`
- Produces: FAQ HTML containing the new `<h3>` and `<a href="/un-litro-para-carpoolear">…</a>`

Work from: `/Users/gonzalogm/Work/carpoolear/carpoolear_backend`

- [ ] **Step 1: Write the failing tests**

Add to `PlataformaPreguntasFrecuentesTest.php`:

```php
public function test_un_litro_faq_links_to_un_litro_page(): void
{
    $response = $this->get('/plataforma-preguntas-frecuentes');

    $response->assertOk();
    $response->assertSee('¿Qué es Un litro para Carpoolear?', false);
    $response->assertSee(
        'Conocé <a href="/un-litro-para-carpoolear">más detalles sobre Un litro para Carpoolear acá</a>.',
        false
    );
}
```

Add assertion to `StaticPageApiTest::test_faq_static_page_is_public_and_returns_html_content` (keep existing assertions):

```php
$this->assertStringContainsString(
    '<a href="/un-litro-para-carpoolear">más detalles sobre Un litro para Carpoolear acá</a>',
    $decoded['content']
);
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
./vendor/bin/phpunit --filter 'PlataformaPreguntasFrecuentesTest::test_un_litro_faq_links_to_un_litro_page|StaticPageApiTest::test_faq_static_page_is_public_and_returns_html_content'
```

Expected: FAIL — missing FAQ strings / link.

- [ ] **Step 3: Commit failing tests**

```bash
git add tests/Feature/Http/PlataformaPreguntasFrecuentesTest.php tests/Feature/Http/StaticPageApiTest.php
git commit -m "$(cat <<'EOF'
test: expect Un litro FAQ entry and link

EOF
)"
```

- [ ] **Step 4: Add FAQ HTML**

Insert near the contribution FAQ items (after `¿Cómo se calcula la contribución para un viaje?` is fine):

```blade
<h3>¿Qué es Un litro para Carpoolear?</h3>
<p>Conocé <a href="/un-litro-para-carpoolear">más detalles sobre Un litro para Carpoolear acá</a>.</p>
```

Note: sentence is `Conocé ` + linked phrase + `.` so the visible text reads “Conocé más detalles sobre Un litro para Carpoolear acá.”

- [ ] **Step 5: Run tests to verify they pass**

Same phpunit filter as Step 2. Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add resources/views/static-pages/plataforma-preguntas-frecuentes.blade.php
git commit -m "$(cat <<'EOF'
feat: add Un litro FAQ question with page link

EOF
)"
```

---

### Task 2: Website page route, controller, navbar, and Blade UI

**Files:**
- Create: `carpoolear_backend/tests/Feature/Http/UnLitroParaCarpoolearPageTest.php`
- Create: `carpoolear_backend/resources/views/un-litro-para-carpoolear.blade.php`
- Modify: `carpoolear_backend/app/Http/Controllers/HomeController.php`
- Modify: `carpoolear_backend/routes/web.php`
- Modify: `carpoolear_backend/resources/views/layouts/navbar.blade.php`
- Modify: `carpoolear_backend/tests/Unit/Http/Controllers/HomeControllerTest.php`
- Modify: `carpoolear_backend/tests/Feature/Http/StaticPageNavigationTest.php`

**Interfaces:**
- Consumes: `layouts.master` (navbar/footer provided by layout)
- Produces: `HomeController::unLitroParaCarpoolear(): View` returning view name `un-litro-para-carpoolear`; public `GET /un-litro-para-carpoolear`

Work from: `/Users/gonzalogm/Work/carpoolear/carpoolear_backend`

- [ ] **Step 1: Write the failing tests**

Create `tests/Feature/Http/UnLitroParaCarpoolearPageTest.php`:

```php
<?php

namespace Tests\Feature\Http;

use Tests\TestCase;

class UnLitroParaCarpoolearPageTest extends TestCase
{
    public function test_page_is_accessible_and_contains_key_sections(): void
    {
        $response = $this->get('/un-litro-para-carpoolear');

        $response->assertOk();
        $response->assertSee('¿Qué es 1 litro para Carpoolear?', false);
        $response->assertSee('Así funciona', false);
        $response->assertSee('Un peaje más, para la comunidad', false);
        $response->assertSee('Se divide entre todas las personas que viajan', false);
        $response->assertSee('Tus 2 primeros viajes son sin cargo', false);
        $response->assertSee('1/4 L', false);
        $response->assertSee(
            'Si nadie se sube a tu viaje, se aplica para el siguiente',
            false
        );
        $response->assertSee(
            'es y va a seguir siendo un proyecto sin fines de lucro',
            false
        );
    }

    public function test_plataforma_nav_includes_un_litro_link(): void
    {
        $response = $this->get('/un-litro-para-carpoolear');

        $response->assertOk();
        $response->assertSee('href="un-litro-para-carpoolear"', false);
        $response->assertSee('Un litro para Carpoolear', false);
    }
}
```

Add to `HomeControllerTest::viewMethodProvider()`:

```php
'un litro para carpoolear' => ['unLitroParaCarpoolear', 'un-litro-para-carpoolear'],
```

Add to `StaticPageNavigationTest::staticPageProvider()`:

```php
'un litro para carpoolear' => ['/un-litro-para-carpoolear'],
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
./vendor/bin/phpunit --filter 'UnLitroParaCarpoolearPageTest|HomeControllerTest::test_static_pages_return_expected_view|StaticPageNavigationTest'
```

Expected: FAIL — route/view/method missing (404 or missing data-provider method).

- [ ] **Step 3: Commit failing tests**

```bash
git add tests/Feature/Http/UnLitroParaCarpoolearPageTest.php tests/Unit/Http/Controllers/HomeControllerTest.php tests/Feature/Http/StaticPageNavigationTest.php
git commit -m "$(cat <<'EOF'
test: expect Un litro website page and nav entry

EOF
)"
```

- [ ] **Step 4: Wire controller, route, navbar**

In `HomeController.php` (next to `divisionDeGastos`):

```php
public function unLitroParaCarpoolear()
{
    return view('un-litro-para-carpoolear');
}
```

In `routes/web.php` (next to division-de-gastos route):

```php
Route::get('/un-litro-para-carpoolear', [HomeController::class, 'unLitroParaCarpoolear']);
```

In `navbar.blade.php` Plataforma mega-menu, add:

```blade
<li>
    <a href="un-litro-para-carpoolear">Un litro para Carpoolear</a>
</li>
```

- [ ] **Step 5: Implement Blade page UI**

Create `resources/views/un-litro-para-carpoolear.blade.php` extending `layouts.master`:

```blade
@extends('layouts.master')

@section('title', 'Un litro para Carpoolear - Carpoolear')
@section('body-class', 'body-plataforma un-litro-para-carpoolear-page')

@section('content')
<style>
  /* Scoped under .un-litro — see Appendix A for copy; match mockup colors:
     red #D32F2F, blue #1976D2, dark blue banner ~#0D47A1 / #1565C0,
     light grey cards, mobile stack rules from spec. */
</style>
<div class="un-litro">
  <!-- sections 1–5 from Appendix A; jerry-can = inline SVG; icons = ti-* / fa-* -->
</div>
@endsection
```

Implement all five sections from Appendix A with responsive CSS:

- Desktop: hero 2-col; peaje cards 2-col; seats beside copy; free-trips horizontal
- Mobile: stack hero; stack cards; seats 2×2; free-trips vertical
- Scope all selectors under `.un-litro` (and/or `body.un-litro-para-carpoolear-page`) so theme CSS does not leak oddly
- Jerry-can: inline SVG with text “1L para carpoolear” (placeholder OK)
- Blue nonprofit banner uses existing logo asset e.g. `img/logo-light.png` on the blue background

Do **not** put page content in `static-pages/` and do **not** touch `StaticPageContentService`.

- [ ] **Step 6: Run tests to verify they pass**

```bash
./vendor/bin/phpunit --filter 'UnLitroParaCarpoolearPageTest|HomeControllerTest::test_static_pages_return_expected_view|StaticPageNavigationTest'
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add app/Http/Controllers/HomeController.php routes/web.php resources/views/layouts/navbar.blade.php resources/views/un-litro-para-carpoolear.blade.php
git commit -m "$(cat <<'EOF'
feat: add Un litro para Carpoolear website page

EOF
)"
```

---

### Task 3: App route, i18n, and FAQ link mapping

**Files:**
- Modify: `carpoolear/src/utils/staticPageLinks.js`
- Modify: `carpoolear/src/utils/staticPageLinks.test.js`
- Modify: `carpoolear/src/router/routes.js`
- Modify: `carpoolear/src/language/i18n.js`
- Modify: `carpoolear/src/language/menuLabels.test.js`
- Modify: `carpoolear/src/components/views/StaticHtmlPage.view.test.js`
- Create: `carpoolear/src/components/views/UnLitroParaCarpoolear.view.test.js` (route/layout wiring only; section copy assertions in Task 4)

**Interfaces:**
- Consumes: FAQ HTML `href="/un-litro-para-carpoolear"`
- Produces: `INTERNAL_STATIC_PAGE_ROUTES['/un-litro-para-carpoolear'] === 'un_litro_para_carpoolear'`; Vue route with that name and path

Work from: `/Users/gonzalogm/Work/carpoolear/carpoolear`

- [ ] **Step 1: Write the failing tests**

Extend `staticPageLinks.test.js`:

```js
expect(utilSource).toContain(
    "'/un-litro-para-carpoolear': 'un_litro_para_carpoolear'"
);
```

Extend `StaticHtmlPage.view.test.js` static help page routes example:

```js
expect(routesSource).toContain("name: 'un_litro_para_carpoolear'");
expect(routesSource).toContain("path: '/un-litro-para-carpoolear'");
```

Extend `menuLabels.test.js` `MENU_LABELS.arg` / `.en`:

```js
unLitroParaCarpoolear: 'Un litro para Carpoolear', // arg
unLitroParaCarpoolear: 'One liter for Carpoolear', // en
```

Create `UnLitroParaCarpoolear.view.test.js`:

```js
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'UnLitroParaCarpoolear.vue');
const routesPath = path.resolve(__dirname, '../../router/routes.js');

describe('UnLitroParaCarpoolear page wiring', () => {
    it('registers an in-app route that loads the Vue page (not StaticHtmlPage)', () => {
        const routesSource = fs.readFileSync(routesPath, 'utf8');
        expect(routesSource).toContain("path: '/un-litro-para-carpoolear'");
        expect(routesSource).toContain("name: 'un_litro_para_carpoolear'");
        expect(routesSource).toContain('UnLitroParaCarpoolear');
        expect(routesSource).not.toMatch(
            /path:\s*'\/un-litro-para-carpoolear'[\s\S]*?pageSlug:\s*'un-litro-para-carpoolear'/
        );
    });

    it('wraps content with AccountSettingsLayout and the page title key', () => {
        const viewSource = fs.readFileSync(viewPath, 'utf8');
        expect(viewSource).toContain('AccountSettingsLayout');
        expect(viewSource).toContain('unLitroParaCarpoolear');
    });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:unit -- src/utils/staticPageLinks.test.js src/components/views/StaticHtmlPage.view.test.js src/language/menuLabels.test.js src/components/views/UnLitroParaCarpoolear.view.test.js
```

Expected: FAIL — missing mapping / route / i18n / component file.

- [ ] **Step 3: Commit failing tests**

```bash
git add src/utils/staticPageLinks.test.js src/components/views/StaticHtmlPage.view.test.js src/language/menuLabels.test.js src/components/views/UnLitroParaCarpoolear.view.test.js
git commit -m "$(cat <<'EOF'
test: expect Un litro in-app route and FAQ link map

EOF
)"
```

- [ ] **Step 4: Implement mapping, i18n, route, and stub Vue page**

`staticPageLinks.js`:

```js
const INTERNAL_STATIC_PAGE_ROUTES = {
    '/division-de-gastos': 'division_de_gastos',
    '/verificacion-cuenta': 'verificacion_cuenta',
    '/un-litro-para-carpoolear': 'un_litro_para_carpoolear'
};
```

`i18n.js` next to `divisionDeGastos` in `arg` and `en`:

```js
unLitroParaCarpoolear: 'Un litro para Carpoolear', // arg
unLitroParaCarpoolear: 'One liter for Carpoolear', // en
```

`routes.js` — import + route (near FAQ routes):

```js
const UnLitroParaCarpoolear = () =>
    import('../components/views/UnLitroParaCarpoolear.vue');
```

```js
{
    path: '/un-litro-para-carpoolear',
    name: 'un_litro_para_carpoolear',
    component: UnLitroParaCarpoolear,
    meta: {
        actionbar: {
            header: {
                titleKey: 'unLitroParaCarpoolear',
                buttons: ['back']
            }
        }
    }
},
```

Create stub `UnLitroParaCarpoolear.vue` so the lazy import resolves (full UI in Task 4):

```vue
<template>
    <AccountSettingsLayout page-title-key="unLitroParaCarpoolear">
        <div class="un-litro">Un litro para Carpoolear</div>
    </AccountSettingsLayout>
</template>
<script>
import AccountSettingsLayout from '../layouts/AccountSettingsLayout.vue';
export default {
    name: 'UnLitroParaCarpoolear',
    components: { AccountSettingsLayout }
};
</script>
```

- [ ] **Step 5: Run tests to verify they pass**

Same vitest command as Step 2. Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/utils/staticPageLinks.js src/router/routes.js src/language/i18n.js src/language/menuLabels.test.js src/components/views/UnLitroParaCarpoolear.vue src/components/views/UnLitroParaCarpoolear.view.test.js src/components/views/StaticHtmlPage.view.test.js
git commit -m "$(cat <<'EOF'
feat: wire Un litro in-app route and FAQ link map

EOF
)"
```

---

### Task 4: App Vue page UI (match website content)

**Files:**
- Modify: `carpoolear/src/components/views/UnLitroParaCarpoolear.vue`
- Modify: `carpoolear/src/components/views/UnLitroParaCarpoolear.view.test.js`

**Interfaces:**
- Consumes: `AccountSettingsLayout`, Font Awesome icons, Appendix A copy
- Produces: In-app page visually equivalent to the Blade page (app header/footer from shell)

Work from: `/Users/gonzalogm/Work/carpoolear/carpoolear`

- [ ] **Step 1: Extend failing content tests**

```js
it('renders the informational sections from the Un litro mockup', () => {
    const viewSource = fs.readFileSync(viewPath, 'utf8');
    expect(viewSource).toContain('¿Qué es 1 litro para Carpoolear?');
    expect(viewSource).toContain('Así funciona');
    expect(viewSource).toContain('Un peaje más, para la comunidad');
    expect(viewSource).toContain('Se divide entre todas las personas que viajan');
    expect(viewSource).toContain('Tus 2 primeros viajes son sin cargo');
    expect(viewSource).toContain('1/4 L');
    expect(viewSource).toContain(
        'Si nadie se sube a tu viaje, se aplica para el siguiente'
    );
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:unit -- src/components/views/UnLitroParaCarpoolear.view.test.js
```

Expected: FAIL — stub lacks section copy.

- [ ] **Step 3: Commit failing test**

```bash
git add src/components/views/UnLitroParaCarpoolear.view.test.js
git commit -m "$(cat <<'EOF'
test: expect Un litro in-app page section copy

EOF
)"
```

- [ ] **Step 4: Implement full Vue UI**

Replace stub with full markup + scoped CSS mirroring the Blade page (Appendix A). Use `fa-*` icons. Keep structure/class names close to the Blade version for easier future icon/copy sync. Use app logo path for the blue banner if an existing light logo exists under `static/img/`; otherwise text wordmark “carpoolear” is acceptable.

Handle `back-click` like other account pages if needed (`bus.on('back-click', …)` + `router.back()`), matching `StaticHtmlPage` / similar views.

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm run test:unit -- src/components/views/UnLitroParaCarpoolear.view.test.js src/utils/staticPageLinks.test.js src/language/menuLabels.test.js
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/views/UnLitroParaCarpoolear.vue src/components/views/UnLitroParaCarpoolear.view.test.js
git commit -m "$(cat <<'EOF'
feat: build Un litro para Carpoolear in-app page

EOF
)"
```

---

## Appendix A — Canonical Spanish copy

Use this text in **both** Blade and Vue (headings/labels must match tests).

### Hero

- Title: `¿Qué es 1 litro para Carpoolear?`
- Lead: `Es el valor de 1 litro de nafta que se suma a los gastos compartidos del viaje, para sostener la comunidad.`
- Body: `Carpoolear es un proyecto sin fines de lucro de la asociación civil STS Rosario. Este aporte ayuda a mantener la plataforma, la mesa de ayuda y las mejoras para la comunidad.`
- Card title: `Así funciona`
- Bullets:
  1. `Tus 2 primeros viajes son sin cargo`
  2. `Desde el tercero se suma 1 litro`
  3. `Se divide entre quienes viajan`
  4. `Sólo en algunos trayectos`

### Un peaje más, para la comunidad

- Section title: `Un peaje más, para la comunidad`
- Left card title: `Gastos compartidos del viaje`
  - `Nafta`
  - `Peajes`
  - `+ 1 litro para Carpoolear` (highlighted)
  - `Todo se divide entre quienes viajan`
- Right card title: `El dinero se usa para`
  - `Plataforma` — `Mantener el sitio y la app`
  - `Mesa de ayuda` — `Acompañar a las personas usuarias`
  - `Mejoras` — `Nuevas funciones y mejoras`

### Se divide entre todas las personas que viajan

- Section title: `Se divide entre todas las personas que viajan`
- Seats: `Conductor`, `Acompañante`, `Trasero 1`, `Trasero 2` — each `1/4 L`
- Explainer: `Quien conduce lo paga al publicar el viaje y después lo comparte, igual que la nafta y los peajes.`
- Note: `Si nadie se sube a tu viaje, se aplica para el siguiente`

### Tus 2 primeros viajes son sin cargo

- Section title: `Tus 2 primeros viajes son sin cargo`
- `Primer viaje` / `Sin cargo`
- `Segundo viaje` / `Sin cargo`
- `Tercer viaje` / `Suma 1 litro`

### Blue banner

- `carpoolear es y va a seguir siendo un proyecto sin fines de lucro, que se sostiene con trabajo voluntario.`

If the attached mockup uses slightly different secondary sentences, prefer the mockup wording for non-asserted body text, but keep all **asserted** strings above unchanged.

---

## Self-review

1. **Spec coverage:** FAQ link (Task 1); website page + Plataforma nav (Task 2); in-app page + staticPageLinks (Tasks 3–4); mobile/icons/placeholders covered in Tasks 2 & 4; no StaticPageContentService registration — explicit.
2. **Placeholders:** None left as TBD; Appendix A supplies copy.
3. **Consistency:** Path `/un-litro-para-carpoolear`, route name `un_litro_para_carpoolear`, i18n `unLitroParaCarpoolear` used throughout.
