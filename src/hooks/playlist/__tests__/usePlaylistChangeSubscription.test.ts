import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { renderHook } from '@testing-library/react'
import {
	PLAYLIST_CHANGE_EVENT_NAME,
	usePlaylistChangeSubscription,
} from '../usePlaylistChangeSubscription'

const fire = (hookId: string, playlistGuid: string) =>
	window.dispatchEvent(
		new CustomEvent(PLAYLIST_CHANGE_EVENT_NAME, {
			detail: { hookId, playlistGuid },
		})
	)

const GUID = 'g1' as PlaylistGuid

describe('usePlaylistChangeSubscription', () => {
	it('calls onChange for a foreign hookId on the same guid', () => {
		const onChange = jest.fn()
		renderHook(() =>
			usePlaylistChangeSubscription({
				guid: GUID,
				uniqueHookId: 'me',
				onChange,
			})
		)
		fire('other', GUID)
		expect(onChange).toHaveBeenCalledTimes(1)
	})

	it('ignores its own hookId and other guids', () => {
		const onChange = jest.fn()
		renderHook(() =>
			usePlaylistChangeSubscription({
				guid: GUID,
				uniqueHookId: 'me',
				onChange,
			})
		)
		fire('me', GUID)
		fire('other', 'g2')
		expect(onChange).not.toHaveBeenCalled()
	})

	it('does not subscribe when notFetch is true', () => {
		const onChange = jest.fn()
		renderHook(() =>
			usePlaylistChangeSubscription({
				guid: GUID,
				uniqueHookId: 'me',
				notFetch: true,
				onChange,
			})
		)
		fire('other', GUID)
		expect(onChange).not.toHaveBeenCalled()
	})

	it('removes its listener on unmount (no leak)', () => {
		const onChange = jest.fn()
		const { unmount } = renderHook(() =>
			usePlaylistChangeSubscription({
				guid: GUID,
				uniqueHookId: 'me',
				onChange,
			})
		)
		unmount()
		fire('other', GUID)
		expect(onChange).not.toHaveBeenCalled()
	})
})
