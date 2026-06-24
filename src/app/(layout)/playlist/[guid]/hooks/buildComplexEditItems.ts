import { PlaylistComplextEditItem } from '@/api/generated'
import { PlaylistItemDto } from '@/interfaces/playlist/playlist.types'

/**
 * Builds the complex-edit payload, attaching real `newData` (title + sheetData)
 * ONLY to items whose content actually changed vs. the original list. Unchanged
 * items get an EMPTY `newData` ({}), which the backend treats as "no content
 * change" and therefore skips the heavy per-song copy/version path.
 *
 * (The generated API client types `newData` as required, so unchanged items send
 * `{}` rather than omitting the field. The backend predicate ignores empty
 * newData, so this is equivalent to omitting it.)
 */
export const buildComplexEditItems = (
	items: PlaylistItemDto[],
	originalItems: PlaylistItemDto[]
): PlaylistComplextEditItem[] =>
	items.map((item) => {
		const original = originalItems.find((o) => o.guid === item.guid)
		const changed =
			!original ||
			original.pack.title !== item.pack.title ||
			original.pack.sheetData !== item.pack.sheetData

		return {
			packGuid: item.pack.packGuid,
			toneKey: item.toneKey,
			newData: changed
				? {
						title: item.pack.title,
						sheetData: item.pack.sheetData,
				  }
				: {},
		}
	})
