import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { USERS } from '../../src/data/users';
import { ALL_PRODUCTS, PRODUCTS } from '../../src/data/products';
import { env } from '../../src/config/env';
import { formatPrice } from '../../src/utils/money';

test.describe('Inventory', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    // Phase 3 replaces this UI login with a saved session (storage state).
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard, env.saucedemo.password);

    inventoryPage = new InventoryPage(page);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  test('shows all six products', async () => {
    await expect(inventoryPage.items).toHaveCount(ALL_PRODUCTS.length);
  });

  test('sorts products by name Z to A', async () => {
    const expectedNames = ALL_PRODUCTS.map((p) => p.name).sort((a, b) => b.localeCompare(a));

    await inventoryPage.sortBy('za');

    await expect(inventoryPage.itemNames).toHaveText(expectedNames);
  });

  test('sorts products by price low to high', async () => {
    const expectedPrices = ALL_PRODUCTS.map((p) => p.price)
      .sort((a, b) => a - b)
      .map(formatPrice);

    await inventoryPage.sortBy('lohi');

    await expect(inventoryPage.itemPrices).toHaveText(expectedPrices);
  });

  test('sorts products by price high to low', async () => {
    const expectedPrices = ALL_PRODUCTS.map((p) => p.price)
      .sort((a, b) => b - a)
      .map(formatPrice);

    await inventoryPage.sortBy('hilo');

    await expect(inventoryPage.itemPrices).toHaveText(expectedPrices);
  });

  test('adding a product updates the cart badge and button', async () => {
    const card = inventoryPage.productCard(PRODUCTS.backpack.name);

    await inventoryPage.addToCart(PRODUCTS.backpack.name);

    await expect(inventoryPage.header.cartBadge).toHaveText('1');
    await expect(card.getByRole('button', { name: 'Remove' })).toBeVisible();
  });

  test('removing the only product hides the cart badge', async () => {
    await inventoryPage.addToCart(PRODUCTS.backpack.name);
    await expect(inventoryPage.header.cartBadge).toHaveText('1');

    await inventoryPage.removeFromCart(PRODUCTS.backpack.name);

    await expect(inventoryPage.header.cartBadge).toBeHidden();
  });
});