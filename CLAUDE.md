# Carpoolear Frontend

Carpooling platform frontend built with **Vue.js 2** and **Webpack 4**.

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
├── router/              # Vue Router routes
├── styles/              # Bootstrap + custom Less/CSS
├── language/            # i18n translations (Spanish/English)
├── classes/             # Core JS classes (TaggedApi, Threads, TaggedList)
config/
├── dev.env.js           # Dev environment (API_URL, MAPS_API, etc.)
├── prod.env.js          # Production environment
├── conf.json            # Default app configuration
e2e/                     # Playwright end-to-end tests
projects/                # Multi-project branding support (carpoolear, apalancar, etc.)
```

## Key Commands

```bash
# Development
npm run dev                    # Start dev server with hot reload (port 8080)
npm run build                  # Production build
npm run lint:fix               # Auto-fix ESLint issues

# E2E Testing
npm run test:e2e               # Run Playwright tests (headless)
npm run test:e2e:ui            # Run Playwright tests with UI mode
npx playwright install         # Install browser binaries

# Mobile
npm run build:android          # Build Android via Capacitor
npm run build:ios              # Build iOS via Capacitor
```

## Docker Setup

- **Dev**: Node 12 container, port 8080, bind mount for hot reload
- **Prod**: Multi-stage build → nginx serving static files on port 80
- Frontend connects to backend API at `http://localhost:8000` (configurable in `config/dev.env.js`)

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

Backend API URL configured in `config/dev.env.js`:
```js
API_URL: '"http://localhost:8000"'
```

## Test Users (from backend TestingSeeder)

| Email | Password |
|-------|----------|
| user0@g.com through user9@g.com | 123456 |

## Multi-Project Support

Build for different branded versions:
```bash
TARGET_APP=carpoolear npm run build
TARGET_APP=apalancar npm run build
```

Project configs in `projects/` and `config/dev.{project}.env.js`.
