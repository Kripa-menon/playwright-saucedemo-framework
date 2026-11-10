import type { Locator, Page } from '@playwright/test';

/** Checkout step two: "Checkout: Overview". */
export class CheckoutOverviewPage {
  readonly page: Page;
  readonly title: Locator;
  readonly itemNames: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByRole('button', { name: 'Finish' });
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}