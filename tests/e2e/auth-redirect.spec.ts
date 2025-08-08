import test, { expect } from '@playwright/test'
import { test_tech_loginWithData } from '../test.tech'

test('Login redirection preserves original page after authentication', async ({ page }) => {
	// Step 1: Visit a protected song page while unauthenticated
	const songUrl = '/pisen/a6d46/mou-cestu-v-rukou-mas'
	await page.goto(songUrl)

	// Step 2: Should be redirected to login page with previousPage parameter
	await expect(page).toHaveURL(/\/prihlaseni\?previousPage=%2Fpisen%2Fa6d46%2Fmou-cestu-v-rukou-mas/)

	// Step 3: Login using test credentials
	await page.getByRole('textbox', { name: 'Zadejte e-mail' }).fill('test@test.cz')
	await page.getByRole('textbox', { name: 'Zadejte heslo' }).fill('test')
	
	const loginResponsePromise = page.waitForResponse(
		(resp) => resp.url().includes('/auth/login') && resp.status() === 201
	)
	
	await page.getByRole('button', { name: 'Přihlásit se' }).click()
	
	// Wait for login to complete
	await loginResponsePromise

	// Step 4: Should be redirected back to the original song page
	await expect(page).toHaveURL(songUrl)
	
	// Verify we're actually on the song page by checking for song-specific content
	await expect(page.getByText('Mou cestu v rukou máš')).toBeVisible()
})

test('Login redirection works for different song pages', async ({ page }) => {
	// Test with a different song to ensure it's not hardcoded
	const songUrl = '/pisen/26515/52k6a'
	await page.goto(songUrl)

	// Should be redirected to login page with correct previousPage parameter
	await expect(page).toHaveURL(/\/prihlaseni\?previousPage=%2Fpisen%2F26515%2F52k6a/)

	// Login using test credentials
	await page.getByRole('textbox', { name: 'Zadejte e-mail' }).fill('test@test.cz')
	await page.getByRole('textbox', { name: 'Zadejte heslo' }).fill('test')
	
	const loginResponsePromise = page.waitForResponse(
		(resp) => resp.url().includes('/auth/login') && resp.status() === 201
	)
	
	await page.getByRole('button', { name: 'Přihlásit se' }).click()
	
	// Wait for login to complete
	await loginResponsePromise

	// Should be redirected back to the original song page
	await expect(page).toHaveURL(songUrl)
})

test('Login redirection from home page goes to home after login', async ({ page }) => {
	// Visit home page and click login button directly (no redirection needed)
	await page.goto('/')
	
	// Click the login button from the toolbar
	await page.getByRole('button', { name: 'Přihlásit se' }).click()
	
	// Should be on login page without previousPage parameter
	await expect(page).toHaveURL('/prihlaseni')
	
	// Login using test credentials
	await page.getByRole('textbox', { name: 'Zadejte e-mail' }).fill('test@test.cz')
	await page.getByRole('textbox', { name: 'Zadejte heslo' }).fill('test')
	
	const loginResponsePromise = page.waitForResponse(
		(resp) => resp.url().includes('/auth/login') && resp.status() === 201
	)
	
	await page.getByRole('button', { name: 'Přihlásit se' }).click()
	
	// Wait for login to complete
	await loginResponsePromise

	// Should be redirected to home page (no specific previousPage)
	await expect(page).toHaveURL('/')
})