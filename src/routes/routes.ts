import { FRONTEND_URL } from '../api/constants'
import { RoutesKeys, SmartParams } from './routes.types'

export const getReplacedUrlWithParams = (
	url: string,
	params: { [key: string]: string }
) => {
	const queryParams: Record<string, string> = {}

	let result = url
	for (const key in params) {
		const initial = result
		result = result.replace(`[${key}]`, params[key])
		if (initial === result) {
			queryParams[key] = params[key]
		}
	}

	if (Object.keys(queryParams).length > 0) {
		const url = new URL(result)
		for (const key in queryParams) {
			url.searchParams.set(key, queryParams[key])
		}
		result = url.toString()
	}

	return result
}

export const getRouteUrlWithParams = <T extends RoutesKeys>(
	page: T,
	params: SmartParams<T>
) => {
	const url = routesPaths[page]
	return getReplacedUrlWithParams(FRONTEND_URL + url, params)
}

export const parseVariantAlias = (variantAlias: string) => {
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
	variant: '/p/[hex]/[alias]',
	playlist: '/playlist/[guid]',
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
	usersPlaylists: '/ucet/playlisty',
	usersSongs: '/ucet/pisne',
	songsList: '/seznam',
	test: '/test',
	testComponents: '/storybook',
} as const

// examples of searchParams, only, string and numbers allowed
export const routesSearchParams = {
	variant: {
		title: 'string',
	},
	login: {
		previousPage: 'string',
		message: 'string',
	},
	uploadParse: {
		files: ['', ''],
	},
}
