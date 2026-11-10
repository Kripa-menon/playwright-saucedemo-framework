import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutInfoPage } from '../../src/pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../../src/pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../../src/pages/CheckoutCompletePage';
import { USERS } from '../../src/data/users';
import { PRODUCTS } from '../../src/data/products';
import { DEFAULT_CUSTOMER } from '../../src/data/customers';
import { env } from '../../src/config/env';
import { formatPrice, roundToCents } from '../../src/utils/money';

const TAX_RATE = 0.08;

test.describe('Checkout', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let infoPage: CheckoutInfoPage;
  let overviewPage: CheckoutOverviewPage;
  let completePage: CheckoutCompletePage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard, env.saucedemo.password);

    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    infoPage = new CheckoutInfoPage(page);
    overviewPage = new CheckoutOverviewPage(page);
    completePage = new CheckoutCompletePage(page);
  });

  test('customer can buy two products end to end', async ({ page }) => {
    const products = [PRODUCTS.backpack, PRODUCTS.bikeLight];
    const itemTotal = roundToCents(products.reduce((sum, p) => sum + p.price, 0));
    const tax = roundToCents(itemTotal * TAX_RATE);
    const total = roundToCents(itemTotal + tax);

    for (const product of products) {
      await inventoryPage.addToCart(product.name);
    }
    await inventoryPage.header.openCart();
    await cartPage.checkout();

    await expect(infoPage.title).toHaveText('Checkout: Your Information');
    await infoPage.fillCustomerInfo(DEFAULT_CUSTOMER);
    await infoPage.continue();

    await expect(overviewPage.title).toHaveText('Checkout: Overview');
    await expect(overviewPage.itemNames).toHaveText(products.map((p) => p.name));
    await expect(overviewPage.subtotalLabel).toHaveText(`Item total: ${formatPrice(itemTotal)}`);
    await expect(overviewPage.taxLabel).toHaveText(`Tax: ${formatPrice(tax)}`);
    await expect(overviewPage.totalLabel).toHaveText(`Total: ${formatPrice(total)}`);
    await overviewPage.finish();

    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(completePage.completeHeader).toHaveText('Thank you for your order!');
    await expect(inventoryPage.header.cartBadge).toBeHidden();
  });

  test('shows an error when first name is missing', async () => {
    await inventoryPage.addToCart(PRODUCTS.backpack.name);
    await inventoryPage.header.openCart();
    await cartPage.checkout();

    await infoPage.fillCustomerInfo({ ...DEFAULT_CUSTOMER, firstName: '' });
    await infoPage.continue();

    await expect(infoPage.errorMessage).toHaveText('Error: First Name is required');
  });
});