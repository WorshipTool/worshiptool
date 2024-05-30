import { note } from '@pepavlin/sheet-api'
import { Route } from 'nextjs-routes'
import { FRONTEND_URL } from '../api/constants'
import { RoutesKeys, SmartParams } from './routes.types'

export const getReplacedUrlWithParams = (
	url: string,
	params: { [key: string]: string | undefined }
) => {
	const queryParams: Record<string, string> = {}

	let result = url
	for (const key in params) {
		// Ignore undefined values
		if (params[key] === undefined) continue

		const initial = result
		result = result.replace(`[${key}]`, params[key])
		if (initial === result) {
			queryParams[key] = params[key]
		}
	}

	if (Object.keys(queryParams).length > 0) {
		const url = new URL(result, FRONTEND_URL)
		// TODO: Fix this. It not return relative path, if relative is input
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
	variant: '/pisen/[hex]/[alias]',
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
	usersPlaylists: '/ucet/playlisty',
	usersSongs: '/ucet/pisne',
	songsList: '/seznam',
	test: '/test',
	testComponents: '/storybook',
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
	uploadParse: {
		files: ['', ''],
	},
	variantPrint: {
		key: 'a' as note | undefined,
	},
}
