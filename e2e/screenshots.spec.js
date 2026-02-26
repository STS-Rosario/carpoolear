const { test, expect } = require('@playwright/test');

// ============================================================
// Mock Data
// ============================================================

const MOCK_CONFIG = {
  admin_email: 'admin@carpoolear.com.ar',
  banner: { image: '', url: '' },
  country_name: 'Argentina',
  map_coordinates: [-29.0, -60.0],
  map_zoom: 4,
  locale: 'arg',
  osm_country: 'ARG',
  donation: {
    ammount_needed: 1000,
    month_days: 0,
    trips_count: 20,
    trips_offset: 0,
    trips_rated: 2,
  },
  max_cards_per_row: 4,
  disable_user_hints: false,
  login_custom_header: false,
  module_trip_seats_payment: false,
  module_validated_drivers: false,
  trip_stars: false,
  api_price: false,
  fuel_price: 4.15,
  trip_card_design: 'default',
  module_on_boarding_new_user: { enabled: false, cards: 0 },
  allow_rating_reply: true,
  module_references: true,
  name_app: 'Carpoolear',
  app_name: 'Carpoolear',
  trips_auto_search: false,
  trips_focus_next: false,
  autocomplete_select_first: false,
  profile_id_format: '##.###.###',
  weekly_schedule: false,
  web_push_notification: false,
  price_show_cents: false,
  enable_facebook: false,
  module_identity_validation: true,
  module_manual_identity_validation: true,
  module_coordinate_by_message: true,
  __isLocal: false,
};

const MOCK_USER = {
  id: 1,
  name: 'Juan Pérez',
  email: 'user0@g.com',
  is_admin: false,
  image: '/static/img/carpoolear_logo.png',
  description: 'Viajero frecuente entre Rosario y Buenos Aires',
  birthday: '1990-05-15',
  nro_doc: '30123456',
  gender: 'male',
  mobile_phone: '3415551234',
  donations: [],
  monthly_donate: false,
  on_boarding_view: 1,
  has_pin: false,
  identity_verified: false,
  identity_validated_at: null,
  references_data: null,
  created_at: '2024-01-01T00:00:00.000Z',
};

const MOCK_ADMIN_USER = {
  ...MOCK_USER,
  id: 99,
  name: 'Admin User',
  email: 'admin@g.com',
  is_admin: true,
};

function makeMockTrip(id, overrides = {}) {
  return {
    id,
    user: { id: id + 100, name: `Usuario ${id}`, image: null },
    is_passenger: false,
    trip_date: '2026-04-15T14:00:00.000Z',
    from_town: 'Rosario, Santa Fe',
    to_town: 'Buenos Aires',
    points: [
      { lat: -32.9468, lng: -60.6393, address: 'Rosario, Santa Fe', json_address: { name: 'Rosario, Santa Fe' } },
      { lat: -34.6037, lng: -58.3816, address: 'Buenos Aires', json_address: { name: 'Buenos Aires' } },
    ],
    total_seats: 4,
    seats_available: 2,
    passenger_count: 2,
    passenger: [],
    allPassengerRequest: [],
    hidden: false,
    deleted: false,
    state: 'active',
    request: '',
    description: 'Viaje directo por autopista',
    distance: 300,
    estimated_time: '3:30',
    co2: 45,
    friendship_state: 0,
    ...overrides,
  };
}

const MOCK_TRIPS = [
  makeMockTrip(1),
  makeMockTrip(2, {
    from_town: 'Córdoba',
    to_town: 'Mendoza',
    trip_date: '2026-04-20T10:00:00.000Z',
    user: { id: 202, name: 'María García', image: null },
  }),
  makeMockTrip(3, {
    from_town: 'Santa Fe',
    to_town: 'Paraná',
    is_passenger: true,
    trip_date: '2026-04-22T08:00:00.000Z',
    user: { id: 203, name: 'Carlos López', image: null },
  }),
];

const MOCK_TRIP_DETAIL = {
  ...makeMockTrip(1),
  passenger: [
    { id: 201, name: 'Pasajero 1', image: null, request_state: 1 },
    { id: 202, name: 'Pasajero 2', image: null, request_state: 1 },
  ],
  allPassengerRequest: [
    { id: 201, name: 'Pasajero 1', image: null, request_state: 1 },
    { id: 202, name: 'Pasajero 2', image: null, request_state: 1 },
  ],
};

const MOCK_DRIVER_TRIPS = [
  makeMockTrip(10, {
    user: MOCK_USER,
    from_town: 'Rosario, Santa Fe',
    to_town: 'Buenos Aires',
  }),
];

const MOCK_PASSENGER_TRIPS = [
  makeMockTrip(20, {
    user: { id: 300, name: 'Ana Fernández', image: null },
    from_town: 'Córdoba',
    to_town: 'Rosario, Santa Fe',
    is_passenger: true,
    request: 'send',
  }),
];

const MOCK_CONVERSATIONS = [
  {
    id: 1,
    title: 'María García',
    image: null,
    other_user_identity_validated_at: null,
    updated_at: '2025-06-10T10:30:00.000Z',
    last_message: { id: 10, text: 'Hola, ¿a qué hora salís?', created_at: '2025-06-10T10:30:00.000Z' },
    unread: true,
    users: [
      { id: 1, name: 'Juan Pérez' },
      { id: 2, name: 'María García' },
    ],
  },
  {
    id: 2,
    title: 'Carlos López',
    image: null,
    other_user_identity_validated_at: '2025-01-01T00:00:00.000Z',
    updated_at: '2025-06-08T15:00:00.000Z',
    last_message: { id: 20, text: 'Dale, nos vemos!', created_at: '2025-06-08T15:00:00.000Z' },
    unread: false,
    users: [
      { id: 1, name: 'Juan Pérez' },
      { id: 3, name: 'Carlos López' },
    ],
  },
];

const MOCK_MESSAGES = [
  { id: 1, conversation_id: 1, text: 'Hola! Tenés lugar?', created_at: '2025-06-10T10:00:00.000Z', user: { id: 2, name: 'María García' } },
  { id: 2, conversation_id: 1, text: 'Sí, hay 2 lugares disponibles', created_at: '2025-06-10T10:15:00.000Z', user: { id: 1, name: 'Juan Pérez' } },
  { id: 3, conversation_id: 1, text: 'Hola, ¿a qué hora salís?', created_at: '2025-06-10T10:30:00.000Z', user: { id: 2, name: 'María García' } },
];

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    text: 'María García solicitó un asiento en tu viaje',
    created_at: '2025-06-10T10:00:00.000Z',
    readed: false,
    extras: { type: 'passenger_request', trip_id: 1 },
  },
  {
    id: 2,
    text: 'Tu viaje a Buenos Aires es mañana',
    created_at: '2025-06-09T08:00:00.000Z',
    readed: true,
    extras: { type: 'trip_reminder', trip_id: 1 },
  },
  {
    id: 3,
    text: 'Carlos López aceptó tu solicitud de asiento',
    created_at: '2025-06-08T14:30:00.000Z',
    readed: true,
    extras: { type: 'request_accepted', trip_id: 2 },
  },
];

const MOCK_PENDING_REQUESTS = [
  {
    id: 1,
    user: { id: 201, name: 'Pasajero Pendiente', image: null },
    trip_id: 10,
    request_state: 0,
    created_at: '2025-06-10T10:00:00.000Z',
  },
];

const MOCK_DELETE_REQUESTS = [
  {
    id: 1,
    user: { id: 50, name: 'User To Delete', email: 'delete@test.com' },
    date_requested: '2026-02-15T00:00:00.000Z',
    action_taken: 0,
    action_taken_date: null,
  },
  {
    id: 2,
    user: { id: 51, name: 'Already Deleted', email: 'deleted@test.com' },
    date_requested: '2026-01-20T00:00:00.000Z',
    action_taken: 1,
    action_taken_date: '2026-01-25T00:00:00.000Z',
  },
];

const MOCK_BANNED_USERS = [
  {
    id: 1,
    user: { id: 60, name: 'Banned User' },
    nro_doc: '12345678',
    banned_at: '2026-01-15T00:00:00.000Z',
    banned_by: 0,
    note: 'Comportamiento inapropiado',
  },
  {
    id: 2,
    user: { id: 61, name: 'Another Banned' },
    nro_doc: '87654321',
    banned_at: '2026-02-01T00:00:00.000Z',
    banned_by: 99,
    note: 'Spam repetido',
  },
];

const MOCK_MANUAL_VALIDATIONS = [
  { id: 1, user: { id: 70, name: 'Validation User' }, status: 'pending', created_at: '2026-02-10T00:00:00.000Z' },
  { id: 2, user: { id: 71, name: 'Approved User' }, status: 'approved', created_at: '2026-02-08T00:00:00.000Z' },
];

const MOCK_MANUAL_VALIDATION_DETAIL = {
  id: 1,
  user: { id: 70, name: 'Validation User', nro_doc: '30123456' },
  status: 'pending',
  front_image: null,
  back_image: null,
  selfie_image: null,
  created_at: '2026-02-10T00:00:00.000Z',
  review_note: null,
};

const MOCK_MP_REJECTED = [
  {
    id: 1,
    user: { id: 80, name: 'MP Rejected User' },
    reject_reason: 'Documento no coincide',
    user_identity_validated: false,
    created_at: '2026-02-12T00:00:00.000Z',
  },
];

const MOCK_MP_REJECTED_DETAIL = {
  id: 1,
  user: { id: 80, name: 'MP Rejected User' },
  reject_reason: 'Documento no coincide',
  mp_payload: JSON.stringify({ status: 'rejected', reason: 'document_mismatch' }),
  status: 'pending',
  review_note: null,
  created_at: '2026-02-12T00:00:00.000Z',
};

const MOCK_TRANSACTIONS = [
  {
    id: 1,
    created_at: '2026-02-01T00:00:00.000Z',
    user_id: 1,
    user: { name: 'Juan Pérez' },
    trip: {
      seat_price_cents: 50000,
      user: { name: 'María García' },
      to_town: 'Buenos Aires',
    },
    payment_status: 'approved',
    payment_info: { cardDetail: { cardNumber: '****1234' } },
  },
  {
    id: 2,
    created_at: '2026-01-15T00:00:00.000Z',
    user_id: 1,
    user: { name: 'Juan Pérez' },
    trip: {
      seat_price_cents: 30000,
      user: { name: 'Carlos López' },
      to_town: 'Córdoba',
    },
    payment_status: 'pending',
    payment_info: { cardDetail: { cardNumber: '****5678' } },
  },
];

const MOCK_CHART_TRIPS = [
  { key: '2025-07', cantidad: 120, asientos_ofrecidos_total: 480 },
  { key: '2025-08', cantidad: 145, asientos_ofrecidos_total: 580 },
  { key: '2025-09', cantidad: 160, asientos_ofrecidos_total: 640 },
  { key: '2025-10', cantidad: 135, asientos_ofrecidos_total: 540 },
  { key: '2025-11', cantidad: 170, asientos_ofrecidos_total: 680 },
  { key: '2025-12', cantidad: 190, asientos_ofrecidos_total: 760 },
  { key: '2026-01', cantidad: 200, asientos_ofrecidos_total: 800 },
  { key: '2026-02', cantidad: 175, asientos_ofrecidos_total: 700 },
];

const MOCK_CHART_SEATS = [
  { key: '2025-07', state: 1, cantidad: 350 },
  { key: '2025-08', state: 1, cantidad: 420 },
  { key: '2025-09', state: 1, cantidad: 470 },
  { key: '2025-10', state: 1, cantidad: 390 },
  { key: '2025-11', state: 1, cantidad: 510 },
  { key: '2025-12', state: 1, cantidad: 580 },
  { key: '2026-01', state: 1, cantidad: 620 },
  { key: '2026-02', state: 1, cantidad: 530 },
];

const MOCK_CHART_USERS = [
  { key: '2025-07', cantidad: 45 },
  { key: '2025-08', cantidad: 62 },
  { key: '2025-09', cantidad: 55 },
  { key: '2025-10', cantidad: 70 },
  { key: '2025-11', cantidad: 48 },
  { key: '2025-12', cantidad: 80 },
  { key: '2026-01', cantidad: 65 },
  { key: '2026-02', cantidad: 58 },
];

const MOCK_PROFILE_USER = {
  ...MOCK_USER,
  id: 5,
  name: 'Perfil de Prueba',
  email: 'profile@test.com',
  description: 'Usuario activo en la plataforma',
  created_at: '2023-06-01T00:00:00.000Z',
};

// ============================================================
// Paginated response wrapper
// ============================================================

function paginated(data, page = 1, totalPages = 1) {
  return {
    data,
    meta: {
      pagination: {
        total_pages: totalPages,
        current_page: page,
      },
    },
  };
}

// ============================================================
// Helpers
// ============================================================

/**
 * Freeze the browser clock so time-dependent rendering (fromNow, calendar,
 * "Última conexión", etc.) is always deterministic.
 */
async function freezeClock(page) {
  await page.clock.setFixedTime(new Date('2025-07-15T12:00:00Z'));
}

/**
 * Register a catch-all for any unhandled /api/ requests.
 * Registered FIRST so specific mocks (registered later) take priority.
 * Also blocks external requests (map tiles, fonts) to prevent non-determinism.
 */
async function setupCatchAllMock(page) {
  await page.route(/\/api\//, (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({}),
    });
  });

  // Block map tile and external requests to prevent non-deterministic rendering
  await page.route(/tile\.openstreetmap|unpkg\.com\/leaflet|\.tile\./, (route) => {
    route.abort();
  });
}

/**
 * Common API mocks needed by all views (config, trips search, polling endpoints).
 */
async function setupCommonMocks(page) {
  await page.route('**/api/config', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_CONFIG),
    });
  });

  // Trips search (called during app init via startApp)
  await page.route(/\/api\/trips(\?.*)?$/, (route) => {
    if (route.request().method() === 'GET') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(paginated(MOCK_TRIPS)),
      });
    } else {
      route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    }
  });

  await page.route('**/api/notifications/count', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: 3 }),
    });
  });

  await page.route('**/api/conversations/unread', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [] }),
    });
  });

  await page.route('**/api/subscriptions**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });

  await page.route('**/api/debug**', (route) => {
    route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
  });
}

/**
 * Auth-related mocks: sets localStorage token/user and mocks bootstrap APIs.
 */
async function setupAuthState(page, user = MOCK_USER) {
  const token = 'mock-jwt-token-for-testing';

  await page.addInitScript(({ token, user }) => {
    localStorage.setItem('TOKEN', token);
    localStorage.setItem('USER', JSON.stringify(user));
  }, { token, user });

  await page.route('**/api/retoken', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token, config: MOCK_CONFIG }),
    });
  });

  await page.route('**/api/users/me', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: user }),
    });
  });

  await page.route('**/api/users/get-trips**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [] }),
    });
  });

  await page.route('**/api/users/get-old-trips**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [] }),
    });
  });

  await page.route('**/api/users/ratings/pending', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [] }),
    });
  });

  await page.route('**/api/users/requests', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [] }),
    });
  });

  await page.route('**/api/users/payment-pending', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [] }),
    });
  });

  await page.route('**/api/cars', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [] }),
    });
  });

  await page.route('**/api/friends/pedings**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [] }),
    });
  });
}

/**
 * Wait for the app to fully load (splash screen gone, main content visible).
 */
async function waitForPageReady(page) {
  // Wait for splash screen to appear then disappear
  try {
    await page.locator('.custom-splash-screen').waitFor({ state: 'attached', timeout: 8000 });
    await page.locator('.custom-splash-screen').waitFor({ state: 'detached', timeout: 8000 });
  } catch {
    // Splash may have already come and gone
  }

  await page.locator('#main').waitFor({ state: 'visible', timeout: 10000 });
  await page.waitForTimeout(1000);
}

const SCREENSHOT_OPTIONS = {
  fullPage: true,
  animations: 'disabled',
  maxDiffPixelRatio: 0.02,
};

// ============================================================
// Tests
// ============================================================

test.describe('Screenshot tests', () => {
  test.setTimeout(30000);

  // ----------------------------------------------------------
  // Guest views (no auth, guest middleware)
  // ----------------------------------------------------------
  test.describe('Guest views', () => {
    test.beforeEach(async ({ page }) => {
      await freezeClock(page);
      await setupCatchAllMock(page);
      await setupCommonMocks(page);
    });

    test('login page', async ({ page }) => {
      await page.goto('/login');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('login.png', SCREENSHOT_OPTIONS);
    });

    test('register page', async ({ page }) => {
      await page.goto('/register');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('register.png', SCREENSHOT_OPTIONS);
    });

    test('reset password page', async ({ page }) => {
      await page.goto('/reset-password');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('reset-password.png', SCREENSHOT_OPTIONS);
    });

    test('reset password confirm page', async ({ page }) => {
      await page.goto('/reset-password/test-token');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('reset-password-confirm.png', SCREENSHOT_OPTIONS);
    });
  });

  // ----------------------------------------------------------
  // Public views (no auth required)
  // ----------------------------------------------------------
  test.describe('Public views', () => {
    test.beforeEach(async ({ page }) => {
      await freezeClock(page);
      await setupCatchAllMock(page);
      await setupCommonMocks(page);
    });

    test('trips listing page', async ({ page }) => {
      await page.goto('/trips');
      await waitForPageReady(page);
      await page.locator('.trips-list').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
      await expect(page).toHaveScreenshot('trips.png', SCREENSHOT_OPTIONS);
    });

    test('about page', async ({ page }) => {
      await page.goto('/about');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('about.png', SCREENSHOT_OPTIONS);
    });

    test('terms and conditions page', async ({ page }) => {
      await page.route('**/api/users/terms**', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            content: '<h1>Términos y Condiciones</h1><p>Estos son los términos y condiciones de uso de Carpoolear.</p><p>Al utilizar esta plataforma, usted acepta los siguientes términos de servicio.</p><h2>1. Uso de la plataforma</h2><p>Carpoolear es una plataforma de viajes compartidos. Los usuarios se comprometen a utilizar el servicio de manera responsable.</p><h2>2. Responsabilidad</h2><p>Cada usuario es responsable de la información que publica en la plataforma.</p>',
          }),
        });
      });
      await page.goto('/terminos');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('terms.png', SCREENSHOT_OPTIONS);
    });
  });

  // ----------------------------------------------------------
  // Authenticated views
  // ----------------------------------------------------------
  test.describe('Authenticated views', () => {
    test.beforeEach(async ({ page }) => {
      await freezeClock(page);
      await setupCatchAllMock(page);
      await setupCommonMocks(page);
      await setupAuthState(page);
    });

    test('trip detail page', async ({ page }) => {
      await page.route(/\/api\/trips\/1(\?.*)?$/, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: MOCK_TRIP_DETAIL }),
        });
      });
      await page.goto('/trips/1');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('trip-detail.png', SCREENSHOT_OPTIONS);
    });

    test('new trip page', async ({ page }) => {
      await page.goto('/trips/create');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('new-trip.png', SCREENSHOT_OPTIONS);
    });

    test('update trip page', async ({ page }) => {
      await page.route(/\/api\/trips\/1(\?.*)?$/, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: MOCK_TRIP_DETAIL }),
        });
      });
      await page.goto('/trips/update/1');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('update-trip.png', SCREENSHOT_OPTIONS);
    });

    test('my trips page', async ({ page }) => {
      // Override user trips with data for this view
      await page.route('**/api/users/get-trips**', (route) => {
        const url = new URL(route.request().url());
        const asDriver = url.searchParams.get('as_driver');
        const data = asDriver === 'true' ? MOCK_DRIVER_TRIPS : MOCK_PASSENGER_TRIPS;
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data }),
        });
      });
      await page.route('**/api/users/requests', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: MOCK_PENDING_REQUESTS }),
        });
      });
      await page.goto('/my-trips');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('my-trips.png', SCREENSHOT_OPTIONS);
    });

    test('profile page', async ({ page }) => {
      await page.route(/\/api\/users\/5(\?.*)?$/, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: MOCK_PROFILE_USER }),
        });
      });
      await page.route(/\/api\/users\/5\/badges/, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: [] }),
        });
      });
      await page.route(/\/api\/users\/5\/ratings/, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(paginated([])),
        });
      });
      await page.goto('/profile/5');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('profile.png', SCREENSHOT_OPTIONS);
    });

    test('notifications page', async ({ page }) => {
      await page.route(/\/api\/notifications(\?.*)?$/, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: MOCK_NOTIFICATIONS }),
        });
      });
      await page.goto('/notifications');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('notifications.png', SCREENSHOT_OPTIONS);
    });

    test('conversations list page', async ({ page }) => {
      await page.route(/\/api\/conversations(\?.*)?$/, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(paginated(MOCK_CONVERSATIONS)),
        });
      });
      await page.goto('/conversations');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('conversations-list.png', SCREENSHOT_OPTIONS);
    });

    test('conversation chat page', async ({ page }) => {
      await page.route(/\/api\/conversations\/show\/1/, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: MOCK_CONVERSATIONS[0] }),
        });
      });
      await page.route(/\/api\/conversations\/1(\?.*)?$/, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: MOCK_MESSAGES }),
        });
      });
      await page.route(/\/api\/conversations(\?.*)?$/, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(paginated(MOCK_CONVERSATIONS)),
        });
      });
      await page.goto('/conversations/1');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('conversation-chat.png', SCREENSHOT_OPTIONS);
    });

    test('settings - edit profile page', async ({ page }) => {
      await page.goto('/setting/profile');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('settings-profile.png', SCREENSHOT_OPTIONS);
    });

    test('settings - friends page', async ({ page }) => {
      await page.route(/\/api\/friends(\?.*)?$/, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(paginated([
            { id: 10, name: 'María García', image: null, email: 'maria@test.com' },
            { id: 11, name: 'Carlos López', image: null, email: 'carlos@test.com' },
          ])),
        });
      });
      await page.goto('/setting/friends');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('settings-friends.png', SCREENSHOT_OPTIONS);
    });

    test('settings - friends search page', async ({ page }) => {
      await page.route(/\/api\/friends\/search(\?.*)?$/, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(paginated([])),
        });
      });
      await page.route(/\/api\/friends(\?.*)?$/, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(paginated([])),
        });
      });
      await page.goto('/setting/friends/search');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('settings-friends-search.png', SCREENSHOT_OPTIONS);
    });

    test('settings - identity validation page', async ({ page }) => {
      await page.route('**/api/users/manual-identity-validation**', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({}),
        });
      });
      await page.route('**/api/users/mercadopago-oauth-url**', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ url: '' }),
        });
      });
      await page.goto('/setting/identity-validation');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('settings-identity-validation.png', SCREENSHOT_OPTIONS);
    });

    test('settings - manual identity validation page', async ({ page }) => {
      await page.route('**/api/users/manual-identity-validation**', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({}),
        });
      });
      await page.goto('/setting/identity-validation/manual');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('settings-identity-validation-manual.png', SCREENSHOT_OPTIONS);
    });

    test('transactions page', async ({ page }) => {
      await page.route('**/api/trips/transactions**', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(MOCK_TRANSACTIONS),
        });
      });
      await page.goto('/transactions');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('transactions.png', SCREENSHOT_OPTIONS);
    });
  });

  // ----------------------------------------------------------
  // Admin views (authAdmin middleware — requires is_admin: true)
  // ----------------------------------------------------------
  test.describe('Admin views', () => {
    test.beforeEach(async ({ page }) => {
      await freezeClock(page);
      await setupCatchAllMock(page);
      await setupCommonMocks(page);
      await setupAuthState(page, MOCK_ADMIN_USER);
    });

    test('admin dashboard page', async ({ page }) => {
      await page.route('**/api/data/trips**', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ trips: MOCK_CHART_TRIPS }),
        });
      });
      await page.route('**/api/data/seats**', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ seats: MOCK_CHART_SEATS }),
        });
      });
      await page.route('**/api/data/users**', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ users: MOCK_CHART_USERS }),
        });
      });
      await page.goto('/admin');
      await waitForPageReady(page);
      await page.waitForTimeout(2000); // extra time for charts to render
      await expect(page).toHaveScreenshot('admin-dashboard.png', SCREENSHOT_OPTIONS);
    });

    test('admin users page', async ({ page }) => {
      await page.route('**/api/users/search**', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: [] }),
        });
      });
      await page.goto('/admin/users');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('admin-users.png', SCREENSHOT_OPTIONS);
    });

    test('admin trips page', async ({ page }) => {
      await page.goto('/admin/trips');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('admin-trips.png', SCREENSHOT_OPTIONS);
    });

    test('admin users delete list page', async ({ page }) => {
      await page.route('**/api/admin/users/account-delete-list**', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: MOCK_DELETE_REQUESTS }),
        });
      });
      await page.goto('/admin/users-delete-list');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('admin-users-delete-list.png', SCREENSHOT_OPTIONS);
    });

    test('admin banned users page', async ({ page }) => {
      await page.route('**/api/admin/banned-users**', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: MOCK_BANNED_USERS }),
        });
      });
      await page.goto('/admin/banned-users');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('admin-banned-users.png', SCREENSHOT_OPTIONS);
    });

    test('admin manual identity validations page', async ({ page }) => {
      await page.route('**/api/admin/manual-identity-validations**', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: MOCK_MANUAL_VALIDATIONS }),
        });
      });
      await page.goto('/admin/manual-identity-validations');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('admin-manual-identity-validations.png', SCREENSHOT_OPTIONS);
    });

    test('admin manual identity validation review page', async ({ page }) => {
      await page.route(/\/api\/admin\/manual-identity-validations\/1/, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: MOCK_MANUAL_VALIDATION_DETAIL }),
        });
      });
      await page.goto('/admin/manual-identity-validations/1');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('admin-manual-identity-validation-review.png', SCREENSHOT_OPTIONS);
    });

    test('admin mercado pago rejected validations page', async ({ page }) => {
      await page.route('**/api/admin/mercado-pago-rejected-validations**', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: MOCK_MP_REJECTED }),
        });
      });
      await page.goto('/admin/mercado-pago-rejected-validations');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('admin-mp-rejected-validations.png', SCREENSHOT_OPTIONS);
    });

    test('admin mercado pago rejected validation detail page', async ({ page }) => {
      await page.route(/\/api\/admin\/mercado-pago-rejected-validations\/1/, (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: MOCK_MP_REJECTED_DETAIL }),
        });
      });
      await page.goto('/admin/mercado-pago-rejected-validations/1');
      await waitForPageReady(page);
      await expect(page).toHaveScreenshot('admin-mp-rejected-validation-detail.png', SCREENSHOT_OPTIONS);
    });
  });
});
