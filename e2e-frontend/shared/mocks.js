/**
 * Shared mock data and helpers for frontend-only Playwright tests.
 *
 * These are used by tests that don't need a real backend — they intercept
 * all API calls with deterministic responses so the frontend renders
 * predictably.
 */

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
  positive_ratings: 10,
  negative_ratings: 1,
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
    user: { id: id + 100, name: `Usuario ${id}`, image: null, positive_ratings: 5, negative_ratings: 0 },
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
    user: { id: 202, name: 'María García', image: null, positive_ratings: 8, negative_ratings: 1 },
  }),
  makeMockTrip(3, {
    from_town: 'Santa Fe',
    to_town: 'Paraná',
    is_passenger: true,
    trip_date: '2026-04-22T08:00:00.000Z',
    user: { id: 203, name: 'Carlos López', image: null, positive_ratings: 3, negative_ratings: 0 },
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
    user: { id: 300, name: 'Ana Fernández', image: null, positive_ratings: 12, negative_ratings: 2 },
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
    user: { id: 201, name: 'Laura Martínez', image: null },
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
  { id: 1, user_id: 70, user_name: 'Validation User', paid: true, paid_at: '2026-02-09T00:00:00.000Z', submitted_at: '2026-02-10T00:00:00.000Z', review_status: 'pending', created_at: '2026-02-10T00:00:00.000Z' },
  { id: 2, user_id: 71, user_name: 'Approved User', paid: true, paid_at: '2026-02-07T00:00:00.000Z', submitted_at: '2026-02-08T00:00:00.000Z', review_status: 'approved', created_at: '2026-02-08T00:00:00.000Z' },
];

const MOCK_MANUAL_VALIDATION_DETAIL = {
  id: 1,
  user_id: 70,
  user_name: 'Validation User',
  user_nro_doc: '30123456',
  paid: true,
  paid_at: '2026-02-09T00:00:00.000Z',
  submitted_at: '2026-02-10T00:00:00.000Z',
  review_status: 'pending',
  has_images: true,
  front_image: '/static/img/carpoolear_logo.png',
  back_image: '/static/img/carpoolear_logo.png',
  selfie_image: '/static/img/carpoolear_logo.png',
  created_at: '2026-02-10T00:00:00.000Z',
  review_note: null,
};

const MOCK_MP_REJECTED = [
  {
    id: 1,
    user_id: 80,
    user_name: 'MP Rejected User',
    user_nro_doc: '87654321',
    reject_reason: 'Documento no coincide',
    user_identity_validated: false,
    created_at: '2026-02-12T00:00:00.000Z',
  },
];

const MOCK_MP_REJECTED_DETAIL = {
  id: 1,
  user_id: 80,
  user_name: 'MP Rejected User',
  user_nro_doc: '87654321',
  user_email: 'mprejected@test.com',
  user_identity_validated: false,
  reject_reason: 'Documento no coincide',
  mp_payload: JSON.stringify({ status: 'rejected', reason: 'document_mismatch' }),
  review_status: 'pending',
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
  { key: '2025-01', cantidad: 120, asientos_ofrecidos_total: 480 },
  { key: '2025-02', cantidad: 145, asientos_ofrecidos_total: 580 },
  { key: '2025-03', cantidad: 160, asientos_ofrecidos_total: 640 },
  { key: '2025-04', cantidad: 135, asientos_ofrecidos_total: 540 },
  { key: '2025-05', cantidad: 170, asientos_ofrecidos_total: 680 },
  { key: '2025-06', cantidad: 190, asientos_ofrecidos_total: 760 },
  { key: '2025-07', cantidad: 200, asientos_ofrecidos_total: 800 },
];

const MOCK_CHART_SEATS = [
  { key: '2025-01', state: 1, cantidad: 350 },
  { key: '2025-02', state: 1, cantidad: 420 },
  { key: '2025-03', state: 1, cantidad: 470 },
  { key: '2025-04', state: 1, cantidad: 390 },
  { key: '2025-05', state: 1, cantidad: 510 },
  { key: '2025-06', state: 1, cantidad: 580 },
  { key: '2025-07', state: 1, cantidad: 620 },
];

const MOCK_CHART_USERS = [
  { key: '2025-01', cantidad: 45 },
  { key: '2025-02', cantidad: 62 },
  { key: '2025-03', cantidad: 55 },
  { key: '2025-04', cantidad: 70 },
  { key: '2025-05', cantidad: 48 },
  { key: '2025-06', cantidad: 80 },
  { key: '2025-07', cantidad: 65 },
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

// ============================================================
// Exports
// ============================================================

module.exports = {
  // Mock data
  MOCK_CONFIG,
  MOCK_USER,
  MOCK_ADMIN_USER,
  makeMockTrip,
  MOCK_TRIPS,
  MOCK_TRIP_DETAIL,
  MOCK_DRIVER_TRIPS,
  MOCK_PASSENGER_TRIPS,
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
  MOCK_NOTIFICATIONS,
  MOCK_PENDING_REQUESTS,
  MOCK_DELETE_REQUESTS,
  MOCK_BANNED_USERS,
  MOCK_MANUAL_VALIDATIONS,
  MOCK_MANUAL_VALIDATION_DETAIL,
  MOCK_MP_REJECTED,
  MOCK_MP_REJECTED_DETAIL,
  MOCK_TRANSACTIONS,
  MOCK_CHART_TRIPS,
  MOCK_CHART_SEATS,
  MOCK_CHART_USERS,
  MOCK_PROFILE_USER,

  // Utilities
  paginated,
  freezeClock,
  setupCatchAllMock,
  setupCommonMocks,
  setupAuthState,
  waitForPageReady,
};
