'use client'
import { TeamPageTitle } from '@/app/(subdomains)/sub/tymy/[alias]/components/TopPanel/components/TeamPageTitle'
import SearchFieldTeamZpevnik from '@/app/(subdomains)/sub/tymy/[alias]/zpevnik/components/SearchFieldTeamZpevnik'
import useInnerTeam from '@/app/(subdomains)/sub/tymy/hooks/useInnerTeam'
import SongListCards from '@/common/components/songLists/SongListCards/SongListCards'
import { Button } from '@/common/ui/Button'
import { Typography } from '@/common/ui/Typography'
import usePlaylist from '@/hooks/playlist/usePlaylist'
import { Add } from '@mui/icons-material'
import { Box } from '@mui/system'
import { useMemo } from 'react'

export default function TeamSongsPage() {
	const { selectionGuid } = useInnerTeam()
	const { items: playlistItems } = usePlaylist(selectionGuid)
	const items = useMemo(() => {
		return playlistItems.map((item) => item.variant)
	}, [playlistItems])

	return (
		<div>
			<TeamPageTitle>Zpěvník</TeamPageTitle>

			<Box display={'flex'} flexDirection={'column'}>
				{items.length > 0 && <SearchFieldTeamZpevnik />}

				<SongListCards data={items} />
				{items.length === 0 && (
					<Box gap={1} display={'flex'} flexDirection={'column'}>
						<Typography>Ve zpěvníku týmu nejsou žádné písně...</Typography>
						<Box display={'flex'}>
							<Button startIcon={<Add />} size="small" color="primarygradient">
								Přidat píseň
							</Button>
						</Box>
					</Box>
				)}
			</Box>
		</div>
	)
}
