import { test, expect } from "@playwright/test";

test.describe("Playwright Setup Verification", () => {
  test("should load homepage successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Chess/i);
  });

  test("should render main content on homepage", async ({ page }) => {
    await page.goto("/");
    const heading = page.getByRole("heading", { name: /pass.*play.*chess/i });
    await expect(heading).toBeVisible();
  });
});
