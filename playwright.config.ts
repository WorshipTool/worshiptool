import { defineConfig } from '@playwright/test'

import dotenv from 'dotenv'
dotenv.config()

const isCI = !!process.env.CI
export default defineConfig({
	testDir: './tests/e2e',
	...(isCI
		? {}
		: {
				webServer: {
					command:
						false && fs.existsSync('.next/routes-manifest.json') // just trying
							? 'npm run start'
							: 'npm run build && npm run start',
					port: 5500,
					reuseExistingServer: true,
					timeout: 120 * 1000, // 2 minutes
					// "stdout": "ignore",
					stderr: 'ignore',
				},
		  }),
	use: {
		baseURL: process.env.NEXT_PUBLIC_FRONTEND_URL,
		// baseURL: 'https://preview.chvalotce.cz',
		headless: true,
		actionTimeout: 60 * 1000, // 60 seconds
		navigationTimeout: 60 * 1000, // 60 seconds
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
	},
	retries: 0,
	workers: 3,
	timeout: 120 * 1000, // 60 seconds
	outputDir: 'tests/results/',
})
