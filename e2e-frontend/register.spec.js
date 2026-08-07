const { test, expect } = require('@playwright/test');
const {
  setupCatchAllMock,
  setupCommonMocks,
  waitForPageReady,
} = require('./shared/mocks');

async function openEmailRegistrationForm(page) {
  const emailBtn = page.getByRole('button', { name: /^email$/i });
  if (await emailBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await emailBtn.click();
  }
}

async function fillRegistrationForm(page, {
  name = 'Test',
  surname = 'User',
  email = 'test@example.com',
  emailVerification = email,
  password = '12345678',
  passwordConfirmation = password,
} = {}) {
  await page.getByLabel(/^nombre$/i).fill(name);
  await page.getByLabel(/^apellido$/i).fill(surname);
  await page.getByLabel(/^email$/i).fill(email);
  await page.getByLabel(/ingrese nuevamente su email/i).fill(emailVerification);
  await page.getByLabel(/^contraseña$/i).fill(password);
  await page
    .getByLabel(/ingrese nuevamente su contraseña/i)
    .fill(passwordConfirmation);
}

test.describe('Register', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('https://www.google.com/recaptcha/**', (route) =>
      route.abort()
    );
    await page.route('https://www.gstatic.com/recaptcha/**', (route) =>
      route.abort()
    );

    await setupCatchAllMock(page);
    await setupCommonMocks(page);

    await page.addInitScript(() => {
      window.grecaptcha = {
        ready(cb) {
          cb();
        },
        execute() {
          return Promise.resolve('mock-recaptcha-token');
        },
      };
    });
  });

  test('renders registration form with all required fields', async ({ page }) => {
    await page.goto('/register');
    await waitForPageReady(page);
    await openEmailRegistrationForm(page);

    await expect(page.getByLabel(/^nombre$/i)).toBeVisible();
    await expect(page.getByLabel(/^apellido$/i)).toBeVisible();
    await expect(page.getByLabel(/^email$/i)).toBeVisible();
    await expect(
      page.getByLabel(/ingrese nuevamente su email/i)
    ).toBeVisible();
    await expect(page.getByLabel(/^contraseña$/i)).toBeVisible();
    await expect(
      page.getByLabel(/ingrese nuevamente su contraseña/i)
    ).toBeVisible();
    await expect(
      page.getByRole('checkbox', { name: /he leído y acepto/i })
    ).toBeVisible();
  });

  test('shows validation errors on empty required fields', async ({ page }) => {
    await page.goto('/register');
    await waitForPageReady(page);
    await openEmailRegistrationForm(page);

    await page.getByRole('checkbox', { name: /he leído y acepto/i }).check();
    await page.getByRole('button', { name: /registrarme/i }).click();

    await expect(page.getByText(/olvidó ingresar su nombre/i).first()).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByText(/olvidó ingresar su apellido/i).first()).toBeVisible();
    await expect(page.getByText(/olvidó ingresar su email/i).first()).toBeVisible();
    await expect(
      page.getByText(/olvidó ingresar su contraseña/i).first()
    ).toBeVisible();
  });

  test('shows email mismatch error when emails do not match', async ({ page }) => {
    await page.goto('/register');
    await waitForPageReady(page);
    await openEmailRegistrationForm(page);

    await fillRegistrationForm(page, {
      email: 'test@example.com',
      emailVerification: 'different@example.com',
    });
    await page.getByRole('checkbox', { name: /he leído y acepto/i }).check();
    await page.getByRole('button', { name: /registrarme/i }).click();

    await expect(page.getByText(/los emails no coinciden/i).first()).toBeVisible({
      timeout: 5000,
    });
  });

  test('shows success state after successful registration', async ({ page }) => {
    await page.route('**/api/users', (route) => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: { id: 100, name: 'Test User', active: false },
          }),
        });
      } else {
        route.continue();
      }
    });

    await page.goto('/register');
    await waitForPageReady(page);
    await openEmailRegistrationForm(page);

    await fillRegistrationForm(page);
    await page.getByRole('checkbox', { name: /he leído y acepto/i }).check();
    await page.getByRole('button', { name: /registrarme/i }).click();

    await expect(
      page.getByRole('heading', { name: /registro exitoso/i })
    ).toBeVisible({ timeout: 10000 });
  });
});
