import { expect } from '@playwright/test'
import { smartTest } from './setup'

smartTest('Footer contains basic info', 'smoke', async ({ page }) => {
	await page.goto('/o-nas')

	await expect(
		page.getByRole('link', { name: 'Ve spolupráci s Logo' }).last()
	).toBeVisible()
	await expect(page.getByText('2025')).toBeVisible()
})
