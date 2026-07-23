import {test, expect} from '@playwright/test';
import dotenv from 'dotenv';
const authData = require('../Auth/authData.json');

dotenv.config();

const baseUrl = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

test.describe('sorting items functionalities', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(baseUrl);
        await page.locator('[data-test="username"]').fill(authData.validUsers.usernames.standard_user);
        await page.locator('[data-test="password"]').fill(authData.validUsers.passwords.password);
        await page.locator('[data-test="login-button"]').click();
        await expect(page).toHaveURL(`${baseUrl}/inventory.html`);
    });

    test('should sort items correctly', async ({ page }) => {

        // Select "Price (low to high)" from the sorting dropdown
        await page.locator('.product_sort_container').selectOption('lohi');

        // Verify that the items are sorted by price in ascending order
        const itemPrices = await page.locator('.inventory_item_price').allTextContents();
        const sortedItemPrices = [...itemPrices].sort((a, b) => {
            const priceA = Number(a.replace(/[^0-9.]/g, ''));
            const priceB = Number(b.replace(/[^0-9.]/g, ''));
            return priceA - priceB;
        });
        expect(itemPrices).toEqual(sortedItemPrices);

        // Select "Price (high to low)" from the sorting dropdown
        await page.locator('.product_sort_container').selectOption('hilo');

        // Verify that the items are sorted by price in descending order
        const itemPrices2 = await page.locator('.inventory_item_price').allTextContents();
        const sortedItemPrices2 = [...itemPrices2].sort((a, b) => {
            const priceA = Number(a.replace(/[^0-9.]/g, ''));
            const priceB = Number(b.replace(/[^0-9.]/g, ''));
            return priceB - priceA;
        });
        expect(itemPrices2).toEqual(sortedItemPrices2);

        // Select "Name (A to Z)" from the sorting dropdown
        await page.locator('.product_sort_container').selectOption('az');

        // Verify that the items are sorted by name in ascending order
        const itemNames = await page.locator('.inventory_item_name').allTextContents();
        const sortedItemNames = [...itemNames].sort((a, b) => a.localeCompare(b));
        expect(itemNames).toEqual(sortedItemNames);

        // Select "Name (Z to A)" from the sorting dropdown
        await page.locator('.product_sort_container').selectOption('za');

        // Verify that the items are sorted by name in descending order
        const itemNames2 = await page.locator('.inventory_item_name').allTextContents();
        const sortedItemNames2 = [...itemNames2].sort((a, b) => b.localeCompare(a));
        expect(itemNames2).toEqual(sortedItemNames2);
        
    });
}); 