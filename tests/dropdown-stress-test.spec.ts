import { test, expect } from '@playwright/test';

test.describe('Dropdown Stress Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('rapid open/close cycles', async ({ page }) => {
    const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
    
    // Rapid open/close cycles
    for (let i = 0; i < 20; i++) {
      await selectTrigger.click();
      await page.waitForTimeout(10);
      await page.press('body', 'Escape');
      await page.waitForTimeout(10);
    }
    
    // Verify component is still functional
    await selectTrigger.click();
    await page.waitForTimeout(300);
    const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
    await expect(dropdownContent).toBeVisible({ timeout: 2000 });
  });

  test('concurrent hover and click interactions', async ({ page }) => {
    const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
    
    // Simulate hover + click + key events simultaneously
    await Promise.all([
      selectTrigger.hover(),
      selectTrigger.click(),
      page.keyboard.press('ArrowDown'),
    ]);
    
    await page.waitForTimeout(300);
    
    // Verify no errors and component still works
    const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
    await expect(dropdownContent).toBeVisible({ timeout: 2000 });
  });

  test('memory leak detection', async ({ page }) => {
    const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
    
    // Capture initial memory usage
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory ? (performance as any).memory.usedJSHeapSize : 0;
    });
    
    // Perform many operations
    for (let i = 0; i < 50; i++) {
      await selectTrigger.click();
      await page.waitForTimeout(50);
      await page.press('body', 'Escape');
      await page.waitForTimeout(50);
    }
    
    // Force garbage collection if available
    await page.evaluate(() => {
      if ((window as any).gc) {
        (window as any).gc();
      }
    });
    
    // Check memory usage
    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory ? (performance as any).memory.usedJSHeapSize : 0;
    });
    
    // Memory should not grow excessively (allow for some growth)
    if (initialMemory > 0 && finalMemory > 0) {
      expect(finalMemory - initialMemory).toBeLessThan(10 * 1024 * 1024); // 10MB limit
    }
  });

  test('event listener cleanup', async ({ page }) => {
    const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
    
    // Count initial event listeners
    const initialListeners = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let count = 0;
      elements.forEach(el => {
        const events = (el as any)._events || {};
        count += Object.keys(events).length;
      });
      return count;
    });
    
    // Perform multiple operations
    for (let i = 0; i < 20; i++) {
      await selectTrigger.click();
      await page.waitForTimeout(100);
      await page.press('body', 'Escape');
      await page.waitForTimeout(100);
    }
    
    // Count final event listeners
    const finalListeners = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let count = 0;
      elements.forEach(el => {
        const events = (el as any)._events || {};
        count += Object.keys(events).length;
      });
      return count;
    });
    
    // Event listeners should not accumulate excessively
    expect(finalListeners - initialListeners).toBeLessThan(100);
  });

  test('portal cleanup', async ({ page }) => {
    const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
    
    // Count initial portal elements
    const initialPortals = await page.evaluate(() => {
      return document.querySelectorAll('[data-radix-portal]').length;
    });
    
    // Create and destroy portals
    for (let i = 0; i < 10; i++) {
      await selectTrigger.click();
      await page.waitForTimeout(200);
      await page.press('body', 'Escape');
      await page.waitForTimeout(200);
    }
    
    // Count final portal elements
    const finalPortals = await page.evaluate(() => {
      return document.querySelectorAll('[data-radix-portal]').length;
    });
    
    // Portals should be cleaned up
    expect(finalPortals).toBeLessThanOrEqual(initialPortals + 1);
  });

  test('animation interruption', async ({ page }) => {
    const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
    
    // Interrupt animations by rapid state changes
    await selectTrigger.click();
    await page.waitForTimeout(50); // Don't wait for animation to complete
    await page.press('body', 'Escape');
    await page.waitForTimeout(50);
    await selectTrigger.click();
    await page.waitForTimeout(50);
    await page.press('body', 'Escape');
    
    // Verify component still works after animation interruption
    await page.waitForTimeout(500);
    await selectTrigger.click();
    await page.waitForTimeout(300);
    const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
    await expect(dropdownContent).toBeVisible({ timeout: 2000 });
  });

  test('DOM mutation during interactions', async ({ page }) => {
    const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
    
    // Open dropdown
    await selectTrigger.click();
    await page.waitForTimeout(300);
    
    // Mutate DOM while dropdown is open
    await page.evaluate(() => {
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.top = '0';
      div.style.left = '0';
      div.style.width = '100px';
      div.style.height = '100px';
      div.style.backgroundColor = 'red';
      document.body.appendChild(div);
    });
    
    // Verify dropdown still works
    const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
    await expect(dropdownContent).toBeVisible({ timeout: 2000 });
    
    // Close dropdown
    await page.press('body', 'Escape');
    await page.waitForTimeout(300);
    await expect(dropdownContent).not.toBeVisible();
  });

  test('z-index conflicts', async ({ page }) => {
    const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
    
    // Create high z-index overlay
    await page.evaluate(() => {
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0,0,0,0.1)';
      overlay.style.zIndex = '9999';
      overlay.style.pointerEvents = 'none';
      overlay.id = 'test-overlay';
      document.body.appendChild(overlay);
    });
    
    // Open dropdown
    await selectTrigger.click();
    await page.waitForTimeout(300);
    
    // Verify dropdown is visible above overlay
    const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
    await expect(dropdownContent).toBeVisible({ timeout: 2000 });
    
    // Check z-index
    const dropdownZIndex = await page.evaluate(() => {
      const dropdown = document.querySelector('[role="listbox"]');
      return dropdown ? window.getComputedStyle(dropdown).zIndex : '0';
    });
    
    expect(parseInt(dropdownZIndex)).toBeGreaterThan(9999);
    
    // Cleanup
    await page.evaluate(() => {
      const overlay = document.getElementById('test-overlay');
      if (overlay) overlay.remove();
    });
  });

  test('keyboard navigation stress', async ({ page }) => {
    const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
    
    // Open dropdown
    await selectTrigger.click();
    await page.waitForTimeout(300);
    
    // Rapid keyboard navigation
    const keys = ['ArrowDown', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowUp', 'Home', 'End', 'PageDown', 'PageUp'];
    
    for (let i = 0; i < 20; i++) {
      const key = keys[i % keys.length];
      await page.keyboard.press(key);
      await page.waitForTimeout(20);
    }
    
    // Verify dropdown is still functional
    const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
    await expect(dropdownContent).toBeVisible({ timeout: 2000 });
    
    // Test Enter key
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    
    // Should close dropdown
    await expect(dropdownContent).not.toBeVisible();
  });

  test('touch events interference', async ({ page }) => {
    // Simulate mobile device
    await page.setViewportSize({ width: 375, height: 667 });
    
    const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
    
    // Simulate touch events
    await page.evaluate(() => {
      const element = document.querySelector('[role="combobox"]') as HTMLElement;
      if (element) {
        const touchStart = new TouchEvent('touchstart', { bubbles: true });
        const touchEnd = new TouchEvent('touchend', { bubbles: true });
        element.dispatchEvent(touchStart);
        setTimeout(() => element.dispatchEvent(touchEnd), 100);
      }
    });
    
    await page.waitForTimeout(300);
    
    // Verify dropdown opens
    const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
    await expect(dropdownContent).toBeVisible({ timeout: 2000 });
    
    // Simulate touch outside to close
    await page.evaluate(() => {
      const touchStart = new TouchEvent('touchstart', { bubbles: true });
      const touchEnd = new TouchEvent('touchend', { bubbles: true });
      document.body.dispatchEvent(touchStart);
      setTimeout(() => document.body.dispatchEvent(touchEnd), 100);
    });
    
    await page.waitForTimeout(300);
    await expect(dropdownContent).not.toBeVisible();
  });
});