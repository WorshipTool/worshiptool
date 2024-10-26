import { note } from '@pepavlin/sheet-api'
import { Route } from 'nextjs-routes'

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
	teamSong: '/sub/tymy/[alias]/pisen/[hex]/[title-alias]',
	teamPlaylist: '/sub/tymy/[alias]/playlist/[guid]',
	teamPlaylists: '/sub/tymy/[alias]/playlisty',
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
		hideChords: false as boolean | undefined,
	},
	home: {
		hledat: 'string' as string | undefined,
	},
	teamSong: {
		edit: true,
	},
	teamPlaylists: {
		openedEvent: 'string' as string | undefined,
	},
}
