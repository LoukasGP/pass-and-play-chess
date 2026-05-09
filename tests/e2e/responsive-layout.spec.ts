import { test, expect } from "@playwright/test";

test.describe("Responsive Layout Adaptation", () => {
  test("should adapt layout for mobile viewport (375×667)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Verify main content visible
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();

    // Verify sound toggle visible (key UI element)
    const soundToggle = page.getByRole("button", { name: /sound/i });
    await expect(soundToggle).toBeVisible();

    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  });

  test("should adapt layout for tablet viewport (768×1024)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");

    // Verify main content visible
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();

    // Verify sound toggle visible
    const soundToggle = page.getByRole("button", { name: /sound/i });
    await expect(soundToggle).toBeVisible();

    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  });

  test("should adapt layout for desktop viewport (1280×720)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");

    // Verify main content visible
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();

    // Verify sound toggle visible
    const soundToggle = page.getByRole("button", { name: /sound/i });
    await expect(soundToggle).toBeVisible();

    // Verify no horizontal scroll
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth,
    );
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  });

  test("should maintain layout consistency across viewports", async ({
    page,
  }) => {
    const viewports = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1280, height: 720 },
      { width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto("/");

      // Verify core elements visible at all sizes
      const heading = page.locator("h1");
      await expect(heading).toBeVisible();

      const soundToggle = page.getByRole("button", { name: /sound/i });
      await expect(soundToggle).toBeVisible();

      // No horizontal overflow
      const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
      );
      const clientWidth = await page.evaluate(
        () => document.documentElement.clientWidth,
      );
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
    }
  });
});
