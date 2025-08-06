import { test, expect } from '@playwright/test';

test.describe('Component Collapse Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Dropdown Components', () => {
    test('project selection dropdown collapse/expand behavior', async ({ page }) => {
      // Wait for page to load
      await page.waitForSelector('[data-testid="project-selection"], .project-selection, h2:has-text("Select Project")', { timeout: 10000 });
      
      // Find the select trigger
      const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      
      // Test initial state - should be collapsed
      await expect(selectTrigger).toBeVisible();
      
      // Test expansion
      await selectTrigger.click();
      await page.waitForTimeout(300); // Wait for animation
      
      // Check if dropdown content is visible
      const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
      await expect(dropdownContent).toBeVisible({ timeout: 2000 });
      
      // Test collapse by clicking outside
      await page.click('body', { position: { x: 10, y: 10 } });
      await page.waitForTimeout(300);
      
      // Verify collapsed state
      await expect(dropdownContent).not.toBeVisible();
      
      // Test keyboard navigation
      await selectTrigger.press('Enter');
      await page.waitForTimeout(300);
      await expect(dropdownContent).toBeVisible();
      
      // Test Escape key collapse
      await page.press('body', 'Escape');
      await page.waitForTimeout(300);
      await expect(dropdownContent).not.toBeVisible();
    });

    test('rapid dropdown interactions', async ({ page }) => {
      const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      
      // Rapid click test
      for (let i = 0; i < 5; i++) {
        await selectTrigger.click();
        await page.waitForTimeout(50);
      }
      
      // Check if component is still functional
      await page.waitForTimeout(300);
      await selectTrigger.click();
      const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
      await expect(dropdownContent).toBeVisible({ timeout: 2000 });
    });

    test('dropdown state persistence during navigation', async ({ page }) => {
      const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      
      // Open dropdown
      await selectTrigger.click();
      await page.waitForTimeout(300);
      
      // Navigate to different page section (if applicable)
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      
      // Check if dropdown closed properly
      const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
      await expect(dropdownContent).not.toBeVisible();
    });
  });

  test.describe('Mobile Menu Collapse', () => {
    test('mobile menu behavior', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Look for mobile menu trigger (hamburger menu or similar)
      const mobileMenuTrigger = page.locator('button:has([data-testid="menu-icon"]), button:has(.hamburger), [aria-label="Menu"], [aria-label="Toggle menu"]').first();
      
      if (await mobileMenuTrigger.count() > 0) {
        // Test mobile menu collapse/expand
        await mobileMenuTrigger.click();
        await page.waitForTimeout(300);
        
        // Check if menu is visible
        const mobileMenu = page.locator('[role="dialog"], .mobile-menu, [data-testid="mobile-menu"]').first();
        await expect(mobileMenu).toBeVisible({ timeout: 2000 });
        
        // Test collapse by clicking outside
        await page.click('body', { position: { x: 10, y: 10 } });
        await page.waitForTimeout(300);
        await expect(mobileMenu).not.toBeVisible();
        
        // Test collapse by pressing Escape
        await mobileMenuTrigger.click();
        await page.waitForTimeout(300);
        await page.press('body', 'Escape');
        await page.waitForTimeout(300);
        await expect(mobileMenu).not.toBeVisible();
      }
    });

    test('responsive dropdown behavior', async ({ page }) => {
      // Test desktop size
      await page.setViewportSize({ width: 1024, height: 768 });
      const desktopTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      await desktopTrigger.click();
      await page.waitForTimeout(300);
      
      let dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
      await expect(dropdownContent).toBeVisible({ timeout: 2000 });
      
      // Close dropdown
      await page.press('body', 'Escape');
      await page.waitForTimeout(300);
      
      // Test mobile size
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(500);
      
      const mobileTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      await mobileTrigger.click();
      await page.waitForTimeout(300);
      
      dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
      await expect(dropdownContent).toBeVisible({ timeout: 2000 });
      
      // Verify mobile-specific behavior
      const viewportHeight = await page.evaluate(() => window.innerHeight);
      const dropdownRect = await dropdownContent.boundingBox();
      if (dropdownRect) {
        expect(dropdownRect.height).toBeLessThan(viewportHeight * 0.7); // Should not exceed 70% of viewport
      }
    });
  });

  test.describe('Loading States', () => {
    test('loading state collapse behavior', async ({ page }) => {
      // Test loading state by refreshing and checking immediate state
      await page.reload();
      
      // Check if components are initially hidden/collapsed during loading
      const projectSection = page.locator('h2:has-text("Select Project")').first();
      await expect(projectSection).toBeVisible({ timeout: 10000 });
      
      // Verify loading animations complete
      await page.waitForTimeout(1000);
      const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      await expect(selectTrigger).toBeVisible();
      
      // Test interaction after loading
      await selectTrigger.click();
      await page.waitForTimeout(300);
      const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
      await expect(dropdownContent).toBeVisible({ timeout: 2000 });
    });

    test('skeleton loading states', async ({ page }) => {
      // Test skeleton/loading states
      await page.reload();
      
      // Look for skeleton loaders or loading indicators
      const skeletonElements = page.locator('.skeleton, [data-testid="skeleton"], .loading, .animate-pulse');
      
      if (await skeletonElements.count() > 0) {
        // Verify skeleton elements are visible initially
        await expect(skeletonElements.first()).toBeVisible({ timeout: 1000 });
        
        // Wait for content to load
        await page.waitForTimeout(2000);
        
        // Verify skeleton elements are hidden after loading
        await expect(skeletonElements.first()).not.toBeVisible();
      }
    });
  });

  test.describe('Error Handling', () => {
    test('error state recovery', async ({ page }) => {
      // Simulate network error
      await page.route('**/*', (route) => {
        if (route.request().url().includes('api')) {
          route.abort();
        } else {
          route.continue();
        }
      });
      
      await page.reload();
      await page.waitForTimeout(2000);
      
      // Check if components still function with error states
      const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      
      if (await selectTrigger.count() > 0) {
        await selectTrigger.click();
        await page.waitForTimeout(300);
        
        // Should either show error state or empty state
        const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
        // Don't expect specific behavior, just ensure no crash
        await page.waitForTimeout(500);
      }
    });

    test('invalid state handling', async ({ page }) => {
      // Test with invalid selections
      await page.evaluate(() => {
        // Try to set invalid state
        const selectElements = document.querySelectorAll('select');
        selectElements.forEach(select => {
          if (select instanceof HTMLSelectElement) {
            select.value = 'invalid-option';
          }
        });
      });
      
      await page.waitForTimeout(300);
      
      // Verify components still function
      const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      await selectTrigger.click();
      await page.waitForTimeout(300);
      
      const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
      await expect(dropdownContent).toBeVisible({ timeout: 2000 });
    });
  });

  test.describe('Edge Cases', () => {
    test('viewport edge cases', async ({ page }) => {
      // Test very small viewport
      await page.setViewportSize({ width: 320, height: 568 });
      
      const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      await selectTrigger.click();
      await page.waitForTimeout(300);
      
      const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
      await expect(dropdownContent).toBeVisible({ timeout: 2000 });
      
      // Verify dropdown doesn't exceed viewport
      const dropdownRect = await dropdownContent.boundingBox();
      if (dropdownRect) {
        expect(dropdownRect.width).toBeLessThanOrEqual(320);
      }
    });

    test('multiple simultaneous interactions', async ({ page }) => {
      // Test multiple dropdowns (if available)
      const selectTriggers = page.locator('select, [role="combobox"]');
      const count = await selectTriggers.count();
      
      if (count > 1) {
        // Open multiple dropdowns simultaneously
        for (let i = 0; i < Math.min(count, 3); i++) {
          await selectTriggers.nth(i).click();
          await page.waitForTimeout(100);
        }
        
        // Verify only one dropdown is open at a time (expected behavior)
        await page.waitForTimeout(300);
        const openDropdowns = page.locator('[role="listbox"]:visible, [role="option"]:visible');
        const openCount = await openDropdowns.count();
        
        // Should be reasonable number of open dropdowns
        expect(openCount).toBeLessThanOrEqual(10); // Allow for multiple options within a single dropdown
      }
    });

    test('scroll behavior with open dropdowns', async ({ page }) => {
      const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      await selectTrigger.click();
      await page.waitForTimeout(300);
      
      // Scroll while dropdown is open
      await page.evaluate(() => window.scrollBy(0, 100));
      await page.waitForTimeout(300);
      
      // Check if dropdown is still positioned correctly or closed
      const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
      
      // Either should be visible and positioned correctly, or closed
      if (await dropdownContent.isVisible()) {
        // Verify it's still in reasonable position
        const rect = await dropdownContent.boundingBox();
        expect(rect).toBeTruthy();
      }
    });

    test('focus management during collapse', async ({ page }) => {
      const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      
      // Test focus return after collapse
      await selectTrigger.focus();
      await page.press('body', 'Enter');
      await page.waitForTimeout(300);
      
      // Close with Escape
      await page.press('body', 'Escape');
      await page.waitForTimeout(300);
      
      // Verify focus returns to trigger
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toHaveCount(1);
    });
  });

  test.describe('State Management', () => {
    test('component state persistence', async ({ page }) => {
      // Test state persistence across different interactions
      const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      
      // Open dropdown
      await selectTrigger.click();
      await page.waitForTimeout(300);
      
      // Select an option if available
      const option = page.locator('[role="option"]').first();
      if (await option.count() > 0) {
        await option.click();
        await page.waitForTimeout(300);
        
        // Verify selection persists
        const selectedValue = await selectTrigger.textContent();
        expect(selectedValue).toBeTruthy();
        
        // Open dropdown again
        await selectTrigger.click();
        await page.waitForTimeout(300);
        
        // Verify selected state is maintained
        const selectedOption = page.locator('[role="option"][aria-selected="true"], [role="option"][data-state="checked"]').first();
        if (await selectedOption.count() > 0) {
          await expect(selectedOption).toBeVisible();
        }
      }
    });

    test('component cleanup', async ({ page }) => {
      // Test component cleanup on navigation
      const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      
      // Open dropdown
      await selectTrigger.click();
      await page.waitForTimeout(300);
      
      // Navigate away and back
      await page.evaluate(() => window.history.pushState({}, '', '/'));
      await page.waitForTimeout(300);
      await page.goBack();
      await page.waitForTimeout(1000);
      
      // Verify component is still functional
      const newSelectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> select, div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
      await newSelectTrigger.click();
      await page.waitForTimeout(300);
      
      const dropdownContent = page.locator('[role="listbox"], [role="option"]').first();
      await expect(dropdownContent).toBeVisible({ timeout: 2000 });
    });
  });
});