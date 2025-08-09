import { note } from '@pepavlin/sheet-api'
import { Route } from 'nextjs-routes'

export const COMMON_SETTINGS_URL = '/nastaveni'

export const routesPaths = {
	home: '/',
	variant: '/pisen/[hex]/[alias]',
	variantPublish: '/pisen/[hex]/[alias]/zverejnit',
	variantPrint: '/pisen/[hex]/[alias]/tisk',
	variantPresentation: '/pisen/[hex]/[alias]/prezentace',
	variantPreviewImage: '/pisen/[hex]/[alias]/preview-image',
	playlist: '/playlist/[guid]',
	playlistPrint: '/playlist/[guid]/tisk',
	playlistCards: '/playlist/[guid]/prezentace',
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
	usersFavourites: '/ucet/oblibene',
	songsList: '/seznam',
	test: '/test',
	testComponents: '/storybook',
	subdomain: '/sub/[subdomain]',
	about: '/o-nas',
	contact: '/kontakt',
	teams: '/sub/tymy',
	admin: '/sub/admin',
	adminPack: '/sub/admin/pisen/[hex]/[alias]',
	adminSong: '/sub/admin/pisen/rodina/[songGuid]',
	adminSongs: '/sub/admin/pisne',
	adminCreateSong: `/sub/admin/pisen/vytvorit`,
	adminPublishApproval: '/sub/admin/ke-schvaleni',
	adminLastAdded: '/sub/admin/posledni-pridane',

	team: '/sub/tymy/[alias]',
	teamSongbook: '/sub/tymy/[alias]/zpevnik',
	teamStatistics: '/sub/tymy/[alias]/statistiky',
	teamPeople: '/sub/tymy/[alias]/lide',
	teamSettings: '/sub/tymy/[alias]/nastaveni',
	teamJoin: '/sub/tymy/pripojitse/[code]',
	teamSong: '/sub/tymy/[alias]/pisen/[hex]/[title-alias]',
	teamPlaylist: '/sub/tymy/[alias]/playlist/[guid]',
	teamPlaylistCards: '/sub/tymy/[alias]/playlist/[guid]/prezentace',
	teamPlaylists: '/sub/tymy/[alias]/playlisty',
	teamPublic: '/sub/tymy/v/[alias]',
	teamPublicSong: '/sub/tymy/v/[alias]/pisen/[hex]/[title-alias]',
} as const

// DONT REMOVE
// const testTypes: Record<string, Route['pathname']> = routesPaths
// if (!testTypes) console.log('This checks routes types', testTypes)

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
	playlistPrint: {
		landscapeMode: false as boolean | undefined,
	},
	contact: {
		wantToJoin: false as boolean | undefined,
	},
	songsList: {
		s: 0 as number | undefined,
	},
}
