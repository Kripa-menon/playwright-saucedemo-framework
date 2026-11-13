import { test as setup, expect } from "../src/fixtures/test-fixtures";
import { USERS } from "../src/data/users";
import { env } from "../src/config/env";
import { STANDARD_USER_STATE } from "../src/config/paths";

setup(
  "log in as standard user and save the session",
  async ({ page, loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard, env.saucedemo.password);
    await expect(inventoryPage.title).toHaveText("Products");

    await page.context().storageState({ path: STANDARD_USER_STATE });
  },
);
