import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('binti-cookie-choice-v1', 'functional'));
});

test('home communicates made-in-Kenya Mrembo and the charitable mission without internal compliance copy', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Made here. Made for her.' })).toBeVisible();
  await expect(page.getByText('The mission stayed. The model grew stronger.')).toBeVisible();
  await expect(page.getByText('Where women lift as they rise.')).toBeVisible();
  await expect(page.getByText('Put product support behind a school.')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Binti Marvels home' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Shop Mrembo' }).first()).toBeVisible();
  await expect(page.locator('body')).not.toContainText(/private company|not an ngo|prototype|daraja|selected till|pay by card/i);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  expect(overflow).toBe(false);
});

test('basket persists and checkout shows a server delivery price for the selected address', async ({ page }) => {
  await page.goto('/shop');
  await page.getByRole('button', { name: 'Add to basket' }).first().click();
  const basket = page.getByRole('dialog', { name: /Your Basket/ });
  await expect(basket).toBeVisible();
  await expect(basket.getByRole('button', { name: 'Close basket' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(basket).toBeHidden();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Open basket with 1 items' })).toBeVisible();
  await page.goto('/checkout');
  await page.getByLabel('Delivery address').fill('Kilimani');
  await page.getByRole('button', { name: /Kilimani/ }).click();
  await expect(page.getByText('Address selected')).toBeVisible();
  await page.getByRole('button', { name: 'Check delivery' }).click();
  const quote = page.getByRole('link', { name: 'Continue with Binti' }).locator('..');
  await expect(quote).toContainText('Delivery');
  await expect(quote).toContainText('KSh 250');
  await expect(quote).toContainText('Total for this location');
  await expect(quote).toContainText('KSh 750');
  await expect(page.getByText('Payment confirmed.')).toHaveCount(0);
});

test('checkout accepts an exact map pin with a recognisable landmark', async ({ page }) => {
  await page.goto('/shop');
  await page.getByRole('button', { name: 'Add to basket' }).first().click();
  await page.keyboard.press('Escape');
  await page.goto('/checkout');
  await page.getByRole('tab', { name: 'Choose on map' }).click();
  const map = page.locator('.leaflet-container');
  await expect(map).toBeVisible();
  await map.click({ position: { x: 180, y: 150 } });
  await expect(page.getByText('Pin selected')).toBeVisible();
  await page.getByLabel('Building, gate or landmark').fill('ABC Plaza main gate');
  await page.getByRole('button', { name: 'Check delivery' }).click();
  const quote = page.getByRole('link', { name: 'Continue with Binti' }).locator('..');
  await expect(quote).toContainText('Delivery');
  await expect(quote).toContainText('KSh 250');
  await expect(page.getByRole('link', { name: 'OpenStreetMap', exact: true })).toBeVisible();
});

test('Pesapal UI preserves its idempotency key after an uncertain request', async ({ page }) => {
  const keys: string[] = [];
  await page.route('**/api/checkout/quote', async (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ subtotalKsh: 500, deliveryFeeKsh: 250, totalKsh: 750, manualQuote: false, destinationAddress: 'ABC Plaza main gate', destinationType: 'doorstep', onlinePaymentAvailable: true }),
  }));
  await page.route('**/api/checkout/create', async (route) => {
    keys.push((await route.request().postDataJSON()).idempotencyKey);
    await route.fulfill({
      status: 502,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'The Pesapal request status is uncertain.', retryWithNewKey: false }),
    });
  });
  await page.goto('/shop');
  await page.getByRole('button', { name: 'Add to basket' }).first().click();
  await page.keyboard.press('Escape');
  await page.goto('/checkout');
  await page.getByRole('tab', { name: 'Choose on map' }).click();
  await page.locator('.leaflet-container').click({ position: { x: 180, y: 150 } });
  await page.getByLabel('Building, gate or landmark').fill('ABC Plaza main gate');
  await page.getByRole('button', { name: 'Check delivery' }).click();
  await page.getByLabel('Full name').fill('Review Customer');
  await page.getByLabel('Mobile number').fill('0712345678');
  await page.getByLabel(/I agree to receive order/).check();
  await page.getByRole('button', { name: /Continue to Pesapal/ }).click();
  await expect(page.getByText('The Pesapal request status is uncertain.', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Continue to Pesapal/ }).click();
  expect(keys).toHaveLength(2);
  expect(keys[0]).toBe(keys[1]);
});

test('legacy partnership route resolves to a rich Binti Charity page', async ({ page }) => {
  await page.goto('/partnerships');
  await expect(page).toHaveURL(/\/binti-charity$/);
  await expect(page.getByRole('heading', { name: 'Help a girl stay ready for school.' })).toBeVisible();
  await expect(page.getByText('Dairyland Kenya × Mizizi Wellness')).toBeVisible();
  await expect(page.getByText('The first Binti Charity Golf Tournament.')).toBeVisible();
  await expect(page.locator('body')).not.toContainText(/private company|not an ngo/i);
});

test('school support, current leadership and Mrembo care formats are clear', async ({ page }) => {
  await page.goto('/binti-charity');
  await expect(page.getByRole('heading', { name: 'Support pads for a school.' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Donate securely with Pesapal/ })).toBeDisabled();
  await expect(page.getByLabel('Chat with Binti on WhatsApp')).toHaveCount(0);
  await expect(page.getByText('Online school-support payments are being prepared.')).toBeVisible();
  await page.goto('/our-story');
  await expect(page.getByRole('heading', { name: 'Lorna Joyce', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Barnabas “Banns” Njiru' })).toBeVisible();
  await expect(page.locator('body')).not.toContainText('Beth Karagu');
  await page.goto('/shop');
  await expect(page.getByRole('heading', { name: 'Ultra Long pads' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Panty liners' })).toBeVisible();
});

test('unsigned payment-state URLs cannot claim a verified payment', async ({ page }) => {
  await page.goto('/payment-status?state=paid&reference=FORGED-123');
  await expect(page.getByRole('heading', { name: 'We are checking your payment.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Payment verified.' })).toHaveCount(0);
});

test('delivery pricing journey has no overlapping floating WhatsApp control', async ({ page }) => {
  await page.goto('/delivery');
  await expect(page.getByLabel('Chat with Binti on WhatsApp')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Check delivery' })).toBeVisible();
});

test('mobile menu exposes every primary journey', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('mobile'));
  await page.goto('/');
  await page.getByRole('button', { name: 'Open menu' }).click();
  const dialog = page.getByRole('dialog', { name: 'Site navigation' });
  for (const label of ['Home','Our Story','Shop Mrembo','Binti Circles','Binti Charity','Donate to schools','Contact']) {
    await expect(dialog.getByRole('link', { name: label, exact: true })).toBeVisible();
  }
  await expect(dialog.getByRole('button', { name: 'Close menu' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
});
