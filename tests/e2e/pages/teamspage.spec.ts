import test, { expect } from '@playwright/test'

test('Contain title', async ({ page }) => {
	await page.goto('/sub/tymy')

	await expect(
		page.getByRole('heading', { name: 'Zjednodušte si' })
	).toBeVisible()
	await expect(
		page.getByRole('heading', { name: 'práci ve vašem' })
	).toBeVisible()
	await expect(
		page.getByRole('heading', { name: 'chválícím týmu' })
	).toBeVisible()
})
