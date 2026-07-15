const { test, expect } = require('@playwright/test');
const dotenv = require('dotenv');
const authData = require('./authData.json');

dotenv.config();

const baseUrl = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

test.describe('Login User Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
    await expect(page).toHaveTitle(/Swag Labs/);
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.locator('#user-name').fill(authData.validUsers.usernames.standard_user);
    await page.locator('#password').fill(authData.validUsers.passwords.password);
    await page.locator('#login-button').click();

    await expect(page).toHaveURL(`${baseUrl}/inventory.html`);
  });

  test('should not login with invalid credentials', async ({ page }) => {
    console.log("Locked out user", authData.validUsers.usernames.locked_out_user);
    await page.locator('#user-name').fill(authData.validUsers.usernames.locked_out_user);
    await page.locator('#password').fill(authData.validUsers.passwords.password);
    await page.locator('#login-button').click();

    const errorMessage = await page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
  }); 

  test('should not login with empty credentials', async ({ page }) => {
    await page.locator('#login-button').click();
    const errorMessage = await page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Epic sadface: Username is required');
  });

  test('should not login with invalid username', async ({ page }) => {
    await page.locator('#user-name').fill('invalid_user');
    await page.locator('#password').fill(authData.validUsers.passwords.password);
    await page.locator('#login-button').click();

    const errorMessage = await page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Epic sadface: Username and password do not match any user in this service');
  });
});