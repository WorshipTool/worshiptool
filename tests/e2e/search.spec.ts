import { mapBasicVariantPackApiToDto } from '@/api/dtos'
import { SearchSongPacksDto, SongSearchingApi } from '@/api/generated'
import { handleServerApiCall } from '@/tech/fetch/handleServerApiCall'
import { getRandomString } from '@/tech/string/random.string.tech'
import { expect, Page, test } from '@playwright/test'

async function searchWithSearchBar(str: string, page: Page) {
	await page.getByPlaceholder(/.*Hledej.*/i).fill(str)
}

test('Vyhledávání podle názvu', async ({ page }) => {
	// Otevřeme domovskou stránku
	await page.goto('/')

	// Vyhledáme podle názvu
	await searchWithSearchBar('Oceány', page)

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

// Check if the user dont see songs of other users

const checkResponse = async (response: SearchSongPacksDto[], mess: string) => {
	for (const result of response) {
		const whole = [
			...result.found,
			...(result.other || []),
			...(result.original ? [result.original] : []),
		]

		for (const song of whole) {
			const data = mapBasicVariantPackApiToDto(song)
			expect(data.public, mess).toBeTruthy()
		}
	}
}

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
	const randomStrings = Array.from({ length: 5 }, () => getRandomString(4))

	const allSearchStrings = [...searchStrings, ...randomStrings]

	for (const searchString of allSearchStrings) {
		const response = await handleServerApiCall(
			api.songSearchingControllerSearch(searchString)
		)

		await checkResponse(response, `Vyhledávání podle "${searchString}"`)
	}
})
