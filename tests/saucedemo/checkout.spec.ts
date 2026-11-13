import { test, expect } from "../../src/fixtures/test-fixtures";
import { PRODUCTS } from "../../src/data/products";
import { DEFAULT_CUSTOMER } from "../../src/data/customers";
import { formatPrice, roundToCents } from "../../src/utils/money";

const TAX_RATE = 0.08;

test.describe("Checkout", () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test("customer can buy two products end to end", async ({
    page,
    inventoryPage,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
  }) => {
    const products = [PRODUCTS.backpack, PRODUCTS.bikeLight];
    const itemTotal = roundToCents(
      products.reduce((sum, p) => sum + p.price, 0),
    );
    const tax = roundToCents(itemTotal * TAX_RATE);
    const total = roundToCents(itemTotal + tax);

    for (const product of products) {
      await inventoryPage.addToCart(product.name);
    }
    await inventoryPage.header.openCart();
    await cartPage.checkout();

    await expect(checkoutInfoPage.title).toHaveText(
      "Checkout: Your Information",
    );
    await checkoutInfoPage.fillCustomerInfo(DEFAULT_CUSTOMER);
    await checkoutInfoPage.continue();

    await expect(checkoutOverviewPage.title).toHaveText("Checkout: Overview");
    await expect(checkoutOverviewPage.itemNames).toHaveText(
      products.map((p) => p.name),
    );
    await expect(checkoutOverviewPage.subtotalLabel).toHaveText(
      `Item total: ${formatPrice(itemTotal)}`,
    );
    await expect(checkoutOverviewPage.taxLabel).toHaveText(
      `Tax: ${formatPrice(tax)}`,
    );
    await expect(checkoutOverviewPage.totalLabel).toHaveText(
      `Total: ${formatPrice(total)}`,
    );
    await checkoutOverviewPage.finish();

    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(checkoutCompletePage.completeHeader).toHaveText(
      "Thank you for your order!",
    );
    await expect(inventoryPage.header.cartBadge).toBeHidden();
  });

  test("shows an error when first name is missing", async ({
    inventoryPage,
    cartPage,
    checkoutInfoPage,
  }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack.name);
    await inventoryPage.header.openCart();
    await cartPage.checkout();

    await checkoutInfoPage.fillCustomerInfo({
      ...DEFAULT_CUSTOMER,
      firstName: "",
    });
    await checkoutInfoPage.continue();

    await expect(checkoutInfoPage.errorMessage).toHaveText(
      "Error: First Name is required",
    );
  });
});
