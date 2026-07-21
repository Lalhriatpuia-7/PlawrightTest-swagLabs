import {test, expect} from '@playwright/test';
import dotenv from 'dotenv';
const authData = require('../Auth/authData.json');

dotenv.config();

const baseUrl = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

test.describe('Dropdown Items', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(baseUrl);
        await page.locator('[data-test="username"]').fill(authData.validUsers.usernames.standard_user);
        await page.locator('[data-test="password"]').fill(authData.validUsers.passwords.password);
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(`${baseUrl}/inventory.html`);
    });

    test('should display correct items in the dropdown', async ({ page }) => {
        // Open the dropdown menu
        // await page.locator('[data-test="open-menu"]').click();

        await page.getByText('Open Menu').click();

        // Verify the items in the dropdown
        
        const dropdownItems = page.getByRole('navigation').getByRole('link');
        await expect(dropdownItems).toHaveCount(4);
      

        await expect(dropdownItems.nth(0)).toHaveText('All Items');
        await expect(dropdownItems.nth(1)).toHaveText('About');
        await expect(dropdownItems.nth(2)).toHaveText('Logout');
    });

    test('should navigate to the correct page when an item is clicked', async ({ page }) => {
        // Open the dropdown menu
        await page.getByText('Open Menu').click();

        // Click on the "About" item
        // await page.locator('[data-test="dropdown-item"]').nth(1).click();
        const dropdownItems = page.getByRole('navigation').getByRole('link');

        await dropdownItems.nth(0).click();
        await expect(page).toHaveURL(`${baseUrl}/inventory.html`);
        
        await dropdownItems.nth(1).click();
        await expect(page).toHaveURL('https://saucelabs.com/');

        await page.goBack();
        await expect(page).toHaveURL(`${baseUrl}/inventory.html`);

        await page.getByText('Open Menu').click();
        await dropdownItems.nth(2).click();
        await expect(page).toHaveURL(`${baseUrl}/`);
        await expect(page.locator('[data-test="login-button"]')).toBeVisible();
        await expect(page.locator('[data-test="username"]')).toBeVisible();       

    });
    
    test('test reset app state', async ({ page }) => {

        await page.locator('[data-test = "add-to-cart-sauce-labs-backpack"]')?.click();
        await page.locator('[data-test = "add-to-cart-sauce-labs-bike-light"]')?.click();

        await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
        await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toHaveText('Remove');
        // Open the dropdown menu
        await page.getByText('Open Menu').click();

        // Click on the "Reset App State" item
        const dropdownItems = page.getByRole('navigation').getByRole('link');
        await dropdownItems.nth(3).click();
        await page.reload();
        await expect(page).toHaveURL(`${baseUrl}/inventory.html`);
        await expect(page.locator('.shopping_cart_link')).toBeVisible();
        await expect(page.locator('[data-test="shopping_cart_badge"]')).not.toBeVisible();
        await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
        await expect(page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]')).toBeVisible();
        await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).not.toBeVisible();
        await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).not.toBeVisible();


    });
    
    });
    
