import { test, expect } from "../../src/fixtures/test-fixtures";
import { ALL_PRODUCTS, PRODUCTS } from "../../src/data/products";
import { formatPrice } from "../../src/utils/money";

test.describe("Inventory", () => {
  test.beforeEach(async ({ inventoryPage }) => {
    // Already logged in through the saved session: go straight to the page.
    await inventoryPage.goto();
    await expect(inventoryPage.title).toHaveText("Products");
  });

  test("shows all six products", async ({ inventoryPage }) => {
    await expect(inventoryPage.items).toHaveCount(ALL_PRODUCTS.length);
  });

  test("sorts products by name Z to A", async ({ inventoryPage }) => {
    const expectedNames = ALL_PRODUCTS.map((p) => p.name).sort((a, b) =>
      b.localeCompare(a),
    );

    await inventoryPage.sortBy("za");

    await expect(inventoryPage.itemNames).toHaveText(expectedNames);
  });

  test("sorts products by price low to high", async ({ inventoryPage }) => {
    const expectedPrices = ALL_PRODUCTS.map((p) => p.price)
      .sort((a, b) => a - b)
      .map(formatPrice);

    await inventoryPage.sortBy("lohi");

    await expect(inventoryPage.itemPrices).toHaveText(expectedPrices);
  });

  test("sorts products by price high to low", async ({ inventoryPage }) => {
    const expectedPrices = ALL_PRODUCTS.map((p) => p.price)
      .sort((a, b) => b - a)
      .map(formatPrice);

    await inventoryPage.sortBy("hilo");

    await expect(inventoryPage.itemPrices).toHaveText(expectedPrices);
  });

  test("adding a product updates the cart badge and button", async ({
    inventoryPage,
  }) => {
    const card = inventoryPage.productCard(PRODUCTS.backpack.name);

    await inventoryPage.addToCart(PRODUCTS.backpack.name);

    await expect(inventoryPage.header.cartBadge).toHaveText("1");
    await expect(card.getByRole("button", { name: "Remove" })).toBeVisible();
  });

  test("removing the only product hides the cart badge", async ({
    inventoryPage,
  }) => {
    await inventoryPage.addToCart(PRODUCTS.backpack.name);
    await expect(inventoryPage.header.cartBadge).toHaveText("1");

    await inventoryPage.removeFromCart(PRODUCTS.backpack.name);

    await expect(inventoryPage.header.cartBadge).toBeHidden();
  });
});
