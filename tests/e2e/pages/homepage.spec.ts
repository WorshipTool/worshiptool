import { expect } from '@playwright/test'

import { smartTest } from '../setup'
smartTest('Homepage contain title', async ({ page }) => {
	await page.goto('/')
	await expect(page).toHaveTitle(/chvalotce/i) // Uprav podle své stránky
})

smartTest('Homepage contain Recommended', async ({ page }) => {
	await page.goto('/')

	// page contains: Nějaký nápad
	await expect(page.getByText(/Nějaký nápad/i)).toBeVisible()
})
