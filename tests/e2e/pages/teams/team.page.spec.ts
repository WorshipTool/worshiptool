import test, { expect } from '@playwright/test'

test('Team is visible', async ({ page }) => {
	await page.goto('/sub/13ka')

	await expect(page.getByText('CB Třináctka')).toBeVisible()
})
