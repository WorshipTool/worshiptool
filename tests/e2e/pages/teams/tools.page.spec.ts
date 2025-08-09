import { expect } from '@playwright/test'
import { test_tech_loginWithData } from '../../../test.tech'
import { smartTest } from '../../setup'

smartTest('Team is in tools', async ({ page }) => {
	await page.goto('/')

	await test_tech_loginWithData(page)

	await page.getByRole('button', { name: 'Nástroje' }).click()
	await expect(
		page.getByRole('link', { name: 'Zkouska Zkouska' })
	).toBeVisible()
	await page.getByRole('link', { name: 'Zkouska Zkouska' }).click()

	await page.waitForURL(
		/tymy\/ahtk3wx|http:\/\/tymy\.test-chvalotce\.cz:5500\/ahtk3wx/
	)
	const expectedUrls = [
		'tymy/ahtk3wx',
		'http://tymy.test-chvalotce.cz:5500/ahtk3wx',
	]
	const currentUrl = page.url()
	const isMatch = expectedUrls.some((url) => currentUrl.includes(url))
	await expect(isMatch).toBeTruthy()

	await expect(page.getByRole('link', { name: 'Zkouska' })).toBeVisible()
})
