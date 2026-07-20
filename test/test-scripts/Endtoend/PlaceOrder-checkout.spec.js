const {test, expect} = require('@playwright/test');
const dotenv = require('dotenv');
const authData = require('../Auth/authData.json');
const getByDataTest = (page, dataTestValue) => page.locator(`[data-test="${dataTestValue}"]`);

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
        await page.getByText('Sauce Labs Backpack').click();
        await page.getByRole('button', { name: 'Add to cart' }).click();
        await page.locator('.shopping_cart_link').click();
        await expect(page).toHaveURL(`${baseUrl}/cart.html`);

        //check cart items 
        await expect(page.getByRole('link', { name: 'Sauce Labs Backpack' })).toBeVisible();
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
        await expect(page.getByRole('link', { name: 'Sauce Labs Backpack' })).toBeVisible();
        // await expect(page.getByText('$29.99')).toBeVisible();
        await expect(page.getByText('Payment Information')).toBeVisible();
        await expect(page.getByText('Shipping Information')).toBeVisible();
        await expect(page.getByText('Price Total')).toBeVisible();
        await expect(page.locator('[data-test="payment-info-value"]')).toHaveText(/SauceCard #\d{5}/);
        await expect(page.locator('[data-test="shipping-info-value"]')).toHaveText('Free Pony Express Delivery!');
        await expect(page.getByRole('button', { name: 'Finish' })).toBeVisible();

        // Complete the order
        await page.getByRole('button', { name: 'Finish' }).click();
        await expect(page).toHaveURL(`${baseUrl}/checkout-complete.html`);
        await expect(page.getByText('THANK YOU FOR YOUR ORDER')).toBeVisible();

        await page.getByRole('button', { name: 'Back Home' }).click();
        await expect(page).toHaveURL(`${baseUrl}/inventory.html`);
    });

    test('checkout pdf should be generated successfully', async ({ page }) => {
        // Add an item to the cart
        await page.getByText('Sauce Labs Backpack').click();
        await page.getByRole('button', { name: 'Add to cart' }).click();
        await page.locator('.shopping_cart_link').click();
        await expect(page).toHaveURL(`${baseUrl}/cart.html`);

        // Proceed to checkout
        await page.getByRole('button', { name: 'Checkout' }).click();
        await expect(page).toHaveURL(`${baseUrl}/checkout-step-one.html`);

        // Fill in checkout information
        await page.getByRole('textbox', { name: 'First Name' }).fill('John');
        await page.getByRole('textbox', { name: 'Last Name' }).fill('Doe');
        await page.getByRole('textbox', { name: 'Zip/Postal Code' }).fill('12345');
        await page.getByRole('button', { name: 'Continue' }).click();
        await expect(page).toHaveURL(`${baseUrl}/checkout-step-two.html`);

        // Complete the order
        await page.getByRole('button', { name: 'Finish' }).click();
        await expect(page).toHaveURL(`${baseUrl}/checkout-complete.html`);
        await expect(page.getByText('THANK YOU FOR YOUR ORDER')).toBeVisible();

        // Generate PDF
        const [download] = await Promise.all([
            page.waitForEvent('download'),
            page.locator('[data-test="generate-pdf-order"]').click()
        ]);

        // Save the downloaded PDF to a specific path
        const downloadPath = 'downloads/checkout.pdf';
        await download.saveAs(downloadPath);

        // Verify that the PDF was downloaded successfully
        const fs = require('fs');
        expect(fs.existsSync(downloadPath)).toBe(true);
    });

    test('should place more than one order successfully', async ({ page }) => {
        // Add first item to the cart
        await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
        await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();

        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();

        await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
        await expect(page.locator('[data-test="remove-sauce-labs-bolt-t-shirt"]')).toBeVisible();

        await page.locator('.shopping_cart_link').click();
        await expect(page).toHaveURL(`${baseUrl}/cart.html`);   
        

        await page.locator('.shopping_cart_link').click();
        await expect(page).toHaveURL(`${baseUrl}/cart.html`);

        //check cart items
        await expect(page.getByRole('link', { name: 'Sauce Labs Bike Light' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Sauce Labs Backpack' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Sauce Labs Bolt T-Shirt' })).toBeVisible();
        
       

        // Proceed to checkout
        await page.getByRole('button', { name: 'Checkout' }).click();
        await expect(page).toHaveURL(`${baseUrl}/checkout-step-one.html`);

        // Fill in checkout information
        await page.getByRole('textbox', { name: 'First Name' }).fill('Jane');
        await page.getByRole('textbox', { name: 'Last Name' }).fill('Smith');
        await page.getByRole('textbox', { name: 'Zip/Postal Code' }).fill('54321');
        await page.getByRole('button', { name: 'Continue' }).click();
        await expect(page).toHaveURL(`${baseUrl}/checkout-step-two.html`);

        // Verify order summary
        await expect(page.getByRole('link', { name: 'Sauce Labs Backpack' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Sauce Labs Bike Light' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Sauce Labs Bolt T-Shirt' })).toBeVisible();
        await expect(page.getByText('Payment Information')).toBeVisible();
        await expect(page.getByText('Shipping Information')).toBeVisible();
        await expect(page.getByText('Price Total')).toBeVisible();
        await expect(page.locator('[data-test="payment-info-value"]')).toHaveText(/SauceCard #\d{5}/);
        await expect(page.locator('[data-test="shipping-info-value"]')).toHaveText('Free Pony Express Delivery!');
        await expect(page.getByRole('button', { name: 'Finish' })).toBeVisible();

        // Complete the order
        await page.getByRole('button', { name: 'Finish' }).click();
        await expect(page).toHaveURL(`${baseUrl}/checkout-complete.html`);
        await expect(page.getByText('THANK YOU FOR YOUR ORDER')).toBeVisible();

        await page.getByRole('button', { name: 'Back Home' }).click();
        await expect(page).toHaveURL(`${baseUrl}/inventory.html`);



    });

    test('check empty carts dont have any items and total is zero', async ({ page }) => {
        // Ensure the cart is empty
        await page.locator('.shopping_cart_link').click();
        await expect(page).toHaveURL(`${baseUrl}/cart.html`);
        await expect(page.locator('.cart_item')).toHaveCount(0);
        
        //check cart items to be empty
        const cartItems = await page.locator('.cart_item').count();
        expect(cartItems).toBe(0);

        // Attempt to proceed to checkout
        await page.getByRole('button', { name: 'Checkout' }).click();

        // fill the checkout information
        await page.getByRole('textbox', { name: 'First Name' }).fill('John');
        await page.getByRole('textbox', { name: 'Last Name' }).fill('Doe');
        await page.getByRole('textbox', { name: 'Zip/Postal Code' }).fill('12345');
        await page.getByRole('button', { name: 'Continue' }).click();

        // Verify that the user is still on the checkout step one page
        await expect(page).toHaveURL(`${baseUrl}/checkout-step-two.html`);
        await expect(page.locator('data-test=total-label')).toHaveText('Total: $0.00');

        // Complete the order
        await page.getByRole('button', { name: 'Finish' }).click();
        await expect(page).toHaveURL(`${baseUrl}/checkout-complete.html`);
        await expect(page.getByText('THANK YOU FOR YOUR ORDER')).toBeVisible();

        //back to home page
        await page.getByRole('button', { name: 'Back Home' }).click();
        await expect(page).toHaveURL(`${baseUrl}/inventory.html`);
        
    });

});
