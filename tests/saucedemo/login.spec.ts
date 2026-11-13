import { test, expect } from "../../src/fixtures/test-fixtures";
import { USERS } from "../../src/data/users";
import { env } from "../../src/config/env";

// Login tests must start logged out, so they ignore the saved session.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Login", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test("standard user can log in and sees the product list", async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.login(USERS.standard, env.saucedemo.password);

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventoryPage.title).toHaveText("Products");
  });

  test("user can log out and return to the login page", async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.login(USERS.standard, env.saucedemo.password);

    await inventoryPage.header.logout();

    await expect(loginPage.loginButton).toBeVisible();
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  const invalidLogins = [
    {
      scenario: "locked out user",
      username: USERS.lockedOut,
      password: env.saucedemo.password,
      expectedError: "Sorry, this user has been locked out.",
    },
    {
      scenario: "wrong password",
      username: USERS.standard,
      password: "wrong_password",
      expectedError:
        "Username and password do not match any user in this service",
    },
    {
      scenario: "empty username",
      username: "",
      password: env.saucedemo.password,
      expectedError: "Username is required",
    },
    {
      scenario: "empty password",
      username: USERS.standard,
      password: "",
      expectedError: "Password is required",
    },
  ];

  for (const { scenario, username, password, expectedError } of invalidLogins) {
    test(`shows an error for ${scenario}`, async ({ page, loginPage }) => {
      await loginPage.login(username, password);

      await expect(loginPage.errorMessage).toContainText(expectedError);
      await expect(page).not.toHaveURL(/inventory\.html/);
    });
  }
});
