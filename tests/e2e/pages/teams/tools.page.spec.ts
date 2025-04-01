import test, { expect } from '@playwright/test'
import { test_tech_loginWithData } from '../../../test.tech'

test('Team is in tools', async ({ page }) => {
	await page.goto('/')

	await test_tech_loginWithData(page)

	await page.getByRole('button', { name: 'Nástroje' }).click()
	await page.getByRole('link', { name: 'Zkouska Zkouska' }).click()

	await page.waitForTimeout(3000)

	await expect(page.url()).toContain('tymy/ahtk3wx')

	await expect(page.getByRole('link', { name: 'Zkouska' })).toBeVisible()
})
