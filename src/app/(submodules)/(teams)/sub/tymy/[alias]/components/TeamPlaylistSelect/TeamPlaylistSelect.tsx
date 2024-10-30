import { PlaylistData } from '@/api/generated'
import useUsersTeamPlaylists from '@/app/(submodules)/(teams)/sub/tymy/[alias]/hooks/useUsersTeamPlaylists'
import Menu from '@/common/components/Menu/Menu'
import { ComponentProps } from 'react'

type TeamPlaylistSelectProps = {
	open: boolean
	onClose: () => void
	anchor: HTMLElement | null
	onSelect: (playlist: PlaylistData) => void
	filterFunc?: (playlist: PlaylistData) => boolean
} & ComponentProps<typeof Menu>
export default function TeamPlaylistSelect(props: TeamPlaylistSelectProps) {
	const { playlists: allPlaylists } = useUsersTeamPlaylists()

	const playlists = props.filterFunc
		? allPlaylists.filter(props.filterFunc)
		: allPlaylists

	return (
		<Menu
			{...props}
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
