# Carpoolear Frontend

Carpooling platform frontend built with **Vue.js 3** (compat mode) and **Vite**.

## Architecture

```
src/
├── components/
│   ├── views/           # Page components (Login, Trip, MyTrips, NewTrip, Conversations, etc.)
│   ├── elements/        # Reusable UI elements (TripButtons, TripPassengers, PendingRequest, etc.)
│   └── sections/        # Layout sections (Header, Footer, Sidebar)
├── store/modules/       # Vuex state management (auth, trips, passenger, conversation, etc.)
├── services/
│   ├── api/             # API service classes (Auth, Trips, PassengerApi, ConversationApi, etc.)
│   └── network.js       # Axios HTTP client with JWT auth header injection
├── router/              # Vue Router routes (lazy-loaded via dynamic import())
├── styles/              # Bootstrap + custom CSS
├── language/            # i18n translations (Spanish/English)
├── classes/             # Core JS classes (TaggedApi, Threads, TaggedList)
├── env.js               # Firebase config helper (reconstructs from VITE_ env vars)
config/
├── conf.json            # Default app configuration
├── capacitor.js         # Capacitor plugin configuration
.env                     # Shared defaults (VITE_TARGET_APP)
.env.development         # Dev environment (VITE_API_URL, VITE_MAPS_API, etc.)
.env.production          # Production environment (VITE_FIREBASE_*, etc.)
e2e/                     # Playwright end-to-end tests
projects/                # Multi-project branding support (carpoolear, apalancar, etc.)
```

## Key Commands

```bash
# Development
npm run dev                    # Start Vite dev server with HMR (port 8080)
npm run build                  # Production build → dist/
npm run build:web              # Production build for web (PLATFORM=DESKTOP)
npm run preview                # Preview production build locally
npm run lint:fix               # Auto-fix ESLint issues

# E2E Testing
npm run test:e2e               # Run Playwright tests (headless)
npm run test:e2e:ui            # Run Playwright tests with UI mode
npx playwright install         # Install browser binaries

# Mobile
npm run build:android          # Build for Android → www/ + cap sync
npm run build:ios              # Build for iOS → www/ + cap sync
```

## Docker Setup

- **Dev**: Node 18 container, port 8080, bind mount for hot reload
- **Prod**: Multi-stage build → nginx serving static files on port 80
- Frontend connects to backend API at `http://localhost:8000` (configurable in `.env.development`)

## Environment Variables

All env vars use `VITE_` prefix and are accessed via `import.meta.env.VITE_*`:
- `VITE_API_URL` — Backend API URL
- `VITE_ROUTE_BASE` — Base path for router (`/app/` in prod, `/` in dev)
- `VITE_TARGET_APP` — App variant (`carpoolear` or `apalancar`)
- `VITE_FIREBASE_*` — Firebase config (reconstructed in `src/env.js`)
- `import.meta.env.DEV` / `import.meta.env.PROD` — Mode checks

## Authentication

- JWT token stored in localStorage (`TOKEN_KEY`)
- Automatically injected as `Authorization: Bearer {token}` header via `services/network.js`
- Login: `POST /api/login` with email/password
- Vuex store module: `src/store/modules/auth.js`

## Key Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | Login.vue | Email/password login |
| `/trips` | Trips.vue | Search/browse trips |
| `/trips/create` | NewTrip.vue | Create new trip (driver/passenger) |
| `/trips/:id` | Trip.vue | Trip detail, request seat, manage passengers |
| `/my-trips` | MyTrips.vue | Driver's trips, pending requests, accept/reject |
| `/conversations` | Conversations.vue | Chat list |
| `/conversations/:id` | ConversationDetail.vue | Chat messages |

## Key UI Elements for Testing

### Trip Detail Page (`/trips/:id`)
- Request seat button: `button` containing "Solicitar Asiento"
- Modal confirmation: `.btn.btn-primary` with "Solicitar Asiento" text
- Cancel request: button with "Solicitado" text

### My Trips Page (`/my-trips`)
- Pending request cards: `PendingRequest` component
- Accept button: `.btn-accept-request`
- Reject button: in `.pending-buttons` div
- Send message: `.btn-secondary`

## API Configuration

Backend API URL configured in `.env.development`:
```
VITE_API_URL=http://localhost:8000
```

## Test Users (from backend TestingSeeder)

| Email | Password |
|-------|----------|
| user0@g.com through user9@g.com | 123456 |

## Multi-Project Support

Build for different branded versions:
```bash
VITE_TARGET_APP=carpoolear npm run build
VITE_TARGET_APP=apalancar npm run build
```

Multi-project CSS variants resolved via `multiProjectResolver` Vite plugin in `vite.config.js`.
