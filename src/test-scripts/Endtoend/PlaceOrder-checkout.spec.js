const {test, expect} = require('@playwright/test');
const dotenv = require('dotenv');
const authData = require('../Auth/authData.json');

dotenv.config();

const baseUrl = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

test.describe("Place Order Checkout Tests", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(baseUrl);
        await expect(page).toHaveTitle(/Swag Labs/);
        // Login before each test
        await page.getByRole('textbox', { name: 'Username' }).fill(authData.validUsers.usernames.standard_user);    
        await page.getByRole('textbox', { name: 'Password' }).fill(authData.validUsers.passwords.password);
        await page.getByRole('button', { name: 'Login' }).click();
        await expect(page).toHaveURL(`${baseUrl}/inventory.html`);

    });
    test('should place an order successfully', async ({ page }) => {
        // Add an item to the cart
        await page.getByLabel('Sauce Labs Backpack').click();
        await page.getByRole('button', { name: 'Add to cart' }).click();
        await page.locator('.shopping_cart_link').click();
        await expect(page).toHaveURL(`${baseUrl}/cart.html`);

        //check cart items 
        await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
        await expect(page.getByText('$29.99')).toBeVisible();

        // Proceed to checkout
        await page.getByRole('button', { name: 'Checkout' }).click();
        await expect(page).toHaveURL(`${baseUrl}/checkout-step-one.html`);

        // Fill in checkout information
        await page.getByRole('textbox', { name: 'First Name' }).fill('John');
        await page.getByRole('textbox', { name: 'Last Name' }).fill('Doe');
        await page.getByRole('textbox', { name: 'Zip/Postal Code' }).fill('12345');
        await page.getByRole('button', { name: 'Continue' }).click();
        await expect(page).toHaveURL(`${baseUrl}/checkout-step-two.html`);

        // Verify order summary
        await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
        await expect(page.getByText('$29.99')).toBeVisible();
        await expect(page.getByText('Payment Information')).toBeVisible();
        await expect(page.getByText('Shipping Information')).toBeVisible();
        await expect(page.getByText('Price Total')).toBeVisible();
        await expect(page.locator('[data-test="payment-info-value"]')).toHaveText(/SauceCard #\d{5}/);
        await expect(page.locator('[data-test="shipping-info-value"]')).toHaveText('FREE PONY EXPRESS DELIVERY!');
        await expect(page.getByRole('button', { name: 'Finish' })).toBeVisible();

        // Complete the order
        await page.getByRole('button', { name: 'Finish' }).click();
        await expect(page).toHaveURL(`${baseUrl}/checkout-complete.html`);
        await expect(page.getByText('THANK YOU FOR YOUR ORDER')).toBeVisible();
    });
});
