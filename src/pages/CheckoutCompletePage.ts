import type { Locator, Page } from "@playwright/test";

/** Final page: "Checkout: Complete!". */
export class CheckoutCompletePage {
  readonly page: Page;
  readonly title: Locator;
  readonly completeHeader: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId("title");
    this.completeHeader = page.getByTestId("complete-header");
    this.backHomeButton = page.getByRole("button", { name: "Back Home" });
  }

  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
