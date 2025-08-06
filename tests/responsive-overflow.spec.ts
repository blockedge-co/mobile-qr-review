import { test, expect } from '@playwright/test';

test.describe('Responsive Design & Overflow Tests', () => {
  const viewports = [
    { name: 'Mobile Small', width: 320, height: 568 },
    { name: 'Mobile Medium', width: 375, height: 667 },
    { name: 'Mobile Large', width: 414, height: 896 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1024, height: 768 },
  ];

  viewports.forEach(viewport => {
    test(`should handle ${viewport.name} viewport without overflow`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:3002');

      // Wait for content to load
      await page.waitForSelector('[data-testid="landing-content"]', { timeout: 10000 });

      // Check for horizontal scrollbars
      const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
      
      expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 1); // Allow 1px tolerance

      // Test header responsiveness
      await test.step('Header should fit without overflow', async () => {
        const header = page.locator('header');
        await expect(header).toBeVisible();
        
        const headerBox = await header.boundingBox();
        expect(headerBox!.width).toBeLessThanOrEqual(viewport.width);
        
        // Check if all header elements are visible
        await expect(header.locator('button[aria-label="Back"]')).toBeVisible();
        await expect(header.locator('text=Carbon Credits')).toBeVisible();
        await expect(header.locator('text=Verified')).toBeVisible();
      });

      // Test hero section responsiveness
      await test.step('Hero section should fit without overflow', async () => {
        const hero = page.locator('section').first();
        await expect(hero).toBeVisible();
        
        const heroBox = await hero.boundingBox();
        expect(heroBox!.width).toBeLessThanOrEqual(viewport.width);
        
        // Check stats display
        await expect(hero.locator('text=2.4M+')).toBeVisible();
        await expect(hero.locator('text=850K+')).toBeVisible();
        await expect(hero.locator('text=Tons Offset')).toBeVisible();
        await expect(hero.locator('text=Trees Protected')).toBeVisible();
      });

      // Test project selection dropdown
      await test.step('Project selection dropdown should work properly', async () => {
        const projectCard = page.locator('text=Select Project').locator('..').locator('..');
        await expect(projectCard).toBeVisible();
        
        const selectTrigger = projectCard.locator('[role="combobox"]');
        await selectTrigger.click();
        
        // Wait for dropdown to open
        await page.waitForSelector('[role="listbox"]', { timeout: 5000 });
        
        const dropdown = page.locator('[role="listbox"]');
        await expect(dropdown).toBeVisible();
        
        // Check dropdown width doesn't exceed viewport
        const dropdownBox = await dropdown.boundingBox();
        expect(dropdownBox!.width).toBeLessThanOrEqual(viewport.width - 32); // Account for padding
        
        // Check all project options are visible and not truncated
        const projectOptions = dropdown.locator('[role="option"]');
        const optionCount = await projectOptions.count();
        
        for (let i = 0; i < optionCount; i++) {
          const option = projectOptions.nth(i);
          await expect(option).toBeVisible();
          
          // Check project name is visible
          await expect(option.locator('text=Thailand')).toBeVisible();
        }
        
        // Select first project
        await projectOptions.first().click();
        
        // Verify dropdown closes
        await expect(dropdown).not.toBeVisible();
      });

      // Test duration selection dropdown
      await test.step('Duration selection dropdown should work properly', async () => {
        const durationCard = page.locator('text=Choose Duration').locator('..').locator('..');
        await expect(durationCard).toBeVisible();
        
        const selectTrigger = durationCard.locator('[role="combobox"]');
        await selectTrigger.click();
        
        // Wait for dropdown to open
        await page.waitForSelector('[role="listbox"]', { timeout: 5000 });
        
        const dropdown = page.locator('[role="listbox"]');
        await expect(dropdown).toBeVisible();
        
        // Check dropdown width doesn't exceed viewport
        const dropdownBox = await dropdown.boundingBox();
        expect(dropdownBox!.width).toBeLessThanOrEqual(viewport.width - 32);
        
        // Check all duration options are visible
        const durationOptions = dropdown.locator('[role="option"]');
        const optionCount = await durationOptions.count();
        
        for (let i = 0; i < optionCount; i++) {
          const option = durationOptions.nth(i);
          await expect(option).toBeVisible();
          
          // Check price is visible and not cut off
          await expect(option.locator('text=฿')).toBeVisible();
        }
        
        // Select first duration
        await durationOptions.first().click();
        
        // Verify dropdown closes
        await expect(dropdown).not.toBeVisible();
      });

      // Test fixed bottom button
      await test.step('Bottom purchase button should be accessible', async () => {
        const bottomButton = page.locator('text=Complete Purchase');
        await expect(bottomButton).toBeVisible();
        
        const buttonBox = await bottomButton.boundingBox();
        expect(buttonBox!.width).toBeLessThanOrEqual(viewport.width - 32); // Account for padding
        
        // Check button is actually at bottom
        expect(buttonBox!.y).toBeGreaterThan(viewport.height - 100);
        
        // Check security text is visible
        await expect(page.locator('text=Secure payment')).toBeVisible();
      });

      // Test all cards fit within viewport
      await test.step('All cards should fit within viewport width', async () => {
        const cards = page.locator('.shadow-lg');
        const cardCount = await cards.count();
        
        for (let i = 0; i < cardCount; i++) {
          const card = cards.nth(i);
          const cardBox = await card.boundingBox();
          
          if (cardBox) {
            expect(cardBox.width).toBeLessThanOrEqual(viewport.width - 32); // Account for padding
          }
        }
      });

      // Test text content doesn't overflow
      await test.step('Text content should not overflow', async () => {
        // Check for any horizontally scrollable elements
        const scrollableElements = await page.$$eval('*', elements => {
          return elements.filter(el => {
            const style = window.getComputedStyle(el);
            return el.scrollWidth > el.clientWidth && 
                   style.overflow !== 'hidden' && 
                   style.overflowX !== 'hidden';
          }).length;
        });
        
        expect(scrollableElements).toBe(0);
      });
    });
  });

  test('should handle extreme small width gracefully', async ({ page }) => {
    await page.setViewportSize({ width: 280, height: 568 });
    await page.goto('http://localhost:3002');

    // Wait for content to load
    await page.waitForSelector('[data-testid="landing-content"]', { timeout: 10000 });

    // Check that content is still functional
    await expect(page.locator('text=Carbon Credits')).toBeVisible();
    await expect(page.locator('text=Select Project')).toBeVisible();
    await expect(page.locator('text=Choose Duration')).toBeVisible();
    await expect(page.locator('text=Complete Purchase')).toBeVisible();

    // Check no horizontal overflow
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);
    
    expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 1);
  });

  test('should handle dropdown interactions on touch devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3002');

    // Wait for content to load
    await page.waitForSelector('[data-testid="landing-content"]', { timeout: 10000 });

    // Test touch interactions with project dropdown
    const projectSelect = page.locator('text=Select Project').locator('..').locator('..').locator('[role="combobox"]');
    
    // Simulate touch interaction
    await projectSelect.tap();
    await page.waitForSelector('[role="listbox"]', { timeout: 5000 });
    
    const dropdown = page.locator('[role="listbox"]');
    await expect(dropdown).toBeVisible();
    
    // Select an option via touch
    const firstOption = dropdown.locator('[role="option"]').first();
    await firstOption.tap();
    
    // Verify selection worked
    await expect(dropdown).not.toBeVisible();
  });
});