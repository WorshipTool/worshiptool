'use client'
// import { useParams } from "react-router-dom";
import { useParams } from 'next/navigation'
import PlaylistPreview from './components/PlaylistPreview'
import { InnerPlaylistProvider } from './hooks/useInnerPlaylist'

export default function PlaylistScreen() {
	const { guid }: { guid: string } = useParams()

	return !guid ? null : (
		<InnerPlaylistProvider guid={guid}>
			<PlaylistPreview />
		</InnerPlaylistProvider>
	)
}
