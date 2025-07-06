import { test, expect } from '@playwright/test';

test.describe('Overflow Prevention Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000); // Wait for animations
  });

  test('should not have horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check for horizontal scrollbars
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
    
    expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 2); // Allow small tolerance
  });

  test('should open and close project dropdown without overflow', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 }); // Very small mobile
    
    // Find and click project selection dropdown
    const projectCard = page.locator('text=Select Project').locator('..');
    const selectTrigger = projectCard.locator('button').first();
    
    await selectTrigger.click();
    await page.waitForTimeout(500);
    
    // Check if dropdown is visible and within bounds
    const dropdown = page.locator('[role="listbox"]');
    if (await dropdown.isVisible()) {
      const dropdownBox = await dropdown.boundingBox();
      expect(dropdownBox!.width).toBeLessThanOrEqual(320 - 16); // Account for padding
      
      // Close dropdown by clicking outside
      await page.click('body', { position: { x: 10, y: 10 } });
    }
  });

  test('should open and close duration dropdown without overflow', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 }); // Very small mobile
    
    // Find and click duration selection dropdown
    const durationCard = page.locator('text=Choose Duration').locator('..');
    const selectTrigger = durationCard.locator('button').first();
    
    await selectTrigger.click();
    await page.waitForTimeout(500);
    
    // Check if dropdown is visible and within bounds
    const dropdown = page.locator('[role="listbox"]');
    if (await dropdown.isVisible()) {
      const dropdownBox = await dropdown.boundingBox();
      expect(dropdownBox!.width).toBeLessThanOrEqual(320 - 16); // Account for padding
      
      // Close dropdown by clicking outside
      await page.click('body', { position: { x: 10, y: 10 } });
    }
  });

  test('should display all text content without truncation issues', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 },
      { width: 375, height: 667 },
      { width: 414, height: 896 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      
      // Check key text elements are visible
      await expect(page.locator('text=Carbon Credits')).toBeVisible();
      await expect(page.locator('text=Offset Your Carbon Footprint')).toBeVisible();
      await expect(page.locator('text=Select Project')).toBeVisible();
      await expect(page.locator('text=Choose Duration')).toBeVisible();
      await expect(page.locator('text=Complete Purchase')).toBeVisible();
    }
  });

  test('should handle bottom button without covering content', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check bottom button is present and positioned correctly
    const bottomButton = page.locator('text=Complete Purchase');
    await expect(bottomButton).toBeVisible();
    
    const buttonBox = await bottomButton.boundingBox();
    expect(buttonBox!.y).toBeGreaterThan(500); // Should be near bottom
    
    // Ensure content has proper padding to avoid overlap
    const lastCard = page.locator('.shadow-lg').last();
    const lastCardBox = await lastCard.boundingBox();
    const gap = buttonBox!.y - (lastCardBox!.y + lastCardBox!.height);
    
    expect(gap).toBeGreaterThan(20); // Sufficient gap between content and button
  });
});