import { it } from 'node:test'
import { changeUrlFromSubdomains, changeUrlToSubdomains } from '../routes'

// Create test
describe('changeUrlToSubdomains', () => {
	it('should change url to subdomains', () => {
		const url = 'http://localhost:5500/sub/tymy'

		const changed = changeUrlToSubdomains(url)

		expect(changed).toBe('http://tymy.localhost:5500/')
	})
	it('should change url to subdomains', () => {
		const url = 'http://localhost:5500/sub/tymy/ahoj'

		const changed = changeUrlToSubdomains(url)

		expect(changed).toBe('http://tymy.localhost:5500/ahoj')
	})
	it('should change url to subdomains', () => {
		const url = 'http://localhost:5500/sub/a/b?c=d'

		const changed = changeUrlToSubdomains(url)

		expect(changed).toBe('http://a.localhost:5500/b?c=d')
	})
	it('should change url from subdomains', () => {
		const url = 'http://ahoj.localhost:5500'

		const changed = changeUrlFromSubdomains(url)
		expect(changed).toBe('http://localhost:5500/sub/ahoj/')
	})
})
