import {test, expect} from '@playwright/test';
import dotenv from 'dotenv';
import authData from '../Auth/authData.json';

dotenv.config();

const baseUrl = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

test.describe('Logout User Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(baseUrl);
        await expect(page).toHaveTitle(/Swag Labs/);
        // Login before each test
        await page.getByRole('textbox', { name: 'Username' }).fill(authData.validUsers.usernames.standard_user);    
        await page.getByRole('textbox', { name: 'Password' }).fill(authData.validUsers.passwords.password);
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page).toHaveURL(`${baseUrl}/inventory.html`);
    });

    test('should logout successfully', async ({ page }) => {
        // Open the menu
        await page.getByRole('button', { name: 'Open Menu' }).click();
        await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
        // Click the logout link
        await page.getByRole('link', { name: 'Logout' }).click();
        // Verify that the user is logged out
        await expect(page).toHaveURL(`${baseUrl}`);
    });
});