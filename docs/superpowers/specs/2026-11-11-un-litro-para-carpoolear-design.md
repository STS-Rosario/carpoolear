# Un litro para Carpoolear — informational page + FAQ

**Date:** 2026-11-11  
**Branches:** `feat/un-litro-para-carpoolear` in `carpoolear/` and `carpoolear_backend/`  
**Out of scope:** `carpoolear-nx/`, final custom icon assets (placeholders OK), charging/backend fee logic, site/app chrome (header/footer vary by shell)

## Goal

Explain “Un litro para Carpoolear” with a designed informational page on the public website and inside the app, and add an FAQ entry that links to that page.

## Decisions

| Topic | Choice |
| --- | --- |
| Surfaces | Website **and** in-app page (not website-only) |
| Implementation | **Separate** Blade page on the site + **separate** Vue page in the app (duplicated markup/CSS; not a shared `StaticPageContentService` HTML slug) |
| Nav | Add under website **Plataforma** menu |
| URL | `/un-litro-para-carpoolear` on both surfaces |
| Icons | Approximate with existing FA/Themify + inline SVG jerry-can; replace later |

## Architecture

Two independent page implementations of the same mockup, plus one shared FAQ entry:

| Surface | Implementation | Route |
| --- | --- | --- |
| Website (`carpoolear.com.ar`) | Blade view with scoped custom CSS (rich layout like `aportar`), extends `layouts.master` | `/un-litro-para-carpoolear` |
| App (`carpoolear/`) | Vue view inside `AccountSettingsLayout` with scoped CSS | `/un-litro-para-carpoolear` |
| FAQ (shared Blade HTML) | New Q&A in `static-pages/plataforma-preguntas-frecuentes.blade.php` | Link href `/un-litro-para-carpoolear` |

### Website wiring (`carpoolear_backend/`)

- New view: `resources/views/un-litro-para-carpoolear.blade.php`
- `HomeController` action returning that view
- `Route::get('/un-litro-para-carpoolear', ...)` in `routes/web.php`
- Navbar item under Plataforma: **Un litro para Carpoolear** → `un-litro-para-carpoolear`
- FAQ Q&A in the shared FAQ partial (see Content)

**Do not** register this page in `StaticPageContentService` — the app does not fetch this page body via `/api/static-pages/{slug}`.

### App wiring (`carpoolear/`)

- New component e.g. `src/components/views/UnLitroParaCarpoolear.vue`
- Vue route: path `/un-litro-para-carpoolear`, name `un_litro_para_carpoolear`, component above, wrapped by existing account/settings chrome via `AccountSettingsLayout`
- `staticPageLinks.js`: map `'/un-litro-para-carpoolear': 'un_litro_para_carpoolear'` so FAQ relative links stay in-app
- i18n title key for the layout page title (Spanish string matching the topic)

### How FAQ linking works

FAQ HTML is still the shared Blade partial served on the website and via `GET /api/static-pages/faq` in the app.

- On the website, `/un-litro-para-carpoolear` hits the Blade page.
- In the app, `bindStaticPageLinks` intercepts the same href and navigates to the Vue route.

## Content & layout

Page sections (match desktop mockup; ignore anything below the blue nonprofit banner):

1. **Hero** — jerry-can mark + heading “¿Qué es 1 litro para Carpoolear?” + short definition + nonprofit/STS blurb; side card “Así funciona” with four bullets (first 2 trips free; from the third add 1 liter; divided among travelers; only on some routes).
2. **Un peaje más, para la comunidad** — two cards: shared trip costs (Nafta, Peajes, highlighted + 1 litro para Carpoolear, divided among travelers) and “El dinero se usa para” (Plataforma, Mesa de ayuda, Mejoras).
3. **Se divide entre todas las personas que viajan** — four seats labeled Conductor / Acompañante / Trasero 1 / Trasero 2 each showing **1/4 L**; short explainer that the driver pays on publish then shares like gas/tolls; blue note: if nobody joins, it applies to the next trip.
4. **Tus 2 primeros viajes son sin cargo** — Primer viaje / Segundo viaje “Sin cargo”; Tercer viaje “Suma 1 litro”.
5. **Blue banner** — Carpoolear remains a nonprofit sustained by volunteer work.

### FAQ entry

- **Question:** ¿Qué es Un litro para Carpoolear?
- **Answer:** Conocé más detalles sobre Un litro para Carpoolear acá.
- Link text (portion of the sentence): **más detalles sobre Un litro para Carpoolear acá** → `href="/un-litro-para-carpoolear"`

Copy follows the mockup. No extra product rules beyond “sólo en algunos trayectos” (do not invent which routes).

## Visual system, mobile, icons

- Colors: Carpoolear red (~`#D32F2F`), blue (~`#1976D2` / darker blue banner), light grey cards, white page background.
- Typography: sans-serif consistent with each shell.
- Scoped CSS per implementation (Blade `<style>` / Vue scoped or dedicated stylesheet) so styles do not leak globally.

**Mobile**

- Hero: stack jerry-can + title, body, then “Así funciona”.
- Cost / use cards: stack vertically.
- Seats: 2×2 grid, then explainer + note.
- Free-trips: vertical steps / timeline.

**Icons (placeholders OK)**

- Jerry-can hero: simple inline SVG until final asset is provided.
- Other icons: existing Font Awesome (app) / Themify or FA (site) approximations for check, fuel, users, map, ticket, platform, headset, sparkle, dollar.

Spanish copy is hardcoded in both page implementations (same approach as other informational content). App chrome title uses i18n.

## Testing

Match existing lightweight patterns:

- App: assert route registration and `staticPageLinks` mapping (same style as división de gastos tests).
- Backend: assert FAQ link / navbar entry only if nearby tests already cover those files; otherwise no heavy new suite required.

## Success criteria

- Public URL `/un-litro-para-carpoolear` shows the designed page on the website (with site header/footer).
- In-app route `/un-litro-para-carpoolear` shows the same content structure (with app header).
- FAQ lists the new question; “más detalles sobre Un litro para Carpoolear acá” opens the new page in each shell.
- Plataforma menu includes the new item on the website.
- Layout is usable on mobile without horizontal overflow of the main sections.
