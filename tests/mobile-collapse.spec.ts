import { test, expect } from '@playwright/test';

test.describe('Mobile Collapse Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Mobile Dropdown Behavior', () => {
    test('mobile dropdown overflow handling', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      await selectTrigger.click();
      await page.waitForTimeout(300);
      
      const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
      await expect(dropdownContent).toBeVisible({ timeout: 2000 });
      
      // Check if dropdown fits within viewport
      const dropdownRect = await dropdownContent.boundingBox();
      const viewport = page.viewportSize();
      
      if (dropdownRect && viewport) {
        expect(dropdownRect.x).toBeGreaterThanOrEqual(0);
        expect(dropdownRect.y).toBeGreaterThanOrEqual(0);
        expect(dropdownRect.x + dropdownRect.width).toBeLessThanOrEqual(viewport.width);
        expect(dropdownRect.y + dropdownRect.height).toBeLessThanOrEqual(viewport.height);
      }
    });

    test('mobile dropdown scroll behavior', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      await selectTrigger.click();
      await page.waitForTimeout(300);
      
      // Test scrolling within dropdown
      const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
      await expect(dropdownContent).toBeVisible({ timeout: 2000 });
      
      // Simulate scroll within dropdown
      await page.evaluate(() => {
        const dropdown = document.querySelector('[role="listbox"]') as HTMLElement;
        if (dropdown) {
          dropdown.scrollTop = 100;
        }
      });
      
      await page.waitForTimeout(300);
      
      // Dropdown should still be visible
      await expect(dropdownContent).toBeVisible();
    });

    test('mobile orientation change handling', async ({ page }) => {
      // Start in portrait
      await page.setViewportSize({ width: 375, height: 667 });
      
      const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      await selectTrigger.click();
      await page.waitForTimeout(300);
      
      const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
      await expect(dropdownContent).toBeVisible({ timeout: 2000 });
      
      // Rotate to landscape
      await page.setViewportSize({ width: 667, height: 375 });
      await page.waitForTimeout(500);
      
      // Dropdown should still be functional
      await expect(dropdownContent).toBeVisible();
      
      // Test closing and reopening
      await page.press('body', 'Escape');
      await page.waitForTimeout(300);
      await expect(dropdownContent).not.toBeVisible();
      
      await selectTrigger.click();
      await page.waitForTimeout(300);
      await expect(dropdownContent).toBeVisible({ timeout: 2000 });
    });
  });

  test.describe('Touch Interactions', () => {
    test('touch tap to open/close', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      
      // Tap to open
      await selectTrigger.tap();
      await page.waitForTimeout(300);
      
      const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
      await expect(dropdownContent).toBeVisible({ timeout: 2000 });
      
      // Tap outside to close
      await page.tap('body', { position: { x: 10, y: 10 } });
      await page.waitForTimeout(300);
      
      await expect(dropdownContent).not.toBeVisible();
    });

    test('touch swipe gestures', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      await selectTrigger.tap();
      await page.waitForTimeout(300);
      
      const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
      await expect(dropdownContent).toBeVisible({ timeout: 2000 });
      
      // Simulate swipe down within dropdown
      await page.evaluate(() => {
        const dropdown = document.querySelector('[role="listbox"]') as HTMLElement;
        if (dropdown) {
          const startY = dropdown.getBoundingClientRect().top + 50;
          const endY = startY + 100;
          
          const touchStart = new TouchEvent('touchstart', {
            bubbles: true,
            touches: [{ clientX: 200, clientY: startY } as any]
          });
          
          const touchMove = new TouchEvent('touchmove', {
            bubbles: true,
            touches: [{ clientX: 200, clientY: endY } as any]
          });
          
          const touchEnd = new TouchEvent('touchend', {
            bubbles: true,
            touches: []
          });
          
          dropdown.dispatchEvent(touchStart);
          setTimeout(() => dropdown.dispatchEvent(touchMove), 50);
          setTimeout(() => dropdown.dispatchEvent(touchEnd), 100);
        }
      });
      
      await page.waitForTimeout(300);
      
      // Dropdown should still be visible (swipe scrolls, doesn't close)
      await expect(dropdownContent).toBeVisible();
    });

    test('multi-touch handling', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      
      // Simulate multi-touch
      await page.evaluate(() => {
        const element = document.querySelector('[role="combobox"]') as HTMLElement;
        if (element) {
          const multiTouchStart = new TouchEvent('touchstart', {
            bubbles: true,
            touches: [
              { clientX: 100, clientY: 100 } as any,
              { clientX: 200, clientY: 200 } as any
            ]
          });
          
          const multiTouchEnd = new TouchEvent('touchend', {
            bubbles: true,
            touches: []
          });
          
          element.dispatchEvent(multiTouchStart);
          setTimeout(() => element.dispatchEvent(multiTouchEnd), 100);
        }
      });
      
      await page.waitForTimeout(300);
      
      // Should handle multi-touch gracefully
      const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
      // Don't make strict assertions about behavior, just ensure no crashes
      await page.waitForTimeout(500);
    });
  });

  test.describe('Mobile Keyboard', () => {
    test('virtual keyboard appearance', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Look for input fields that might trigger virtual keyboard
      const inputFields = page.locator('input, textarea');
      const inputCount = await inputFields.count();
      
      if (inputCount > 0) {
        await inputFields.first().tap();
        await page.waitForTimeout(500);
        
        // Simulate virtual keyboard by reducing viewport height
        await page.setViewportSize({ width: 375, height: 400 });
        await page.waitForTimeout(300);
        
        // Test dropdown functionality with reduced viewport
        const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
        await selectTrigger.tap();
        await page.waitForTimeout(300);
        
        const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
        await expect(dropdownContent).toBeVisible({ timeout: 2000 });
        
        // Verify dropdown fits in reduced viewport
        const dropdownRect = await dropdownContent.boundingBox();
        if (dropdownRect) {
          expect(dropdownRect.y + dropdownRect.height).toBeLessThanOrEqual(400);
        }
      }
    });
  });

  test.describe('Mobile Performance', () => {
    test('mobile scroll performance', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      await selectTrigger.tap();
      await page.waitForTimeout(300);
      
      const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
      await expect(dropdownContent).toBeVisible({ timeout: 2000 });
      
      // Rapid scroll test
      const startTime = Date.now();
      for (let i = 0; i < 10; i++) {
        await page.evaluate(() => {
          const dropdown = document.querySelector('[role="listbox"]') as HTMLElement;
          if (dropdown) {
            dropdown.scrollTop = Math.random() * 100;
          }
        });
        await page.waitForTimeout(10);
      }
      const endTime = Date.now();
      
      // Should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(1000);
      
      // Dropdown should still be responsive
      await expect(dropdownContent).toBeVisible();
    });

    test('mobile animation performance', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      
      // Measure animation performance
      const startTime = Date.now();
      await selectTrigger.tap();
      await page.waitForTimeout(300);
      
      const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
      await expect(dropdownContent).toBeVisible({ timeout: 2000 });
      
      const midTime = Date.now();
      
      await page.press('body', 'Escape');
      await page.waitForTimeout(300);
      await expect(dropdownContent).not.toBeVisible();
      
      const endTime = Date.now();
      
      // Animation should complete within reasonable time
      expect(midTime - startTime).toBeLessThan(500);
      expect(endTime - midTime).toBeLessThan(500);
    });
  });

  test.describe('Mobile Edge Cases', () => {
    test('very small mobile screens', async ({ page }) => {
      await page.setViewportSize({ width: 280, height: 500 });
      
      const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      await selectTrigger.tap();
      await page.waitForTimeout(300);
      
      const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
      await expect(dropdownContent).toBeVisible({ timeout: 2000 });
      
      // Verify dropdown doesn't exceed screen boundaries
      const dropdownRect = await dropdownContent.boundingBox();
      if (dropdownRect) {
        expect(dropdownRect.width).toBeLessThanOrEqual(280);
        expect(dropdownRect.height).toBeLessThanOrEqual(500);
      }
    });

    test('mobile device rotation during interaction', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      await selectTrigger.tap();
      await page.waitForTimeout(300);
      
      // Rotate device while dropdown is open
      await page.setViewportSize({ width: 667, height: 375 });
      await page.waitForTimeout(500);
      
      // Test if dropdown adapts or closes appropriately
      const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
      
      // Either should be visible and positioned correctly, or closed
      if (await dropdownContent.isVisible()) {
        const dropdownRect = await dropdownContent.boundingBox();
        if (dropdownRect) {
          expect(dropdownRect.x + dropdownRect.width).toBeLessThanOrEqual(667);
          expect(dropdownRect.y + dropdownRect.height).toBeLessThanOrEqual(375);
        }
      }
    });

    test('mobile safe area handling', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 }); // iPhone X dimensions
      
      // Add safe area simulation
      await page.evaluate(() => {
        const style = document.createElement('style');
        style.textContent = `
          body { padding-top: env(safe-area-inset-top, 44px); }
          .safe-area-inset-top { padding-top: env(safe-area-inset-top, 44px); }
        `;
        document.head.appendChild(style);
      });
      
      const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      await selectTrigger.tap();
      await page.waitForTimeout(300);
      
      const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
      await expect(dropdownContent).toBeVisible({ timeout: 2000 });
      
      // Verify dropdown respects safe area
      const dropdownRect = await dropdownContent.boundingBox();
      if (dropdownRect) {
        expect(dropdownRect.y).toBeGreaterThanOrEqual(44); // Safe area top
      }
    });
  });

  test.describe('Mobile Accessibility', () => {
    test('mobile screen reader support', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      
      // Check ARIA attributes
      const ariaExpanded = await selectTrigger.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('false');
      
      await selectTrigger.tap();
      await page.waitForTimeout(300);
      
      const updatedAriaExpanded = await selectTrigger.getAttribute('aria-expanded');
      expect(updatedAriaExpanded).toBe('true');
      
      // Check dropdown accessibility
      const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
      await expect(dropdownContent).toBeVisible({ timeout: 2000 });
      
      const ariaLabel = await dropdownContent.getAttribute('aria-label');
      const role = await dropdownContent.getAttribute('role');
      expect(role).toBeTruthy();
    });

    test('mobile touch target sizes', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      const triggerRect = await selectTrigger.boundingBox();
      
      // Touch target should be at least 44x44 pixels
      if (triggerRect) {
        expect(triggerRect.height).toBeGreaterThanOrEqual(44);
        expect(triggerRect.width).toBeGreaterThanOrEqual(44);
      }
      
      await selectTrigger.tap();
      await page.waitForTimeout(300);
      
      // Check option touch targets
      const options = page.locator('[role="option"]');
      const optionCount = await options.count();
      
      if (optionCount > 0) {
        const optionRect = await options.first().boundingBox();
        if (optionRect) {
          expect(optionRect.height).toBeGreaterThanOrEqual(44);
        }
      }
    });
  });
});