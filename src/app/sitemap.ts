import type { MetadataRoute } from 'next'
import { ListSongData, SongGettingApi } from '../api/generated'
import {
	getRouteUrlWithParams,
	parseVariantAlias,
	routesPaths,
} from '../routes/routes'
import { handleApiCall } from '../tech/handleApiCall'

export const revalidate = 60 * 60 // 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const BASE_URL = 'https://chvalotce.cz'

	const api = new SongGettingApi()
	let songs: ListSongData[] = []
	try {
		songs = await handleApiCall(api.songGettingControllerGetList())
	} catch (e) {
		console.warn('Failed to fetch songs for sitemap -> ignoring songs', e)
	}

	const date = new Date()

	const songsMap = songs.map((s) => ({
		url: getRouteUrlWithParams('variant', parseVariantAlias(s.alias)),
		lastModified: date,
		changeFrequency: 'monthly',
		priority: 0.8,
	}))
	return [
		{
			url: `${BASE_URL}/`,
			lastModified: date,
			changeFrequency: 'yearly',
			priority: 1,
		},
		{
			url: `${BASE_URL}${routesPaths['songsList']}`,
			lastModified: date,
			changeFrequency: 'weekly',
			priority: 0.7,
		},
		{
			url: `${BASE_URL}${routesPaths['documentation']}`,
			lastModified: date,
			changeFrequency: 'monthly',
			priority: 0.2,
		},
		{
			url: `${BASE_URL}${routesPaths['login']}`,
			lastModified: date,
			changeFrequency: 'yearly',
			priority: 0.3,
		},
		{
			url: `${BASE_URL}${routesPaths['signup']}`,
			lastModified: date,
			changeFrequency: 'yearly',
			priority: 0.4,
		},
		{
			url: `${BASE_URL}${routesPaths['addMenu']}`,
			lastModified: date,
			changeFrequency: 'yearly',
			priority: 0.6,
		},
		{
			url: `${BASE_URL}${routesPaths['upload']}`,
			lastModified: date,
			changeFrequency: 'yearly',
			priority: 0.6,
		},

		...(songsMap as any),
	]
}
