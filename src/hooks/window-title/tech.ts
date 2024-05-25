import { TemplateString } from 'next/dist/lib/metadata/types/metadata-types'
import { generateMetadata as documentationMetadata } from '../../app/dokumentace/page'
import { metadata as home } from '../../app/layout'
import { generateMetadata as upload } from '../../app/nahrat/layout'
import { generateMetadata as variant } from '../../app/pisen/[hex]/[alias]/layout'
import { generateMetadata as playlist } from '../../app/playlist/[guid]/layout'
import { generateMetadata as playlistCards } from '../../app/playlist/[guid]/prezentace/layout'
import { generateMetadata as login } from '../../app/prihlaseni/layout'
import { generateMetadata as signup } from '../../app/registrace/layout'
import { generateMetadata as group } from '../../app/skupina/[groupCode]/layout'
import { generateMetadata as account } from '../../app/ucet/layout'
import { generateMetadata as usersSongs } from '../../app/ucet/pisne/layout'
import { generateMetadata as usersPlaylists } from '../../app/ucet/playlisty/layout'
import { generateMetadata as addMenu } from '../../app/vytvorit/layout'
import { generateMetadata as writeSong } from '../../app/vytvorit/napsat/layout'
import { MetadataProps } from '../../common/types'
import { RoutesKeys, routesPaths } from '../../routes'
import { WINDOW_TITLE_DIVIDER } from './constants'

/**
 * DON'T FORGET register title in window-title/tech.ts file, in getTitleOfType function
 */
export const generateMetadataTitle = async <T extends RoutesKeys>(
	title: string,
	location: T,
	params: MetadataProps<T>['params']
): Promise<string> => {
	// convert T to string
	const parent = getParentRoute(location)
	const parentTitle = parent ? await getTitleOfType(parent, params) : null

	if (parentTitle) {
		return title + WINDOW_TITLE_DIVIDER + parentTitle
	}

	return title
}

const getParentRoute = <T extends RoutesKeys>(
	location: T
): RoutesKeys | null => {
	const url = routesPaths[location]

	let maxLen = 0
	let parent: RoutesKeys | null = null
	for (const k in routesPaths) {
		const key = k as RoutesKeys

		if (key === location) continue
		if (url.includes(routesPaths[key])) {
			const len = routesPaths[key].length
			if (len > maxLen) {
				maxLen = len
				parent = key
			}
		}
	}

	return parent
}

const getTitleOfType = async <T extends RoutesKeys>(
	location: T,
	params: MetadataProps<T>['params']
): Promise<string | TemplateString | null | undefined> => {
	if (location === 'home') return home.title
	if (location === 'documentation') return (await documentationMetadata()).title
	if (location === 'upload') return (await upload()).title
	if (location === 'login') return (await login()).title
	if (location === 'signup') return (await signup({ params } as any)).title
	if (location === 'account') return (await account()).title
	if (location === 'usersSongs') return (await usersSongs()).title
	if (location === 'usersPlaylists') return (await usersPlaylists()).title
	if (location === 'addMenu') return (await addMenu()).title
	if (location === 'writeSong') return (await writeSong()).title
	if (location === 'variant') return (await variant({ params } as any)).title
	if (location === 'playlist') return (await playlist({ params } as any)).title
	if (location === 'playlistCards')
		return (await playlistCards({ params } as any)).title
	if (location === 'group') return (await group({ params } as any)).title

	return null
}
