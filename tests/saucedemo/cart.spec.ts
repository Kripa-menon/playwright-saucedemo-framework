import { test, expect } from "../../src/fixtures/test-fixtures";
import { PRODUCTS } from "../../src/data/products";

test.describe("Cart", () => {
  test.beforeEach(async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(PRODUCTS.backpack.name);
    await inventoryPage.addToCart(PRODUCTS.bikeLight.name);
    await inventoryPage.header.openCart();
    await expect(cartPage.title).toHaveText("Your Cart");
  });

  test("shows the products that were added", async ({ cartPage }) => {
    await expect(cartPage.itemNames).toHaveText([
      PRODUCTS.backpack.name,
      PRODUCTS.bikeLight.name,
    ]);
    await expect(cartPage.header.cartBadge).toHaveText("2");
  });

  test("removing a product updates the cart", async ({ cartPage }) => {
    await cartPage.removeItem(PRODUCTS.backpack.name);

    await expect(cartPage.itemNames).toHaveText([PRODUCTS.bikeLight.name]);
    await expect(cartPage.header.cartBadge).toHaveText("1");
  });

  test("continue shopping returns to the product list", async ({
    page,
    cartPage,
    inventoryPage,
  }) => {
    await cartPage.continueShopping();

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.title).toHaveText("Products");
  });
});

test.describe('Cart with a single product', () => {
  test('shows exactly one product', async ({ cartWithBackpack }) => {
    await expect(cartWithBackpack.title).toHaveText('Your Cart');
    await expect(cartWithBackpack.cartItems).toHaveCount(1);
    await expect(cartWithBackpack.itemNames).toHaveText([PRODUCTS.backpack.name]);
    await expect(cartWithBackpack.header.cartBadge).toHaveText('1');
  });
});
