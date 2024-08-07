'use client'
// import { useParams } from "react-router-dom";
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { useParams } from 'next/navigation'
import PlaylistPreview from './components/PlaylistPreview'
import { InnerPlaylistProvider } from './hooks/useInnerPlaylist'

export default SmartPage(PlaylistScreen, ['fullWidth', 'hideFooter'])

function PlaylistScreen() {
	const { guid } = useParams() as { guid: PlaylistGuid }

	return !guid ? null : (
		<InnerPlaylistProvider guid={guid}>
			<PlaylistPreview />
		</InnerPlaylistProvider>
	)
}
