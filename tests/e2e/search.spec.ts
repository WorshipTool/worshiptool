import { expect, test } from '@playwright/test'

test('Vyhledávání podle názvu', async ({ page }) => {
	// Otevřeme domovskou stránku
	await page.goto('/')

	// Vyhledáme podle názvu
	const hledanyVyraz = 'Oceány' // název existující písně ve tvé DB

	await page.getByPlaceholder(/.*Hledej.*/i).fill(hledanyVyraz)

	// Počkáme na výsledek
	await page.waitForTimeout(1000)

	// Existuje výsledek
	const textPisne = await page.locator('text=/.*Voláš.*/i').first()
	await expect(textPisne).toBeVisible()

	// 4. Klikneme na výsledek
	await textPisne.click()

	// 5. Jsme na stránce písně
	await expect(page).toHaveURL(/\/pisen\/[a-z0-9-]+/)

	// 6. Zobrazí se text písně
	const newText = await page.locator('text=/.*Voláš.*/i').first()
	await expect(newText).toBeVisible()
})

test('Vyhledávání podle textu', async ({ page }) => {
	await page.goto('/')
	await page
		.getByRole('textbox', { name: 'Hledej podle názvu nebo části' })
		.click()
	await page
		.getByRole('textbox', { name: 'Hledej podle názvu nebo části' })
		.fill('Jsi darcem zivota')
	await page.getByRole('link', { name: 'Český originál Pokoj Jsi dá' }).click()

	await expect(page).toHaveURL(/\/pisen\/[a-z0-9-]+/)
})

test('Vyhledávání podle jednoho písmene', async ({ page }) => {
	await page.goto('/')
	await page
		.getByRole('textbox', { name: 'Hledej podle názvu nebo části' })
		.fill('A')

	await page.getByRole('link', { name: 'Až Až ulovíš severák holýma' }).click()

	await expect(page).toHaveURL(/\/pisen\/[a-z0-9-]+/)
})
