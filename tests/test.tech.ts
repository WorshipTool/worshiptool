import { FRONTEND_URL } from '@/api/constants'
import { loginResultDTOToUser } from '@/api/dtos/dtosAuth'
import { JwtResult } from '@/api/generated'
import { UserDto } from '@/interfaces/user'
import { expect, Page } from '@playwright/test'

export const test_tech_loginWithData = async (
	page: Page,
	email: string = 'test@test.cz',
	password: string = 'test'
): Promise<UserDto> => {
	// Přihlášení
	await expect(page.getByRole('button', { name: 'Přihlásit se' })).toBeVisible()
	await page.getByRole('button', { name: 'Přihlásit se' }).click()
	await page.getByRole('textbox', { name: 'Zadejte e-mail' }).fill(email)
	await page.getByRole('textbox', { name: 'Zadejte heslo' }).fill(password)
	await page.getByRole('button', { name: 'Přihlásit se' }).click()

	const loginResponsePromise = page.waitForResponse(
		(resp) => resp.url().includes('/auth/login') && resp.status() === 201
	)

	// Získání odpovědi
	const loginResponse = await loginResponsePromise
	const responseData: JwtResult = await loginResponse.json()

	await page.waitForLoadState('networkidle')

	return loginResultDTOToUser(responseData)
}



export const getTestBaseUrlHostname = () => {
	return FRONTEND_URL.replace(/^https?:\/\//, '')
}
export const getTestBaseUrlProtocol = () => {
	return FRONTEND_URL.startsWith('https') ? 'https' : 'http'
}
