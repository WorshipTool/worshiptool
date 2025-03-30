import test, { expect } from '@playwright/test'

test('False', async ({ page }) => {
	await expect(false).toBeTruthy()
})
