import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, ".env") });

const isCI = !!process.env.CI;

const reporters: any[] = [["html"]];

if (!isCI) {
  reporters.push([
    "playwright-qase-reporter",
    {
      mode: "testops",
      testops: {
        api: {
          token: process.env.QASE_API_TOKEN,
        },
        project: process.env.QASE_PROJECT_CODE,
        run: {
          complete: true,
        },
      },
    },
  ]);
}

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: reporters,
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "npm run dev --prefix ../frontend",
    url: "http://localhost:5173",
    reuseExistingServer: true,
    stdout: "ignore",
    stderr: "pipe",
  },
});
