import { expect } from '@playwright/test'
import { smartTest } from '../setup'

smartTest('Contain title', 'smoke', async ({ page }) => {
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
