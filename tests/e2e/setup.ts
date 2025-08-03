import { test as base } from '@playwright/test'

export const smartTest = base.extend({
	page: async ({ page }, use) => {
		await page.route('**/*', async (route) => {
			// await new Promise((r) => setTimeout(r, 500)) // zpomalí každý request o 500ms
			await route.continue()
		})
		await use(page)
	},
})
