import { mapBasicVariantPackApiToDto } from '@/api/dtos'
import { SongSearchingApi } from '@/api/generated'
import { handleServerApiCall } from '@/tech/fetch/handleServerApiCall'
import { getRandomString } from '@/tech/string/random.string.tech'
import { expect, Page, test } from '@playwright/test'
import { test_tech_loginWithData } from '../test.tech'

async function searchWithSearchBar(str: string, page: Page) {
	await page.getByPlaceholder(/.*Hledej.*/i).fill(str)
}

test('Vyhledávání podle názvu', async ({ page }) => {
	// Otevřeme domovskou stránku
	await page.goto('/')

	// Vyhledáme podle názvu
	await searchWithSearchBar('Vira', page)

	// Existuje výsledek

	const textPisne = await page
		.getByRole('link', {
			name: 'Kde je zápis ptačí melodie?',
		})
		.first()
	await expect(textPisne).toBeVisible()

	// 4. Klikneme na výsledek
	await textPisne.click()

	// 5. Jsme na stránce písně
	await expect(page).toHaveURL(/\/pisen\/[a-z0-9-]+/)

	// 6. Zobrazí se text písně
	const newText = await page.locator('text=/.*Kde.*/i').first()
	await expect(newText).toBeVisible()
})

test('Vyhledávání podle textu', async ({ page }) => {
	await page.goto('/')

	await searchWithSearchBar('Jsi darcem zivota', page)

	await page.getByRole('link', { name: 'Český originál Pokoj Jsi dá' }).click()

	await expect(page).toHaveURL(/\/pisen\/[a-z0-9-]+/)
})

test('Vyhledávání podle jednoho písmene', async ({ page }) => {
	await page.goto('/')

	await searchWithSearchBar('A', page)

	await page.getByRole('link', { name: 'Až Až ulovíš severák holýma' }).click()

	await expect(page).toHaveURL(/\/pisen\/[a-z0-9-]+/)
})

test('Načíst další', async ({ page }) => {
	await page.goto('/')

	await searchWithSearchBar('Pokoj', page)

	const b = page.getByRole('button', { name: 'Načíst další' })
	await expect(b).toBeVisible()
	await b.click()
	await expect(b).toBeVisible()
})

test('Neobsahuje cizí soukromé písně', async ({ page }) => {
	await page.goto('/')

	const api = new SongSearchingApi()
	const searchStrings = [
		'Pokoj',
		'Láska',
		'Naděje',
		'Víra',
		'Oceány',
		'Jsi darcem',
		'A',
		'B',
		'C',
	]
	const randomStrings = Array.from({ length: 50 }, () => getRandomString(4))

	const allSearchStrings = [...searchStrings, ...randomStrings]

	for (const searchString of allSearchStrings) {
		const response = await handleServerApiCall(
			api.songSearchingControllerSearch(searchString)
		)

		for (const result of response) {
			const whole = [
				...result.found,
				...(result.other || []),
				...(result.original ? [result.original] : []),
			]

			for (const song of whole) {
				const data = mapBasicVariantPackApiToDto(song)
				await expect(
					data.public,
					`Vyhledávání podle "${searchString}"`
				).toBeTruthy()
			}
		}
	}
})

test('Při přihlášení obsahuje uživatelovy soukromé písně', async ({ page }) => {
	await page.goto('/')

	const user = await test_tech_loginWithData(page)

	const api = new SongSearchingApi()
	const searchStrings = ['Oceany']
	const randomStrings = Array.from({ length: 50 }, () => getRandomString(1))

	const allSearchStrings = [...searchStrings, ...randomStrings]

	let count = 0

	for (const searchString of allSearchStrings) {
		const response = await handleServerApiCall(
			api.songSearchingControllerSearch(searchString)
		)
		count += response.length

		for (const result of response) {
			const whole = [
				...result.found,
				...(result.other || []),
				...(result.original ? [result.original] : []),
			]

			for (const song of whole) {
				const data = mapBasicVariantPackApiToDto(song)

				if (!data.public) {
					await expect(
						data.createdByGuid,
						`Soukromá píseň: vyhledána pomocí "${searchString}"`
					).toBe(user.guid)
				}
			}
		}
	}

	await expect(count).toBeGreaterThan(0)
})
