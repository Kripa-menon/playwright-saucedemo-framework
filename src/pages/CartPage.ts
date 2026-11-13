import type { Locator, Page } from "@playwright/test";
import { HeaderComponent } from "../components/HeaderComponent";

export class CartPage {
  readonly page: Page;
  readonly header: HeaderComponent;
  readonly title: Locator;
  readonly cartItems: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.title = page.getByTestId("title");
    this.cartItems = page.getByTestId("inventory-item");
    this.itemNames = page.getByTestId("inventory-item-name");
    this.checkoutButton = page.getByRole("button", { name: "Checkout" });
    this.continueShoppingButton = page.getByRole("button", {
      name: "Continue Shopping",
    });
  }

  async removeItem(productName: string): Promise<void> {
    await this.cartItems
      .filter({ has: this.page.getByText(productName, { exact: true }) })
      .getByRole("button", { name: "Remove" })
      .click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
