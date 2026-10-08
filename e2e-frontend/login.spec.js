const { test, expect } = require('@playwright/test');
const {
  setupCatchAllMock,
  setupCommonMocks,
  waitForPageReady,
} = require('./shared/mocks');

async function fillLoginForm(page, { email, password }) {
  await page.getByLabel(/^email$/i).fill(email);
  await page.getByLabel(/^contraseña$/i).fill(password);
}

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await setupCatchAllMock(page);
    await setupCommonMocks(page);
  });

  test('renders login form with email, password fields and login button', async ({ page }) => {
    await page.goto('/login');
    await waitForPageReady(page);

    await expect(page.getByLabel(/^email$/i)).toBeVisible();
    await expect(page.getByLabel(/^contraseña$/i)).toBeVisible();
    await expect(
      page.getByRole('button', { name: /iniciar sesión/i })
    ).toBeVisible();
  });

  test('toggles password visibility when clicking the show/hide button', async ({ page }) => {
    await page.goto('/login');
    await waitForPageReady(page);

    const passwordInput = page.getByLabel(/^contraseña$/i);
    await expect(passwordInput).toHaveAttribute('type', 'password');

    await page.getByRole('button', { name: /mostrar contraseña/i }).click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    await page.getByRole('button', { name: /ocultar contraseña/i }).click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('shows error toast on invalid credentials (401)', async ({ page }) => {
    await page.route('**/api/login', (route) => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'invalid_credentials' }),
      });
    });

    await page.goto('/login');
    await waitForPageReady(page);

    await fillLoginForm(page, {
      email: 'wrong@email.com',
      password: 'wrongpassword',
    });
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    await expect(
      page.getByText(/email o password incorrecto/i)
    ).toBeVisible({ timeout: 10000 });
  });

  test('shows "user not active" alert when user is not activated', async ({ page }) => {
    await page.route('**/api/login', (route) => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'user_not_active' }),
      });
    });

    await page.goto('/login');
    await waitForPageReady(page);

    await fillLoginForm(page, {
      email: 'inactive@email.com',
      password: '123456',
    });
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    await expect(page.getByRole('alert')).toContainText(/activar/i, {
      timeout: 10000,
    });
  });

  test('lets a banned user into mesa de ayuda after login', async ({ page }) => {
    const { MOCK_USER } = require('./shared/mocks');

    await page.route('**/api/login', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: 'banned-token', config: {} }),
      });
    });
    await page.route('**/api/users/me', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { ...MOCK_USER, banned: 1 } }),
      });
    });
    await page.route('**/api/support/tickets**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] }),
      });
    });

    await page.goto('/login');
    await waitForPageReady(page);

    await fillLoginForm(page, {
      email: 'banned@email.com',
      password: '123456',
    });
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    await expect(page).toHaveURL(/soporte/, { timeout: 10000 });
    await expect(
      page.getByText(/desactivada por el equipo de Carpoolear/i)
    ).toBeVisible({ timeout: 10000 });
  });
});
