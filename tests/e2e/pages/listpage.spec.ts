import test, { expect } from '@playwright/test'

test('Contain title and list', async ({ page }) => {
	await page.goto('/seznam')

	await expect(page.getByText('Seznam všech písní')).toBeVisible()

	const items = await page.locator('.MuiPaper-root')
	await expect(await items.count()).toBeGreaterThan(10)

	await expect(page.getByRole('button', { name: 'Go to page 4' })).toBeVisible()
})
