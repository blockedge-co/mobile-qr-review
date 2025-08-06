import { test, expect } from '@playwright/test';

test.describe('Dropdown Collapse Debug Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('debug dropdown state - visual inspection', async ({ page }) => {
    console.log('Starting dropdown debug test...');
    
    // Wait for page to fully load
    await page.waitForTimeout(2000);
    
    // Take initial screenshot
    await page.screenshot({ path: 'debug-initial.png', fullPage: true });
    
    // Find dropdown triggers
    const triggers = await page.locator('select, [role="combobox"], button:has-text("Select")').all();
    console.log(`Found ${triggers.length} potential dropdown triggers`);
    
    for (let i = 0; i < triggers.length; i++) {
      const trigger = triggers[i];
      console.log(`Testing trigger ${i + 1}...`);
      
      try {
        // Check if trigger is visible and clickable
        await expect(trigger).toBeVisible({ timeout: 5000 });
        const rect = await trigger.boundingBox();
        console.log(`Trigger ${i + 1} bounds:`, rect);
        
        // Try to click the trigger
        await trigger.click({ timeout: 5000 });
        await page.waitForTimeout(500);
        
        // Take screenshot after click
        await page.screenshot({ path: `debug-trigger-${i + 1}-opened.png`, fullPage: true });
        
        // Look for opened dropdown content
        const dropdownContent = page.locator('[role="listbox"], [role="option"], .dropdown-menu, [data-state="open"]').first();
        
        if (await dropdownContent.isVisible()) {
          console.log(`Trigger ${i + 1}: Dropdown opened successfully`);
          
          // Test closing
          await page.press('body', 'Escape');
          await page.waitForTimeout(300);
          
          if (await dropdownContent.isVisible()) {
            console.log(`Trigger ${i + 1}: WARNING - Dropdown did not close with Escape`);
            // Try clicking outside
            await page.click('body', { position: { x: 10, y: 10 } });
            await page.waitForTimeout(300);
            
            if (await dropdownContent.isVisible()) {
              console.log(`Trigger ${i + 1}: ERROR - Dropdown not closing properly`);
            }
          } else {
            console.log(`Trigger ${i + 1}: Dropdown closed successfully`);
          }
        } else {
          console.log(`Trigger ${i + 1}: No dropdown content found after click`);
        }
        
        // Take screenshot after attempted close
        await page.screenshot({ path: `debug-trigger-${i + 1}-closed.png`, fullPage: true });
        
      } catch (error) {
        console.log(`Trigger ${i + 1} error:`, error.message);
      }
    }
  });

  test('debug specific project selection dropdown', async ({ page }) => {
    console.log('Debugging project selection dropdown...');
    
    // Look specifically for project selection
    const projectSection = page.locator('h2:has-text("Select Project")').first();
    await expect(projectSection).toBeVisible({ timeout: 10000 });
    
    // Find the select trigger near the project section
    const selectTrigger = page.locator('div:has(h2:has-text("Select Project")) >> [role="combobox"]').first();
    
    if (await selectTrigger.count() === 0) {
      console.log('No combobox found, trying select element...');
      const selectElement = page.locator('div:has(h2:has-text("Select Project")) >> select').first();
      
      if (await selectElement.count() > 0) {
        console.log('Found select element');
        await selectElement.click();
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'debug-select-element.png', fullPage: true });
      } else {
        console.log('No select elements found');
        await page.screenshot({ path: 'debug-no-selects.png', fullPage: true });
      }
    } else {
      console.log('Found combobox, testing...');
      
      // Get current state
      const ariaExpanded = await selectTrigger.getAttribute('aria-expanded');
      console.log('Initial aria-expanded:', ariaExpanded);
      
      // Click to open
      await selectTrigger.click();
      await page.waitForTimeout(500);
      
      // Check new state
      const newAriaExpanded = await selectTrigger.getAttribute('aria-expanded');
      console.log('After click aria-expanded:', newAriaExpanded);
      
      // Look for content
      const content = page.locator('[role="listbox"]').first();
      const isContentVisible = await content.isVisible();
      console.log('Content visible:', isContentVisible);
      
      if (isContentVisible) {
        const contentRect = await content.boundingBox();
        console.log('Content bounds:', contentRect);
        
        // Check for options
        const options = await page.locator('[role="option"]').all();
        console.log(`Found ${options.length} options`);
        
        if (options.length > 0) {
          console.log('First option text:', await options[0].textContent());
        }
      }
      
      await page.screenshot({ path: 'debug-project-dropdown.png', fullPage: true });
    }
  });

  test('debug combined selection dropdown', async ({ page }) => {
    console.log('Debugging combined selection dropdown...');
    
    // Check if there's a combined selection component
    const combinedSection = page.locator('h2:has-text("Select Project & Duration"), h2:contains("Combined")').first();
    
    if (await combinedSection.count() > 0) {
      console.log('Found combined selection section');
      await expect(combinedSection).toBeVisible();
      
      const selectTrigger = page.locator('div:has(h2:contains("Combined")) >> [role="combobox"]').first();
      
      if (await selectTrigger.count() > 0) {
        await selectTrigger.click();
        await page.waitForTimeout(500);
        
        const content = page.locator('[role="listbox"]').first();
        const isVisible = await content.isVisible();
        console.log('Combined dropdown visible:', isVisible);
        
        await page.screenshot({ path: 'debug-combined-dropdown.png', fullPage: true });
      }
    } else {
      console.log('No combined selection found');
    }
  });

  test('debug DOM structure and state', async ({ page }) => {
    console.log('Debugging DOM structure...');
    
    // Get all form controls
    const formControls = await page.evaluate(() => {
      const controls = document.querySelectorAll('select, [role="combobox"], button');
      return Array.from(controls).map((el, index) => ({
        index,
        tagName: el.tagName,
        role: el.getAttribute('role'),
        ariaExpanded: el.getAttribute('aria-expanded'),
        className: el.className,
        textContent: el.textContent?.substring(0, 50),
        id: el.id,
        dataset: el.dataset
      }));
    });
    
    console.log('Form controls found:', JSON.stringify(formControls, null, 2));
    
    // Get all elements with data-state
    const stateElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('[data-state]');
      return Array.from(elements).map((el) => ({
        tagName: el.tagName,
        dataState: el.getAttribute('data-state'),
        className: el.className,
        role: el.getAttribute('role')
      }));
    });
    
    console.log('Elements with data-state:', JSON.stringify(stateElements, null, 2));
    
    // Check for any console errors
    const errors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Trigger an interaction to see if errors occur
    const anyTrigger = page.locator('select, [role="combobox"]').first();
    if (await anyTrigger.count() > 0) {
      await anyTrigger.click();
      await page.waitForTimeout(1000);
    }
    
    console.log('Console errors:', errors);
  });

  test('debug rapid interaction issues', async ({ page }) => {
    console.log('Testing rapid interactions...');
    
    const selectTrigger = page.locator('[role="combobox"]').first();
    
    if (await selectTrigger.count() > 0) {
      console.log('Found combobox for rapid testing');
      
      // Test rapid clicks
      for (let i = 0; i < 5; i++) {
        try {
          await selectTrigger.click({ timeout: 1000 });
          await page.waitForTimeout(100);
          console.log(`Rapid click ${i + 1} completed`);
        } catch (error) {
          console.log(`Rapid click ${i + 1} failed:`, error.message);
        }
      }
      
      // Check final state
      const finalState = await selectTrigger.getAttribute('aria-expanded');
      console.log('Final aria-expanded after rapid clicks:', finalState);
      
      await page.screenshot({ path: 'debug-rapid-clicks.png', fullPage: true });
    }
  });

  test('debug mobile viewport issues', async ({ page }) => {
    console.log('Testing mobile viewport...');
    
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    const selectTrigger = page.locator('[role="combobox"]').first();
    
    if (await selectTrigger.count() > 0) {
      console.log('Testing mobile dropdown');
      
      await selectTrigger.click();
      await page.waitForTimeout(500);
      
      const content = page.locator('[role="listbox"]').first();
      if (await content.isVisible()) {
        const rect = await content.boundingBox();
        console.log('Mobile dropdown bounds:', rect);
        
        if (rect) {
          console.log('Dropdown exceeds viewport width:', rect.x + rect.width > 375);
          console.log('Dropdown exceeds viewport height:', rect.y + rect.height > 667);
        }
      }
      
      await page.screenshot({ path: 'debug-mobile-dropdown.png', fullPage: true });
    }
  });
});