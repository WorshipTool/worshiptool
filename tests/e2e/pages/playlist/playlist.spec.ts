import { getRandomInt } from '@/tech/number/getRandomInt'
import { expect, Page, test } from '@playwright/test'
import { test_tech_loginWithData } from '../../../test.tech'
import { smartTest } from '../../setup'

test.describe.configure({ mode: 'parallel', timeout: 4 * 60 * 1000 }) // 4 minutes

smartTest('Playlist list loads', async ({ page }) => {
	await page.goto('/')

	await test_tech_loginWithData(page)

	await page.goto('/ucet/playlisty')

	await expect(
		page.getByRole('heading', { name: 'Moje playlisty' })
	).toBeVisible()
})

const waitUntilPopupAndClose = async (page: Page) => {
	await page.waitForLoadState('networkidle', { timeout: 60000 })

	await page.waitForTimeout(1500)
	// close popup
	await page.mouse.click(10, 10)
	await page.waitForTimeout(500)
}
const startWithCreatePlaylist = async (page: Page) => {
	await page.goto('/', { timeout: 30000 })

	await test_tech_loginWithData(page)

	await page.goto('/ucet/playlisty')

	await page.getByRole('button', { name: 'Vytvořit' }).click()

	// Wait until the URL pathname starts with /playlist
	await expect(async () => {
		const url = new URL(page.url())
		expect(url.pathname.startsWith('/playlist')).toBe(true)
	}).toPass()

	await waitUntilPopupAndClose(page)
}

smartTest('Can create a new playlist', async ({ page }) => {
	await startWithCreatePlaylist(page)

	await expect(page).toHaveURL(/\/playlist/)

	await page.waitForTimeout(1000)
	// close popup
	await page.mouse.click(10, 10)
})

const addSearchedSong = async (
	page: Page,
	searchQuery: string
): Promise<string> => {
	await page.waitForLoadState('networkidle')
	await page.waitForTimeout(1000) // wait for the page to be ready

	// Close any existing popups first
	await page.mouse.click(10, 10)
	await page.waitForTimeout(500)

	await page.getByLabel('Přidat píseň do playlistu').getByRole('button').click()

	await page.waitForLoadState('networkidle')
	await page.waitForTimeout(1000) // wait for the page to be ready

	await page.getByRole('textbox', { name: 'Vyhledej píseň' }).fill(searchQuery)

	await page.waitForTimeout(1000) // wait for search results to load

	await page.waitForLoadState('networkidle')
	await page.waitForTimeout(500)

	await page.locator('.global-song-list-item').first().click()

	await page.waitForTimeout(500)
	await page.waitForLoadState('networkidle')

	await page
		.locator('#popup-div-container')
		.getByRole('button', { name: 'Přidat píseň' })
		.click()

	await page.waitForTimeout(500)
	await page.mouse.click(10, 10)

	await page.waitForTimeout(500)
	await page.waitForLoadState('networkidle')

	const lastParagraph = await page
		.locator('.song-menu-list p')
		.last()
		.textContent()
	return lastParagraph || ''
}

const addRandomSong = async (page: Page): Promise<string> => {
	const query = String.fromCharCode(97 + Math.floor(Math.random() * 26))
	return addSearchedSong(page, query)
}

const removeSong = async (page: Page, songIndex: number) => {
	await page.waitForLoadState('networkidle')
	await page.waitForTimeout(500)

	// Close any popups first
	await page.mouse.click(10, 10)
	await page.waitForTimeout(500)

	const a = page
		.getByRole('button', { name: 'Odebrat z playlistu' })
		.nth(songIndex)

	expect(a).toBeVisible()

	await a.click()

	await page.waitForTimeout(500)
	await page.waitForLoadState('networkidle')
}

const renamePlaylist = async (page: Page, newName?: string) => {
	newName = newName || `${Math.random().toString(36).substring(2, 7)}`

	const e = page.getByRole('textbox', { name: 'Název playlistu' })
	await expect(e).toBeVisible()
	await e.click()
	await e.fill(newName)
	await e.press('Enter')

	return newName
}
const checkNoErrors = async (page: Page) => {
	// Check for errors in console and network
	const consoleErrors: string[] = []
	page.on('console', (msg) => {
		if (msg.type() === 'error') {
			consoleErrors.push(msg.text())
		}
	})

	const failedRequests: string[] = []
	page.on('requestfailed', (request) => {
		failedRequests.push(
			`${request.method()} ${request.url()} - ${request.failure()?.errorText}`
		)
	})

	// Wait a short time to allow errors to be captured
	await page.waitForTimeout(300)

	// Assert no console errors
	expect(consoleErrors, `Console errors: ${consoleErrors.join('\n')}`).toEqual(
		[]
	)

	// Assert no failed network requests
	expect(
		failedRequests,
		`Network errors: ${failedRequests.join('\n')}`
	).toEqual([])
}
const savePlaylist = async (page: Page) => {
	await page.waitForTimeout(1000)
	await page.waitForLoadState('networkidle')
	await page.getByRole('button', { name: 'Uložit' }).click()

	await page.waitForTimeout(1000)
	await page.waitForLoadState('networkidle')

	// Wait longer for save to complete before checking errors
	await page.waitForTimeout(1000)

	await checkNoErrors(page)

	await page.waitForTimeout(500)
	await expect(page.getByRole('button', { name: 'Uloženo' })).toBeVisible()
}

const checkSongs = async (page: Page, songs: string[], message?: string) => {
	const paragraphs = (
		await page.locator('.song-menu-list p').allTextContents()
	).filter((_, i) => i % 2 === 1)
	expect(paragraphs, message).toEqual(songs)
}

const pagePlaylistReload = async (page: Page) => {
	await page.reload()
	await page.waitForLoadState('networkidle')

	await waitUntilPopupAndClose(page)
}
const move = async (
	page: Page,
	songs: string[],
	fromIndex: number,
	toIndex: number
) => {
	const songToMove = songs[fromIndex]
	const fromElement = page.locator('.song-menu-list p', {
		hasText: songToMove,
	})
	const toElement = page.locator('.song-menu-list p', {
		hasText: songs[toIndex],
	})

	const fromBox = await fromElement.boundingBox()
	const toBox = await toElement.boundingBox()

	if (!fromBox || !toBox) {
		expect(true).toBe(false)
		return
	}

	await page.mouse.move(
		fromBox.x + fromBox.width / 2,
		fromBox.y + fromBox.height / 2
	)
	await page.mouse.down()
	await page.mouse.move(toBox.x + toBox.width / 2, toBox.y + toBox.height / 2, {
		steps: 10, // Smooth drag
	})
	await page.mouse.up()

	// reorder songs list
	const temp = songs[fromIndex]
	songs[fromIndex] = songs[toIndex]
	songs[toIndex] = temp
}

const transposeSong = async (
	page: Page,
	songIndex: number,
	transpose: number
) => {
	for (let i = 0; i < Math.abs(transpose); i++) {
		await page.waitForLoadState('networkidle')
		await page.waitForTimeout(500)

		if (transpose > 0) {
			const button = page
				.getByRole('button', { name: 'Transpose up' })
				.nth(songIndex)
			await expect(button).toBeVisible()

			await button.click()
		} else {
			const button = page
				.getByRole('button', { name: 'Transpose down' })
				.nth(songIndex)
			await expect(button).toBeVisible()

			await button.click()
		}

		await page.waitForTimeout(1000)
		await page.waitForLoadState('networkidle')
	}
}

const checkSongTransposition = async (
	page: Page,
	songIndex: number,
	songs: string[],
	toneKey: string,
	message?: string
) => {
	// Find the div that starts with the song name
	const songDiv = page
		.locator('.playlist-middle-song-list > div')
		.nth(songIndex)

	// Ensure the div is visible
	await expect(songDiv).toBeVisible()

	// Find the first element with class .chord inside this div
	const chordElement = songDiv.locator('.chord').first()

	// Ensure the chord element is visible
	await expect(chordElement).toBeVisible()

	// Get the text content of the chord element
	const chordText = await chordElement.textContent()

	// Assert the chord matches the expected toneKey
	expect(chordText?.trim().startsWith(toneKey), message).toBe(true)
}

smartTest('Can rename a playlist', async ({ page }) => {
	await startWithCreatePlaylist(page)

	await expect(
		page.getByRole('textbox', { name: 'Název playlistu' })
	).toBeVisible()

	const newName = 'asdfihelhalhi ohi'
	await renamePlaylist(page, newName)

	await expect(
		page.getByRole('textbox', { name: 'Název playlistu' })
	).toHaveValue(newName)

	await savePlaylist(page)

	await page.reload()
	await page.waitForLoadState('networkidle')

	await expect(
		page.getByRole('textbox', { name: 'Název playlistu' })
	).toHaveValue(newName)
})

smartTest('Can add a song to a playlist', async ({ page }) => {
	await startWithCreatePlaylist(page)

	const song = await addRandomSong(page)
	await checkSongs(page, [song], 'Before save: song not added to playlist')
	await savePlaylist(page)

	await checkSongs(page, [song], 'After save: song not added to playlist')
	await page.reload()
	await page.waitForLoadState('networkidle')
	await checkSongs(page, [song], 'After reload: song not added to playlist')
})

smartTest('Song not added to playlist without save', async ({ page }) => {
	await startWithCreatePlaylist(page)

	const song = await addRandomSong(page)
	await checkSongs(page, [song])

	await pagePlaylistReload(page)
	await checkSongs(page, [])
})

smartTest('Song can be removed from playlist', async ({ page }) => {
	await startWithCreatePlaylist(page)

	const song = await addRandomSong(page)

	await checkSongs(
		page,
		[song],
		'Song was not added to playlist before removal'
	)
	await savePlaylist(page)
	await pagePlaylistReload(page)

	await checkSongs(page, [song], 'Song was not added to playlist after reload')

	await removeSong(page, 0)
	await checkSongs(
		page,
		[],
		'Song was not removed from playlist before refresh'
	)

	await savePlaylist(page)
	await pagePlaylistReload(page)
	await checkSongs(page, [], 'Song was not removed from playlist after refresh')
})

smartTest('Songs can be reordered in playlist', async ({ page }) => {
	await startWithCreatePlaylist(page)

	const songs: string[] = [
		await addRandomSong(page),
		await addRandomSong(page),
		await addRandomSong(page),
	]

	await savePlaylist(page)
	await pagePlaylistReload(page)

	await checkSongs(page, songs, 'Songs were not added to playlist after save')

	// Reorder songs by dragging and dropping

	await move(page, songs, 0, 1)
	await checkSongs(
		page,
		songs,
		'Songs were not reordered after first move before save'
	)
	await savePlaylist(page)
	await pagePlaylistReload(page)
	await checkSongs(page, songs, 'Songs were not reordered after first save')
})

smartTest('Song can be searched in playlist', async ({ page }) => {
	await startWithCreatePlaylist(page)

	const songs = [
		await addSearchedSong(page, 'Ocean'),
		await addSearchedSong(page, 'Rano cely den'),
	]

	await checkSongs(page, songs, 'Song not added to playlist after search')

	await savePlaylist(page)
	await pagePlaylistReload(page)
	await checkSongs(
		page,
		songs,
		'Song not added to playlist after search and save'
	)
})

smartTest('Song can be transposed in playlist', async ({ page }) => {
	await startWithCreatePlaylist(page)
	const songs = [
		await addSearchedSong(page, 'Volas nas do morskych'),
		await addSearchedSong(page, 'Rano cely den'),
	]
	await checkSongs(page, songs, 'Song not added to playlist after search')

	await transposeSong(page, 0, 4)
	await checkSongTransposition(
		page,
		0,
		songs,
		'E',
		'Song not transposed before save'
	)
	await savePlaylist(page)

	await pagePlaylistReload(page)
	await checkSongs(page, songs)
	await checkSongTransposition(
		page,
		0,
		songs,
		'E',
		'First song not transposed after reload'
	)
	// also check transposition

	await transposeSong(page, 1, -5)
	await checkSongTransposition(
		page,
		1,
		songs,
		'G',
		'Second song not transposed after reload'
	)
	await savePlaylist(page)
	await pagePlaylistReload(page)

	await checkSongTransposition(
		page,
		0,
		songs,
		'E',
		'First song not transposed after second reload'
	)
	await checkSongTransposition(
		page,
		1,
		songs,
		'G',
		'Second song not transposed after second reload'
	)
})

const testEditing = async ({ page }: { page: Page }) => {
	await startWithCreatePlaylist(page)

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

	let name = 'Nový playlist'
	const songs: string[] = []

	const doChangeIterations = async () => {
		const addCount = getRandomInt(3, 7)
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
	}
	await doChangeIterations()
	await savePlaylist(page)
	await checkSongs(page, songs)

	await doChangeIterations()
	await savePlaylist(page)
	await checkSongs(
		page,
		songs,
		'Songs do not match after changes after second save'
	)

	await page.reload()
	await page.waitForLoadState('networkidle')

	await expect(
		page.getByRole('textbox', { name: 'Název playlistu' })
	).toHaveValue(name)

	await checkSongs(page, songs, 'Refreshed song list does not match')

	await doChangeIterations()
	await savePlaylist(page)
	await checkSongs(
		page,
		songs,
		'Songs do not match after changes after refresh'
	)

	await page.reload()
	await page.waitForLoadState('networkidle')

	await expect(
		page.getByRole('textbox', { name: 'Název playlistu' })
	).toHaveValue(name)

	await checkSongs(page, songs, 'Songs do not match after final refresh')
}

smartTest('Can edit a playlist 1', testEditing)
smartTest('Can edit a playlist 2', testEditing)
smartTest('Can edit a playlist 3', testEditing)
