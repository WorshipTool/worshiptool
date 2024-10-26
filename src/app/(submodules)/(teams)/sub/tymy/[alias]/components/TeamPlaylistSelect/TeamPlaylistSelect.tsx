import { PlaylistData } from '@/api/generated'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/hooks/useInnerTeam'
import Menu from '@/common/components/Menu/Menu'
import { useUsersPlaylists } from '@/hooks/playlist/useUsersPlaylists'
import { useMemo } from 'react'

type TeamPlaylistSelectProps = {
	open: boolean
	onClose: () => void
	anchor: HTMLElement | null
	onSelect: (playlist: PlaylistData) => void
}
export default function TeamPlaylistSelect(props: TeamPlaylistSelectProps) {
	const { playlists: allUsersPlaylists } = useUsersPlaylists()
	const { guid } = useInnerTeam()

	const playlists = useMemo(() => {
		return (
			allUsersPlaylists?.filter((p, i) => {
				return p.teamGuid === guid
			}) || []
		)
	}, [allUsersPlaylists])

	return (
		<Menu
			open={props.open}
			onClose={props.onClose}
			anchor={props.anchor}
			items={[
				...playlists.map((playlist) => ({
					title: playlist.title,
					onClick: () => {
						props.onSelect(playlist)
					},
				})),
				...(playlists.length === 0
					? [{ title: 'Žadný playlist k vybrání', disabled: true }]
					: []),
			]}
		></Menu>
	)
}
