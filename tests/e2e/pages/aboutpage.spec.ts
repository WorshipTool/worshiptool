import test, { expect } from '@playwright/test'

test('Contain title', async ({ page }) => {
	await page.goto('/o-nas')

	// page contains: Nějaký nápad
	await expect(
		page.getByRole('heading', { name: 'Platforma', exact: true })
	).toBeVisible()
	await expect(
		page.getByRole('heading', { name: 's křesťanskými' })
	).toBeVisible()
	await expect(page.getByRole('heading', { name: 'chválami' })).toBeVisible()
})

test('Contain PoweredBy', async ({ page }) => {
	await page.goto('/o-nas')

	// page contains: Nějaký nápad
	await expect(page.getByText(/Vytvořeno ve spolupráci s/i)).toBeVisible()
})
