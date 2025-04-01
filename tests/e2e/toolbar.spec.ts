import test, { expect } from '@playwright/test'
import { test_tech_loginWithData } from '../test.tech'

test('Toolbar Přihlašení', async ({ page }) => {
	await page.goto('/')

	await expect(page.getByRole('button', { name: 'Přihlásit se' })).toBeVisible()

	await test_tech_loginWithData(page)

	await expect(page.getByRole('button', { name: 'Účet' })).toBeVisible()
})

test('Toolbar Buttons', async ({ page }) => {
	await page.goto('/')

	await test_tech_loginWithData(page)

	await expect(page.getByRole('button', { name: 'Nástroje' })).toBeVisible()
	await expect(
		page.getByRole('button', { name: 'Přidat novou píseň' })
	).toBeVisible()

	await page.getByRole('button', { name: 'Nástroje' }).click()

	await expect(
		page.getByRole('link', { name: 'Playlisty Playlisty' })
	).toBeVisible()
	await expect(
		page.getByRole('link', { name: 'Moje písně Moje písně' })
	).toBeVisible()
	await expect(
		page.getByRole('link', { name: 'Oblíbené Oblíbené' })
	).toBeVisible()
})
