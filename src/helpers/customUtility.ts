// helpers.ts
import { Page, Locator } from '@playwright/test';

type DataTestIdentifier = string | RegExp;

interface DataTestFilterOptions {
  has: Locator;
}

export function getByDataTest(page: Page, testId: DataTestIdentifier): Locator {
  if (testId instanceof RegExp) {
    // Fallback for regex: select all and filter (slower but works without global config)
    const filterOptions: DataTestFilterOptions = { has: page.locator('[data-test]').first() };

    return page.locator('[data-test]').filter({ hasText: testId });
  }
  // Direct CSS selector for exact strings (Fast)
  return page.locator(`[data-test="${testId}"]`);
}   