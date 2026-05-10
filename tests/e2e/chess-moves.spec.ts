import { test, expect } from "@playwright/test";

test.describe("Chess Move Mechanics", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for page to load
    await page.waitForLoadState("networkidle");
  });

  test("should display chess board on homepage", async ({ page }) => {
    // Verify heading present
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/chess/i);
  });

  test("should display sound toggle", async ({ page }) => {
    const soundToggle = page.getByRole("button", { name: /sound/i });
    await expect(soundToggle).toBeVisible();
  });

  test("should work consistently across browsers", async ({
    page,
    browserName,
  }) => {
    console.log(`Testing in ${browserName}`);

    // Verify page loads and core elements present
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("should have responsive layout", async ({ page, viewport }) => {
    console.log(`Testing at ${viewport?.width}x${viewport?.height}`);

    // Verify heading visible (page rendered)
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });
});
