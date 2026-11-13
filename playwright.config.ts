import { defineConfig, devices } from "@playwright/test";
import { env } from "./src/config/env";
import { STANDARD_USER_STATE } from "./src/config/paths";

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: env.saucedemo.baseUrl,
    testIdAttribute: "data-test",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: STANDARD_USER_STATE,
      },
      dependencies: ["setup"],
    },
  ],
});
