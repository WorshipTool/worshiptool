import { test as base } from '@playwright/test'
import { config } from 'dotenv'

config()

export const smartTest = base.extend({
	page: async ({ page }, use) => {
		await page.route('**/*', async (route) => {
			const slowdown =
				process.env.TEST_WITH_SLOWDOWN?.toLocaleLowerCase() === 'true'
			if (slowdown) await new Promise((r) => setTimeout(r, 1000)) // zpomalí každý request o 500ms
			await route.continue()
		})
		await use(page)
	},
})
