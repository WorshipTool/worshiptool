'use client'
import TeamQuickActionButton from '@/app/(submodules)/(teams)/sub/tymy/[alias]/components/QuickActions/TeamQuickActionButton'
import { Link } from '@/common/ui/Link/Link'
import useCurrentPlaylist from '@/hooks/playlist/useCurrentPlaylist'
import { useSmartParams } from '@/routes/useSmartParams'
import { Edit } from '@mui/icons-material'

export default function TeamCurrentPlaylistQuickButton() {
	const { alias } = useSmartParams('team')
	const { guid, title, isOn, playlist } = useCurrentPlaylist()

	return !isOn ||
		!playlist?.teamAlias ||
		playlist.teamAlias !== alias ? null : (
		<Link to="teamPlaylist" params={{ alias, guid }}>
			<TeamQuickActionButton
				color="secondary"
				label={'Editovat playlist'}
				secondaryLabel={title}
				tooltip={'Editujte váš rozpracovaný playlist'}
				icon={<Edit />}
			/>
		</Link>
	)
}
