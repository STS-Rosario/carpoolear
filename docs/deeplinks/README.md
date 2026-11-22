# Mobile App Links — Mercado Pago identity verification (v1)

After Mercado Pago OAuth, the backend redirects the user to:

`https://carpoolear.com.ar/app/setting/identity-validation?result=...`

Android App Links and iOS Universal Links must open the **native app** on that URL so the user sees the result without landing in Chrome (no JWT → login screen).

## Production hosting (ops)

Publish on **carpoolear.com.ar** and **www.carpoolear.com.ar**:

| File | URL |
|------|-----|
| Android Digital Asset Links | `/.well-known/assetlinks.json` |
| Apple App Site Association | `/.well-known/apple-app-site-association` |

Use the templates in this folder. Replace `SHA256_FINGERPRINT_RELEASE` with the Play App Signing certificate fingerprint. Replace `TEAM_ID` in the AASA `appID` (`TEAM_ID.com.sts.carpoolear`).

Requirements:

- HTTPS, no auth, `Content-Type: application/json` (AASA may also be served without extension).
- No redirect away from `/.well-known/*`.

## Backend env

`MERCADO_PAGO_OAUTH_FRONTEND_REDIRECT` must be **`https://carpoolear.com.ar/app`** (no trailing slash), so redirects hit the `/app/...` paths claimed by the app.

## Verify Android

```bash
adb shell pm get-app-links com.sts.carpoolear
```

Manual intent (debug build):

```bash
adb shell am start -a android.intent.action.VIEW \
  -d "https://carpoolear.com.ar/app/setting/identity-validation?result=success" \
  com.sts.carpoolear
```

## Scope v1

Only `/app/setting/identity-validation` is handled. Generic `/app/*` deep links are a follow-up.