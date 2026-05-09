import { test, expect } from "@playwright/test";

test.describe("Audio Feedback System", () => {
  test("should display sound toggle button", async ({ page }) => {
    await page.goto("/");

    // Verify sound toggle exists
    const soundToggle = page.getByRole("button", { name: /sound/i });
    await expect(soundToggle).toBeVisible();
  });

  test("should allow toggling sound button", async ({ page }) => {
    await page.goto("/");

    const soundToggle = page.getByRole("button", { name: /sound/i });
    await expect(soundToggle).toBeVisible();

    // Click to toggle sound
    await soundToggle.click();
    await page.waitForTimeout(100);

    // Button should still be visible after toggle
    await expect(soundToggle).toBeVisible();
  });
});
