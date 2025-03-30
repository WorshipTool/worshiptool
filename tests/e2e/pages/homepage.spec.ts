import { expect, test } from '@playwright/test'

test('Homepage contain title', async ({ page }) => {
	await page.goto('/')
	await expect(page).toHaveTitle(/chvalotce/i) // Uprav podle své stránky
})

test('Homepage contain Recommended', async ({ page }) => {
	await page.goto('/')

	// page contains: Nějaký nápad
	await expect(page.getByText(/Nějaký nápad/i)).toBeVisible()
})
