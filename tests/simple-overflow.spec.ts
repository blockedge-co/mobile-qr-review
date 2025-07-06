import { test, expect } from '@playwright/test';

test.describe('Simple Overflow Tests', () => {
  test('should prevent horizontal overflow on various mobile sizes', async ({ page }) => {
    const mobileSizes = [
      { width: 320, height: 568, name: 'iPhone SE' },
      { width: 375, height: 667, name: 'iPhone 8' },
      { width: 414, height: 896, name: 'iPhone 11' },
    ];

    for (const size of mobileSizes) {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto('http://localhost:3000');
      await page.waitForTimeout(1000);

      // Check for horizontal scrollbars
      const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
      
      expect(bodyScrollWidth, `${size.name} should not have horizontal overflow`).toBeLessThanOrEqual(bodyClientWidth + 2);

      // Check that key elements are visible
      await expect(page.locator('text=Carbon Credits')).toBeVisible();
      await expect(page.locator('text=Complete Purchase')).toBeVisible();
    }
  });

  test('should have proper text wrapping on narrow screens', async ({ page }) => {
    await page.setViewportSize({ width: 280, height: 568 }); // Very narrow
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(1000);

    // Check that content is still accessible
    await expect(page.locator('text=Offset Your Carbon Footprint')).toBeVisible();
    await expect(page.locator('text=Select Project')).toBeVisible();
    await expect(page.locator('text=Choose Duration')).toBeVisible();

    // Verify no horizontal scroll
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 2);
  });

  test('should maintain button accessibility on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(1000);

    const button = page.locator('text=Complete Purchase');
    await expect(button).toBeVisible();
    
    const buttonBox = await button.boundingBox();
    expect(buttonBox!.width).toBeLessThanOrEqual(375 - 32); // Account for padding
    expect(buttonBox!.y).toBeGreaterThan(500); // Should be near bottom
  });

  test('should display hero stats properly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(1000);

    // Check stats are visible
    await expect(page.locator('text=2.4M+')).toBeVisible();
    await expect(page.locator('text=850K+')).toBeVisible();
    await expect(page.locator('text=Tons Offset')).toBeVisible();
    await expect(page.locator('text=Trees Protected')).toBeVisible();
  });

  test('should handle card content overflow properly', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(1000);

    // Find all cards and check they fit within viewport
    const cards = page.locator('.shadow-lg');
    const cardCount = await cards.count();
    
    for (let i = 0; i < cardCount; i++) {
      const card = cards.nth(i);
      const cardBox = await card.boundingBox();
      
      if (cardBox) {
        expect(cardBox.width, `Card ${i} should fit within viewport`).toBeLessThanOrEqual(320 - 32);
      }
    }
  });
});