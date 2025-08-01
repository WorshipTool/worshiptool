import { getRandomInt } from '@/tech/number/getRandomInt'
import test, { expect, Page } from '@playwright/test'
import { test_tech_loginWithData } from '../../../test.tech'

test('Playlist list loads', async ({ page }) => {
	await page.goto('/')

	await test_tech_loginWithData(page)

	await page.goto('/ucet/playlisty')

	await expect(page.getByText('jjeja')).toBeVisible()
})

const startWithCreatePlaylist = async (page: Page) => {
	await page.goto('/')

	await test_tech_loginWithData(page)

	await page.goto('/ucet/playlisty')

	await page.getByRole('button', { name: 'Vytvořit' }).click()
}

test('Can create a new playlist', async ({ page }) => {
	await startWithCreatePlaylist(page)

	await expect(page).toHaveURL(/\/playlist/)
})

const addRandomSong = async (page: Page): Promise<string> => {
	await page.getByLabel('Přidat píseň do playlistu').getByRole('button').click()

	await page.locator('.global-song-list-item').first().click()

	await page
		.locator('#popup-div-container')
		.getByRole('button', { name: 'Přidat píseň' })
		.click()

	await page.mouse.click(10, 10)

	await page.waitForTimeout(100)

	const lastParagraph = await page
		.locator('.song-menu-list p')
		.last()
		.textContent()
	return lastParagraph || ''
}

const removeSong = async (page: Page, songIndex: number) => {
	const a = await page
		.getByRole('button', { name: 'Odebrat z playlistu' })
		.nth(songIndex)

	expect(a).toBeVisible()

	await a.click()

	await page.waitForTimeout(100)
}

const renamePlaylist = async (page: Page, newName?: string) => {
	newName = newName || `${Math.random().toString(36).substring(2, 7)}`

	const e = page.getByRole('textbox', { name: 'Název playlistu' })
	await e.click()
	await e.fill(newName)
	await e.press('Enter')

	return newName
}

const savePlaylist = async (page: Page) => {
	await page.getByRole('button', { name: 'Uložit' }).click()
	await page.waitForTimeout(100)
}

const checkSongs = async (page: Page, songs: string[], message?: string) => {
	const paragraphs = (
		await page.locator('.song-menu-list p').allTextContents()
	).filter((_, i) => i % 2 === 1)
	expect(paragraphs, message).toEqual(songs)
}

const testEditing = async (page: Page) => {
	await startWithCreatePlaylist(page)

	await page.waitForTimeout(1000)
	// close popup
	await page.mouse.click(10, 10)

	await expect(
		page.getByRole('textbox', { name: 'Název playlistu' })
	).toBeVisible()

	type AddAction = {
		type: 'add'
	}
	type RemoveAction = {
		type: 'remove'
	}
	type RenameAction = {
		type: 'rename'
		name?: string
	}
	type Action = AddAction | RemoveAction | RenameAction

	const addCount = getRandomInt(5, 10)
	const removeCount = Math.floor(Math.random() * (addCount - 1)) + 1
	const actions: Action[] = [
		...(Array.from({ length: addCount }, () => ({
			type: 'add',
		})) satisfies AddAction[]),
		...(Array.from({ length: removeCount }, () => ({
			type: 'remove',
		})) satisfies RemoveAction[]),
		{
			type: 'rename',
		},
	]

	// Shuffle actions array
	actions.sort(() => Math.random() - 0.5)

	let name = 'Nový playlist'
	const songs: string[] = []
	for (const action of actions) {
		if (action.type === 'add') {
			const song = await addRandomSong(page)
			songs.push(song)
		} else if (action.type === 'remove') {
			if (songs.length === 0) {
				continue // skip if no songs to remove
			}
			const i = Math.floor(Math.random() * songs.length)
			await removeSong(page, i)
			songs.splice(i, 1)
		} else if (action.type === 'rename') {
			name = await renamePlaylist(page, action.name)
		}
	}

	await savePlaylist(page)

	/* Check songs names */
	await checkSongs(page, songs)

	await page.reload()

	await expect(
		page.getByRole('textbox', { name: 'Název playlistu' })
	).toHaveValue(name)

	await checkSongs(page, songs, 'Refreshed song list does not match')
}

test('Can edit a playlist 1', async ({ page }) => {
	await testEditing(page)
})
test('Can edit a playlist 2', async ({ page }) => {
	await testEditing(page)
})
test('Can edit a playlist 3', async ({ page }) => {
	await testEditing(page)
})
