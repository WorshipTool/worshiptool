import { FRONTEND_URL } from '@/api/constants'
import {
	getComplexReplacedUrlWithParams,
	getReplacedUrlWithParams,
	GetReplacedUrlWithParamsOptions,
} from '@/routes/tech/transformer.tech'

describe('getReplacedUrlWithParams', () => {
	it('should replace parameters in the URL', () => {
		const url = `${FRONTEND_URL}/page/[id]/details`
		const params = { id: '123' }
		const result = getReplacedUrlWithParams(url, params)
		expect(result).toBe(`${FRONTEND_URL}/page/123/details`)
	})
	it('should replace parameters in the URL', () => {
		const url = `/page/[id]/details`
		const params = { id: '123' }
		const result = getReplacedUrlWithParams(url, params, {
			returnSubdomains: 'never',
		})
		expect(result).toBe(`/page/123/details`)
	})
	it('should replace parameters in the URL', () => {
		const url = `/page/[id]/details`
		const params = { id: '123' }
		const result = getReplacedUrlWithParams(url, params, {
			returnFormat: 'relative',
			returnSubdomains: 'never',
		})
		expect(result).toBe(`/page/123/details`)
	})

	it('should add query parameters for unmatched keys', () => {
		const url = `${FRONTEND_URL}/page/[id]/details`
		const params = { id: '123', extra: 'value' }
		const result = getReplacedUrlWithParams(url, params)
		expect(result).toBe(`${FRONTEND_URL}/page/123/details?extra=value`)
	})

	it('should handle boolean query parameters', () => {
		const url = `${FRONTEND_URL}/page/[id]/details`
		const params = { id: '123', active: true }
		const result = getReplacedUrlWithParams(url, params)
		expect(result).toBe(`${FRONTEND_URL}/page/123/details?active=true`)
	})

	it('should return relative URL when returnFormat is "relative"', () => {
		const url = `${FRONTEND_URL}/page/[id]/details`
		const params = { id: '123' }
		const result = getReplacedUrlWithParams(url, params, {
			returnFormat: 'relative',
			returnSubdomains: 'never',
		})
		expect(result).toBe(`/page/123/details`)
	})

	it('should handle subdomains when returnSubdomains is on, no subdomains given', () => {
		const url = `${FRONTEND_URL}/page/[id]/details`
		const params = { id: '123' }

		const result = getReplacedUrlWithParams(url, params, {
			returnSubdomains: 'always', // always is never used on other places... use auto in real code
		})
		expect(result).toBe(`${FRONTEND_URL}/page/123/details`)
	})

	it('should handle subdomains when returnSubdomains is on', () => {
		const url = `${FRONTEND_URL}/sub/page/[id]/details`
		const params = { id: '123' }

		const result = getReplacedUrlWithParams(url, params, {
			returnSubdomains: 'always', // always is never used on other places... use auto in real code
		})
		expect(result).toBe(`http://page.test-chvalotce.cz:5500/123/details`)
	})

	it('should handle subdomains when returnSubdomains is on', () => {
		const url = `${FRONTEND_URL}/sub/page/[id]/details`
		const params = { id: '123' }

		const result = getReplacedUrlWithParams(url, params, {
			returnSubdomains: 'always', // always is never used on other places... use auto in real code
		})
		expect(result).toBe(`http://page.test-chvalotce.cz:5500/123/details`)
	})
})

describe('getComplexReplacedUrlWithParams', () => {
	it('should replace parameters in the URL and transform subdomains', () => {
		const url = `${FRONTEND_URL}/sub/page/[id]/details`
		const params = { id: '123' }
		const subdomainAliases = [
			{
				subdomain: 'test',
				pathname: '/sub/page',
			},
		]
		const result = getComplexReplacedUrlWithParams(url, params, {
			subdomainAliases,
			returnSubdomains: 'always',
		})
		expect(result).toBe(`http://test.test-chvalotce.cz:5500/123/details`)
	})

	it('complex replace with relative', () => {
		const url = `/sub/page/[id]/details`
		const params = { id: '123' }
		const subdomainAliases = [
			{
				subdomain: 'test',
				pathname: '/sub/page/123',
			},
		]
		const result = getComplexReplacedUrlWithParams(url, params, {
			subdomainAliases,
			returnSubdomains: 'never',
		})
		expect(result).toBe(`/sub/test/details`)
	})
})

it('should behave the same as getReplacedUrlWithParams when no subdomainAliases are provided', () => {
	const url = `${FRONTEND_URL}/page/[id]/details`
	const params = { id: '123', extra: 'value' }

	const result1 = getReplacedUrlWithParams(url, params)
	const result2 = getComplexReplacedUrlWithParams(url, params)

	expect(result2).toBe(result1)
})
describe('getComplexReplacedUrlWithParams matches getReplacedUrlWithParams without subdomainAliases', () => {
	it('handles relative URLs', () => {
		const url = `/page/[id]/details`
		const params = { id: '123', active: true }
		const options: GetReplacedUrlWithParamsOptions = {
			returnSubdomains: 'never',
		}

		const result1 = getReplacedUrlWithParams(url, params, options)
		const result2 = getComplexReplacedUrlWithParams(url, params, options)

		expect(result2).toBe(result1)
	})

	it('handles URLs without parameters', () => {
		const url = `${FRONTEND_URL}/static/page/details`
		const params = {}

		const result1 = getReplacedUrlWithParams(url, params)
		const result2 = getComplexReplacedUrlWithParams(url, params)

		expect(result2).toBe(result1)
	})

	it('handles boolean query parameters', () => {
		const url = `${FRONTEND_URL}/page/[id]/details`
		const params = { id: '123', active: false }

		const result1 = getReplacedUrlWithParams(url, params)
		const result2 = getComplexReplacedUrlWithParams(url, params)

		expect(result2).toBe(result1)
	})
})
