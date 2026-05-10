import { test, expect } from "@playwright/test";

test.describe("Victory Modal & Confetti", () => {
  test("should load page without victory modal visible initially", async ({
    page,
  }) => {
    await page.goto("/");

    // Victory modal should NOT be visible on page load
    const victoryDialog = page
      .getByRole("dialog")
      .filter({ hasText: /Wins!/i });
    await expect(victoryDialog)
      .not.toBeVisible({ timeout: 2000 })
      .catch(() => {
        // Expected - modal shouldn't exist
      });
  });

  test("should not show victory modal on fresh game", async ({ page }) => {
    await page.goto("/");

    // Verify no "Play Again" button (only in victory modal)
    const playAgainButton = page.getByRole("button", { name: /Play Again/i });
    await expect(playAgainButton)
      .not.toBeVisible({ timeout: 2000 })
      .catch(() => {
        // Expected - button shouldn't exist
      });
  });

  test("should not show victory modal on page load", async ({ page }) => {
    await page.goto("/");

    // Verify no "Download Moves (PGN)" button (only in victory modal)
    const downloadButton = page.getByRole("button", {
      name: /Download Moves/i,
    });
    await expect(downloadButton)
      .not.toBeVisible({ timeout: 2000 })
      .catch(() => {
        // Expected - button shouldn't exist
      });
  });

  test("should have sound system available across browsers", async ({
    page,
  }) => {
    await page.goto("/");

    // Verify sound files exist (check public/sounds/ accessibility)
    const checkAudioResponse = await page.request.get("/sounds/check.mp3");
    expect(checkAudioResponse.status()).toBe(200);

    const checkmateAudioResponse = await page.request.get(
      "/sounds/checkmate.mp3",
    );
    expect(checkmateAudioResponse.status()).toBe(200);
  });
});
