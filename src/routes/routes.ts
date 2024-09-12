import { VariantPackAlias } from '@/api/dtos'
import { shouldUseSubdomains } from '@/routes/routes.tech'
import { note } from '@pepavlin/sheet-api'
import { Route } from 'nextjs-routes'
import { FRONTEND_URL } from '../api/constants'
import { RoutesKeys, SmartParams } from './routes.types'

export const changeUrlToSubdomains = (url: string): string => {
	// if the url is /sub/A/sub/B..., return B.A....
	const key = routesPaths.subdomain.split('/')[1]

	const uo = new URL(url, FRONTEND_URL)
	const pathname = uo.pathname

	const urlParts = pathname.split('/').filter((part) => part !== '')

	const subdomains = []

	let lastIndex = -1
	for (let i = 0; i < urlParts.length; i++) {
		if (urlParts[i] === key && urlParts[i + 1]) {
			subdomains.push(urlParts[i + 1])
			i++
			lastIndex = i + 1
		} else {
			break
		}
	}

	const leftParts = urlParts.slice(lastIndex < 0 ? 0 : lastIndex)

	const leftStr = leftParts.join('/')

	const urlObject = new URL(leftStr, FRONTEND_URL)
	subdomains.reverse()
	subdomains.push(urlObject.hostname)
	urlObject.hostname = subdomains.join('.')

	// add search params
	urlObject.search = uo.search

	const str = urlObject.toString()

	return str
}

// Input url has to be absolute
export const changeUrlFromSubdomains = (url: string): string => {
	const key = routesPaths.subdomain.split('/')[1]

	const uo = new URL(url)

	// get subdomains
	const subdomains = uo.hostname.split('.')
	subdomains.pop()

	const additional = subdomains
		.map((subdomain) => {
			return `${key}/${subdomain}`
		})
		.join('/')

	// Add to begining of pathname
	const pathname = uo.pathname
	const newUrl = new URL(additional + pathname, FRONTEND_URL)

	return newUrl.toString()
}

export const getReplacedUrlWithParams = (
	url: string,
	params: { [key: string]: string | undefined },
	options: { subdomains?: boolean } = {
		subdomains: true,
	}
) => {
	const queryParams: Record<string, string> = {}

	let result = url
	for (const key in params) {
		// Ignore undefined values
		if (params[key] === undefined) continue
		if (typeof params[key] !== 'string') continue

		const initial = result
		result = result.replace(`[${key}]`, params[key] as string)
		if (initial === result) {
			queryParams[key] = params[key] as string
		}
	}

	if (Object.keys(queryParams).length > 0) {
		const url = new URL(result, FRONTEND_URL)
		for (const key in queryParams) {
			url.searchParams.set(key, queryParams[key])
		}
		result = url.toString()
	}

	if (options?.subdomains && shouldUseSubdomains()) {
		result = changeUrlToSubdomains(result)
	}
	return result
}

export const getRouteUrlWithParams = <T extends RoutesKeys>(
	page: T,
	params: SmartParams<T>
) => {
	const url = routesPaths[page]
	let result = getReplacedUrlWithParams(FRONTEND_URL + url, params)

	return result
}

export const parseVariantAlias = (variantAlias: VariantPackAlias) => {
	const alias = variantAlias

	// Part before first -
	const hex = alias.split('-')[0]
	// Part after first - to the end
	const code = alias.split('-').slice(1).join('-')

	return { hex, alias: code }
}

export const COMMON_SETTINGS_URL = '/nastaveni'

export const routesPaths = {
	home: '/',
	variant: '/pisen/[hex]/[alias]',
	variantPublish: '/pisen/[hex]/[alias]/zverejnit',
	variantPrint: '/pisen/[hex]/[alias]/tisk',
	playlist: '/playlist/[guid]',
	playlistPrint: '/playlist/[guid]/tisk',
	playlistCards: '/playlist/[guid]/prezentace',
	group: '/skupina/[groupCode]',
	groupSettings: '/skupina/[groupCode]/nastaveni',
	documentation: '/dokumentace',
	addMenu: '/vytvorit',
	upload: '/nahrat',
	uploadParse: '/nahrat/hledani',
	writeSong: '/vytvorit/napsat',
	login: '/prihlaseni',
	signup: '/registrace',
	account: '/ucet',
	resetPassword: '/reset-hesla',
	resetPasswordToken: '/reset-hesla/[token]',
	usersPlaylists: '/ucet/playlisty',
	usersSongs: '/ucet/pisne',
	songsList: '/seznam',
	test: '/test',
	testComponents: '/storybook',
	subdomain: '/sub/[subdomain]',
	about: '/o-nas',
	contact: '/kontakt',
	teams: '/sub/tymy',

	team: '/sub/tymy/[alias]',
	teamSongbook: '/sub/tymy/[alias]/zpevnik',
	teamStatistics: '/sub/tymy/[alias]/statistiky',
	teamPeople: '/sub/tymy/[alias]/lide',
	teamSettings: '/sub/tymy/[alias]/nastaveni',
	teamJoin: '/sub/tymy/pripojitse/[code]',
} as const

// DONT REMOVE
const testTypes: Record<string, Route['pathname']> = routesPaths
if (!testTypes) console.log('This checks routes types', testTypes)

// examples of searchParams, only, string and numbers allowed
export const routesSearchParams = {
	login: {
		previousPage: 'string',
		message: 'string',
	},
	signup: {
		previousPage: 'string',
	},
	uploadParse: {
		files: ['', ''],
	},
	variantPrint: {
		key: 'a' as note | undefined,
		hideChords: 'false',
	},
	home: {
		hledat: 'string' as string | undefined,
	},
}
