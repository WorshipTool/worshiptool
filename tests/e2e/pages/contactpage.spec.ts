import test, { expect } from '@playwright/test'

test('Contain title', async ({ page }) => {
	await page.goto('/kontakt')

	await expect(page.getByText('KontaktChcete se na něco')).toBeVisible()
	await expect(page.getByText('Zpětná vazbaLíbí se vám naše')).toBeVisible()
	await expect(
		page.getByRole('textbox', { name: 'Zadejte vaše jméno' })
	).toBeEmpty()
	await expect(
		page.getByRole('textbox', { name: 'Zadejte váš e-mail' })
	).toBeEmpty()
})
