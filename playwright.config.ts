import { defineConfig } from '@playwright/test'

import dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
	testDir: './tests/e2e',
	webServer: {
		command: 'npm run build && npm run start',
		port: 5500,
		reuseExistingServer: !process.env.CI,
	},
	use: {
		baseURL: 'http://test-chvalotce.cz:5500/',
		headless: true,
	},
	// fullyParallel: true,
	outputDir: 'tests/results/',
})
