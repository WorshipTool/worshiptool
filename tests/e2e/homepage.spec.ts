import { expect, test } from '@playwright/test'

test('homepage should load and show title', async ({ page }) => {
	await page.goto('/')
	await expect(page).toHaveTitle(/chvalotce/i) // Uprav podle své stránky
})
