import test, { expect } from '@playwright/test'

test('Contain title and form', async ({ page }) => {
	await page.goto('/prihlaseni')

	await expect(page.getByText('Přihlaste se')).toBeVisible()
	await expect(
		page.getByRole('textbox', { name: 'Zadejte e-mail' })
	).toBeEmpty()
	await expect(page.getByRole('textbox', { name: 'Zadejte heslo' })).toBeEmpty()
	await expect(page.getByRole('button', { name: 'Přihlásit se' })).toBeVisible()
})
