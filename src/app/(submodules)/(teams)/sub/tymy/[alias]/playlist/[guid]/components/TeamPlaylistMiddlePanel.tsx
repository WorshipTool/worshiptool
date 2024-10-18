import { PlaylistItem } from '@/app/(layout)/playlist/[guid]/components/MiddlePanel/PlaylistItem'
import useInnerPlaylist from '@/app/(layout)/playlist/[guid]/hooks/useInnerPlaylist'
import useInnerTeam from '@/app/(submodules)/(teams)/sub/tymy/hooks/useInnerTeam'
import { Button } from '@/common/ui/Button'
import { parseVariantAlias } from '@/routes/routes.tech'
import { Box } from '@mui/material'
import { useMemo } from 'react'

export default function TeamPlaylistMiddlePanel() {
	const { items, loading } = useInnerPlaylist()
	const { alias } = useInnerTeam()

	const itemsArr = useMemo(
		() =>
			items
				?.sort((a, b) => {
					return a.order - b.order
				})
				.map((item, index) => {
					const parsedAlias = parseVariantAlias(item.variant.packAlias)
					return (
						<PlaylistItem
							key={item.guid}
							itemGuid={item.guid}
							openButton={
								<Button
									size="small"
									variant="text"
									to="teamSong"
									toParams={{
										hex: parsedAlias.hex,
										alias,
										'title-alias': parsedAlias.alias,
									}}
									tooltip="Otevřít píseň mimo playlist"
								>
									Otevřít
								</Button>
							}
						/>
					)
				}),
		[items]
	)

	return (
		<Box
			flex={1}
			position={'relative'}
			padding={2}
			paddingRight={4}
			paddingBottom={0}
		>
			{loading || !items ? <>Načítání...</> : <>{itemsArr}</>}
		</Box>
	)
}
