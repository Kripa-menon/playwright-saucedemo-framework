import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { CartPage } from '../../src/pages/CartPage';
import { USERS } from '../../src/data/users';
import { PRODUCTS } from '../../src/data/products';
import { env } from '../../src/config/env';

test.describe('Cart', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS.standard, env.saucedemo.password);

    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    await inventoryPage.addToCart(PRODUCTS.backpack.name);
    await inventoryPage.addToCart(PRODUCTS.bikeLight.name);
    await inventoryPage.header.openCart();
    await expect(cartPage.title).toHaveText('Your Cart');
  });

  test('shows the products that were added', async () => {
    await expect(cartPage.itemNames).toHaveText([PRODUCTS.backpack.name, PRODUCTS.bikeLight.name]);
    await expect(cartPage.header.cartBadge).toHaveText('2');
  });

  test('removing a product updates the cart', async () => {
    await cartPage.removeItem(PRODUCTS.backpack.name);

    await expect(cartPage.itemNames).toHaveText([PRODUCTS.bikeLight.name]);
    await expect(cartPage.header.cartBadge).toHaveText('1');
  });

  test('continue shopping returns to the product list', async ({ page }) => {
    await cartPage.continueShopping();

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.title).toHaveText('Products');
  });
});