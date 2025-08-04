import { expect } from '@playwright/test'
import { smartTest } from '../setup'

smartTest('Contain title and form', async ({ page }) => {
	await page.goto('/registrace')

	await expect(page.getByText('Vytvořte si účet')).toBeVisible()

	await expect(
		page
			.locator('div')
			.filter({ hasText: /^Jméno$/ })
			.getByPlaceholder('Zadejte text')
	).toBeEmpty()
	await expect(
		page
			.locator('div')
			.filter({ hasText: /^Příjmení$/ })
			.getByPlaceholder('Zadejte text')
	).toBeEmpty()
	await expect(page.locator('input[type="email"]')).toBeEmpty()
	await expect(page.locator('input[type="password"]')).toBeEmpty()
	await expect(
		page.getByRole('button', { name: 'Vytvořit účet' })
	).toBeVisible()
})
