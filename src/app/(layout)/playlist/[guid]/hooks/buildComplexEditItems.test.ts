import { PlaylistItemDto } from '@/interfaces/playlist/playlist.types'
import { buildComplexEditItems } from './buildComplexEditItems'

const item = (
	guid: string,
	packGuid: string,
	title: string,
	sheetData: string,
	toneKey = 'C'
): PlaylistItemDto =>
	({
		guid,
		toneKey,
		order: 0,
		pack: { packGuid, title, sheetData },
	} as unknown as PlaylistItemDto)

describe('buildComplexEditItems', () => {
	it('sends empty newData ({}) for unchanged items', () => {
		const original = [item('a', 'pa', 'T', 'S')]
		const result = buildComplexEditItems(original, original)
		expect(result).toEqual([{ packGuid: 'pa', toneKey: 'C', newData: {} }])
		expect(result[0].newData).toEqual({})
	})

	it('includes real newData only for content-changed items', () => {
		const original = [item('a', 'pa', 'T', 'S'), item('b', 'pb', 'U', 'X')]
		const next = [item('a', 'pa', 'T2', 'S'), item('b', 'pb', 'U', 'X')]
		const result = buildComplexEditItems(next, original)
		expect(result[0]).toEqual({
			packGuid: 'pa',
			toneKey: 'C',
			newData: { title: 'T2', sheetData: 'S' },
		})
		expect(result[1].newData).toEqual({})
	})

	it('treats a brand-new item (no original) as changed', () => {
		const result = buildComplexEditItems([item('a', 'pa', 'T', 'S')], [])
		expect(result[0].newData).toEqual({ title: 'T', sheetData: 'S' })
	})
})
