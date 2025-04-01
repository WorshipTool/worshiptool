import { expect, test } from '@playwright/test'

test('Footer contains basic info', async ({ page }) => {
	await page.goto('/o-nas')

	await expect(
		page.getByRole('link', { name: 'Ve spolupráci s Logo' }).last()
	).toBeVisible()
	await expect(page.getByText('2025')).toBeVisible()
})
