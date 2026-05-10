import { chromium } from "@playwright/test";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  // Find chessboard container
  const container = await page
    .locator('[data-testid="chessboard-container"]')
    .first();

  // Get all elements in the chessboard
  const innerHTML = await container.evaluate((el) => {
    // Get first few squares and pieces to understand structure
    return el.innerHTML.substring(0, 2000);
  });

  console.log("=== CHESSBOARD HTML STRUCTURE ===");
  console.log(innerHTML);

  // Try to find a piece element
  const allButtons = await page.locator("button").all();
  if (allButtons.length > 0) {
    const firstButton = allButtons[0];
    const attrs = await firstButton.evaluate((el) => {
      const attrObj: Record<string, string> = {};
      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        attrObj[attr.name] = attr.value;
      }
      return {
        tagName: el.tagName,
        classList: Array.from(el.classList),
        attributes: attrObj,
        innerHTML: el.innerHTML.substring(0, 200),
      };
    });

    console.log("\n=== FIRST BUTTON (PIECE?) ===");
    console.log(JSON.stringify(attrs, null, 2));
  }

  await browser.close();
})();
