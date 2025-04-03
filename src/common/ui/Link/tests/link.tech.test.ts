import { getUrlWithSubdomainPathnameAliases } from '@/common/ui/Link/link.tech'
import { SubdomainData } from '@/routes/subdomains/SubdomainPathnameAliasProvider'

describe('Most basic absolute', () => {
	const IN_URL = 'http://test-chvalotce.cz:5500/sub/tymy/9r78ets'
	const OUTPUT_URL = 'http://test-chvalotce.cz:5500/sub/13ka'

	const alias: SubdomainData = {
		subdomain: '13ka',
		pathname: '/sub/tymy/9r78ets',
	}
	const output = getUrlWithSubdomainPathnameAliases(IN_URL, [alias])

	it('should return correct url', () => {
		expect(output).toBe(OUTPUT_URL)
	})
})

describe('Most basic relative', () => {
	const IN_URL = '/sub/tymy/9r78ets'
	const OUTPUT_URL = '/sub/13ka'

	const alias: SubdomainData = {
		subdomain: '13ka',
		pathname: '/sub/tymy/9r78ets',
	}
	const output = getUrlWithSubdomainPathnameAliases(IN_URL, [alias])

	it('should return correct url', () => {
		expect(output).toBe(OUTPUT_URL)
	})
})
