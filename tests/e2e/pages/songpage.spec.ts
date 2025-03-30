import test, { expect } from '@playwright/test'

test('Transposition exists and works', async ({ page }) => {
	await page.goto('/pisen/a6d46/mou-cestu-v-rukou-mas')
	await page.getByText('TRANSPOZICE').click()
	const c1 = await page
		.locator('div')
		.filter({ hasText: /^CMou$/ })
		.getByRole('paragraph')
		.first()

	await expect(c1).toBeVisible()

	const up = await page.getByRole('button', { name: 'Zvýšit o půltón' })
	up.click()
	up.click()

	const c2 = await page
		.locator('div')
		.filter({ hasText: /^DMou$/ })
		.getByRole('paragraph')
		.first()

	await expect(c2).toBeVisible()

	const down = await page.getByRole('button', { name: 'Snížit o půltón' })

	down.click()
	down.click()
	down.click()
	const c3 = await page
		.locator('div')
		.filter({ hasText: /^HMou$/ })
		.getByRole('paragraph')
		.first()

	await expect(c3).toBeVisible()
})

test('Print button exists and works', async ({ page }) => {
	await page.goto('/pisen/a6d46/mou-cestu-v-rukou-mas')

	const page2Promise = page.waitForEvent('popup')
	await page.getByRole('button', { name: 'Tisknout' }).click()
	const page2 = await page2Promise

	await page2.getByText('Mou cestu v rukou máš').click()

	await expect(page2.getByText('Mou cestu v rukou m')).toBeVisible()
	///pisen/a6d46/mou-cestu-v-rukou-mas/tisk
	await expect(page2).toHaveURL(/\/pisen\/a6d46\/mou-cestu-v-rukou-mas\/tisk/)
})

test('Contains source', async ({ page }) => {
	await page.goto('/pisen/a6d46/mou-cestu-v-rukou-mas')
	await expect(
		page.getByRole('button', { name: 'https://zpevnik.proscholy.cz/' })
	).toBeVisible()
})
