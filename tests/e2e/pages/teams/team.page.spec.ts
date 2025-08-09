import { expect } from '@playwright/test'
import { smartTest } from '../../setup'

smartTest('Team is visible', 'critical', async ({ page }) => {
	await page.goto('/sub/13ka')

	await expect(page.getByText('CB Třináctka')).toBeVisible()
})
