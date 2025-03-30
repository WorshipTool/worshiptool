import { defineConfig } from '@playwright/test'

export default defineConfig({
	testDir: './tests/e2e',
	webServer: {
		command: 'npm run dev',
		port: 5500,
		reuseExistingServer: !process.env.CI,
	},
	use: {
		baseURL: 'http://test-chvalotce.cz:5500/',
		headless: true,
	},
	fullyParallel: true,
	outputDir: 'tests/results/',
})
