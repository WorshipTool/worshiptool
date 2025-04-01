import { defineConfig } from '@playwright/test'

import dotenv from 'dotenv'
import fs from 'fs'
dotenv.config()

export default defineConfig({
	testDir: './tests/e2e',
	webServer: {
		command: fs.existsSync('.next/routes-manifest.json')
			? 'npm run start'
			: 'npm run build && npm run start',
		// command: 'npm run dev',
		port: 5500,
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000, // 2 minutes
	},
	use: {
		baseURL: 'http://test-chvalotce.cz:5500/',
		headless: true,
	},
	// fullyParallel: true,
	outputDir: 'tests/results/',
})
