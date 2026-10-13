# AGENTS.md

Guidance for AI agents working in this repository (Carpoolear frontend).
See `CLAUDE.md` for full architecture, commands, and project layout.

## Unit tests and lint

- Run the full unit suite with `npm run test:unit` (Vitest, ~100-140s,
  ~500 files / ~2600 tests). A single file is faster:
  `npx vitest run src/<path>.test.js`.
- Lint with `npm run lint` (`eslint --ext .js src`). ESLint does **not**
  parse `.vue` files, so template/script issues in `.vue` are only caught by
  tests that read the file source.
- The pre-commit hook runs `eslint --fix src` then `eslint src`. Keep the
  tree lint-clean before committing.

## Line endings (important)

The repo uses CRLF in local checkouts (`core.autocrlf=true`) but LF in CI,
and there is **no** `.gitattributes`. Tests that read `.vue`/source files and
assert on exact substrings **must** normalize line endings first:

```js
const viewSource = fs
    .readFileSync(viewPath, 'utf8')
    .replace(/\r\n/g, '\n');
```

Without this, assertions like `expect(viewSource).toContain('.x {\n ... }')`
pass locally and fail on CI (or vice versa). Always keep assertions strict
(assert the real markup/format) and normalize the source, rather than
loosening the assertion.

## Screenshot methodology

Screenshots for frontend changes (used in PR reports under `interno/`) are
produced with Playwright against the dev server using mocked API responses.
No backend is required.

### Setup

1. Start the dev server (serves on `http://localhost:8080`):
   `npm run dev`
2. Confirm Playwright browsers are installed: `npx playwright install`.

### How the harness works

- Config: `playwright.config.js` defines the `frontend` project with
  `testDir: ./e2e-frontend`, `browserName: chromium`,
  `viewport: 1280x720`, `timezoneId: UTC`, and
  `baseURL: http://localhost:8080` (override with `BASE_URL`).
- Spec: `e2e-frontend/screenshots.spec.js` covers guest, public,
  authenticated, and admin views.
- Shared mock helpers: `e2e-frontend/shared/mocks.js` exports
  `setupCatchAllMock`, `setupCommonMocks`, `setupAuthState`, `freezeClock`,
  `waitForPageReady`, `paginated`, and `MOCK_*` fixtures. Use these to make
  pages render deterministically without a backend.
- `toHaveScreenshot` options used everywhere: `fullPage: true`,
  `animations: 'disabled'`, `maxDiffPixelRatio: 0.02`.

### Generating / updating snapshots

```bash
# Update all frontend screenshots (writes -frontend-linux.png baselines)
npm run test:e2e:screenshots:update

# Debug a single failing view, headed, one worker
npm run test:frontend:screenshots:debug

# Run the full frontend project (all mocked specs, not just screenshots)
npm run test:frontend
```

Committed baselines live in
`e2e-frontend/screenshots.spec.js-snapshots/<name>-frontend-linux.png`.
The `-frontend-linux` suffix is the Playwright project + platform tag; keep it.

### Capturing ad-hoc screenshots for a PR report

When a change needs before/after images in a report:

1. Start the dev server on port 8080.
2. Use Playwright (Chromium) with the same `shared/mocks.js` helpers to
   navigate to the view and take a real image (`page.screenshot({ path })`).
   The bundled headless *shell* is not enough — use
   `chromium` with `channel: 'chromium'`.
3. Keep mocks deterministic (`freezeClock`, fixed fixtures) so images are
   stable and diffable.
4. Embed the resulting PNGs into the report PDF (Markdown -> HTML via
   `marked`, rendered by Chromium with images as base64 data URIs).

Always verify the rendered text in the screenshot actually contains the new
copy; a stale baseline can silently show old strings.
