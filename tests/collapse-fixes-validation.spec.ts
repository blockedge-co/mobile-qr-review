import { test, expect } from '@playwright/test';

test.describe('Collapse Fixes Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('dropdown opens and closes properly', async ({ page }) => {
    console.log('Testing dropdown open/close functionality...');
    
    const selectTrigger = page.locator('[role="combobox"]').first();
    await expect(selectTrigger).toBeVisible({ timeout: 10000 });
    
    // Verify initial closed state
    const initialExpanded = await selectTrigger.getAttribute('aria-expanded');
    expect(initialExpanded).toBe('false');
    
    // Open dropdown
    await selectTrigger.click();
    await page.waitForTimeout(300);
    
    // Verify opened state
    const openedExpanded = await selectTrigger.getAttribute('aria-expanded');
    expect(openedExpanded).toBe('true');
    
    // Verify content is visible
    const content = page.locator('[role="listbox"]').first();
    await expect(content).toBeVisible({ timeout: 2000 });
    
    // Close with Escape key
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    
    // Verify closed state
    const closedExpanded = await selectTrigger.getAttribute('aria-expanded');
    expect(closedExpanded).toBe('false');
    await expect(content).not.toBeVisible();
    
    console.log('✅ Dropdown open/close working correctly');
  });

  test('dropdown closes when clicking outside', async ({ page }) => {
    console.log('Testing outside click behavior...');
    
    const selectTrigger = page.locator('[role="combobox"]').first();
    await selectTrigger.click();
    await page.waitForTimeout(300);
    
    // Verify dropdown is open
    const content = page.locator('[role="listbox"]').first();
    await expect(content).toBeVisible();
    
    // Click outside
    await page.click('body', { position: { x: 10, y: 10 } });
    await page.waitForTimeout(300);
    
    // Verify dropdown closed
    await expect(content).not.toBeVisible();
    const expanded = await selectTrigger.getAttribute('aria-expanded');
    expect(expanded).toBe('false');
    
    console.log('✅ Outside click closing working correctly');
  });

  test('rapid clicking does not break dropdown', async ({ page }) => {
    console.log('Testing rapid click handling...');
    
    const selectTrigger = page.locator('[role="combobox"]').first();
    
    // Perform rapid clicks
    for (let i = 0; i < 10; i++) {
      await selectTrigger.click({ timeout: 1000 });
      await page.waitForTimeout(50);
    }
    
    // Wait for any animations to settle
    await page.waitForTimeout(500);
    
    // Verify dropdown is still functional
    await selectTrigger.click();
    await page.waitForTimeout(300);
    
    const content = page.locator('[role="listbox"]').first();
    await expect(content).toBeVisible({ timeout: 2000 });
    
    // Close properly
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await expect(content).not.toBeVisible();
    
    console.log('✅ Rapid clicking handled correctly');
  });

  test('dropdown positioning works on mobile', async ({ page }) => {
    console.log('Testing mobile positioning...');
    
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    const selectTrigger = page.locator('[role="combobox"]').first();
    await selectTrigger.click();
    await page.waitForTimeout(300);
    
    const content = page.locator('[role="listbox"]').first();
    await expect(content).toBeVisible({ timeout: 2000 });
    
    // Verify content fits within viewport
    const contentRect = await content.boundingBox();
    expect(contentRect).toBeTruthy();
    
    if (contentRect) {
      expect(contentRect.x).toBeGreaterThanOrEqual(0);
      expect(contentRect.y).toBeGreaterThanOrEqual(0);
      expect(contentRect.x + contentRect.width).toBeLessThanOrEqual(375);
      expect(contentRect.y + contentRect.height).toBeLessThanOrEqual(667);
    }
    
    console.log('✅ Mobile positioning working correctly');
  });

  test('keyboard navigation works properly', async ({ page }) => {
    console.log('Testing keyboard navigation...');
    
    const selectTrigger = page.locator('[role="combobox"]').first();
    await selectTrigger.focus();
    
    // Open with Enter key
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    
    const content = page.locator('[role="listbox"]').first();
    await expect(content).toBeVisible({ timeout: 2000 });
    
    // Navigate with arrow keys
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(100);
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(100);
    
    // Select with Enter
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    
    // Verify dropdown closed
    await expect(content).not.toBeVisible();
    
    console.log('✅ Keyboard navigation working correctly');
  });

  test('z-index conflicts are resolved', async ({ page }) => {
    console.log('Testing z-index handling...');
    
    // Create a high z-index overlay
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
      overlay.style.zIndex = '9000';
      overlay.style.pointerEvents = 'none';
      overlay.id = 'test-overlay';
      document.body.appendChild(overlay);
    });
    
    const selectTrigger = page.locator('[role="combobox"]').first();
    await selectTrigger.click();
    await page.waitForTimeout(300);
    
    const content = page.locator('[role="listbox"]').first();
    await expect(content).toBeVisible({ timeout: 2000 });
    
    // Check z-index of dropdown
    const zIndex = await page.evaluate(() => {
      const dropdown = document.querySelector('[role="listbox"]');
      return dropdown ? window.getComputedStyle(dropdown).zIndex : '0';
    });
    
    expect(parseInt(zIndex)).toBeGreaterThan(9000);
    
    // Cleanup overlay
    await page.evaluate(() => {
      const overlay = document.getElementById('test-overlay');
      if (overlay) overlay.remove();
    });
    
    console.log('✅ Z-index conflicts resolved');
  });

  test('pointer events work correctly', async ({ page }) => {
    console.log('Testing pointer events...');
    
    const selectTrigger = page.locator('[role="combobox"]').first();
    await selectTrigger.click();
    await page.waitForTimeout(300);
    
    const content = page.locator('[role="listbox"]').first();
    await expect(content).toBeVisible({ timeout: 2000 });
    
    // Try to click on dropdown content
    const options = page.locator('[role="option"]');
    const optionCount = await options.count();
    
    if (optionCount > 0) {
      // Click on first option
      await options.first().click();
      await page.waitForTimeout(300);
      
      // Dropdown should close after selection
      await expect(content).not.toBeVisible();
      
      // Verify selection was made
      const expanded = await selectTrigger.getAttribute('aria-expanded');
      expect(expanded).toBe('false');
    }
    
    console.log('✅ Pointer events working correctly');
  });

  test('animation performance is smooth', async ({ page }) => {
    console.log('Testing animation performance...');
    
    const selectTrigger = page.locator('[role="combobox"]').first();
    
    // Measure animation timing
    const startTime = Date.now();
    
    await selectTrigger.click();
    await page.waitForTimeout(300);
    
    const content = page.locator('[role="listbox"]').first();
    await expect(content).toBeVisible({ timeout: 2000 });
    
    const midTime = Date.now();
    
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await expect(content).not.toBeVisible();
    
    const endTime = Date.now();
    
    // Animations should complete within reasonable time
    expect(midTime - startTime).toBeLessThan(500);
    expect(endTime - midTime).toBeLessThan(500);
    
    console.log('✅ Animation performance is good');
  });

  test('memory leaks are prevented', async ({ page }) => {
    console.log('Testing memory leak prevention...');
    
    const selectTrigger = page.locator('[role="combobox"]').first();
    
    // Count initial portals
    const initialPortals = await page.evaluate(() => {
      return document.querySelectorAll('[data-radix-portal]').length;
    });
    
    // Open and close dropdown multiple times
    for (let i = 0; i < 10; i++) {
      await selectTrigger.click();
      await page.waitForTimeout(200);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);
    }
    
    // Wait for cleanup
    await page.waitForTimeout(1000);
    
    // Count final portals
    const finalPortals = await page.evaluate(() => {
      return document.querySelectorAll('[data-radix-portal]').length;
    });
    
    // Should not accumulate portals
    expect(finalPortals).toBeLessThanOrEqual(initialPortals + 2);
    
    console.log('✅ Memory leaks prevented');
  });

  test('state management is consistent', async ({ page }) => {
    console.log('Testing state management consistency...');
    
    const selectTrigger = page.locator('[role="combobox"]').first();
    
    // Test state transitions
    for (let i = 0; i < 5; i++) {
      // Open
      await selectTrigger.click();
      await page.waitForTimeout(200);
      
      const openExpanded = await selectTrigger.getAttribute('aria-expanded');
      expect(openExpanded).toBe('true');
      
      const openDataState = await selectTrigger.getAttribute('data-state');
      expect(openDataState).toBe('open');
      
      // Close
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);
      
      const closedExpanded = await selectTrigger.getAttribute('aria-expanded');
      expect(closedExpanded).toBe('false');
      
      const closedDataState = await selectTrigger.getAttribute('data-state');
      expect(closedDataState).toBe('closed');
    }
    
    console.log('✅ State management is consistent');
  });

  test('error recovery works', async ({ page }) => {
    console.log('Testing error recovery...');
    
    const selectTrigger = page.locator('[role="combobox"]').first();
    
    // Simulate error condition by manipulating DOM
    await page.evaluate(() => {
      const trigger = document.querySelector('[role="combobox"]');
      if (trigger) {
        // Force invalid state
        trigger.setAttribute('aria-expanded', 'invalid');
        trigger.setAttribute('data-state', 'error');
      }
    });
    
    await page.waitForTimeout(100);
    
    // Try to interact with dropdown
    await selectTrigger.click();
    await page.waitForTimeout(300);
    
    // Should recover and work normally
    const recovered = await selectTrigger.getAttribute('aria-expanded');
    expect(recovered).toBe('true');
    
    const content = page.locator('[role="listbox"]').first();
    await expect(content).toBeVisible({ timeout: 2000 });
    
    // Should close normally
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await expect(content).not.toBeVisible();
    
    console.log('✅ Error recovery working correctly');
  });
});