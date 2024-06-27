import { Box, Button, ButtonGroup } from '@mui/material'
import { useMemo } from 'react'
import { SongVariantDto } from '../../../../../../api/dtos'
import useGroup from '../../../../../../hooks/group/useGroup'
import useCurrentPlaylist from '../../../../../../hooks/playlist/useCurrentPlaylist'
import { useSmartNavigate } from '../../../../../../routes/useSmartNavigate'

interface ToolbarHeaderSheetPageProps {
	variant: SongVariantDto
}

export default function ToolbarHeaderSheetPage(
	props: ToolbarHeaderSheetPageProps
) {
	const navigate = useSmartNavigate()

	const { isOn } = useGroup()
	const currentPlaylist = useCurrentPlaylist()
	const isInCurrentPlaylist = useMemo(() => {
		if (!props.variant) return false
		return currentPlaylist?.items.some(
			(v) => v.variant.guid === props.variant.guid
		)
	}, [currentPlaylist, props.variant])

	const addToCurrentPlaylist = () => {
		currentPlaylist.addVariant(props.variant.packGuid).then((d) => {
			currentPlaylist.reload()
		})
	}
	const removeFromCurrentPlaylist = () => {
		currentPlaylist.removeVariant(props.variant.packGuid).then((d) => {
			currentPlaylist.reload()
		})
	}

	const openPlaylist = () => {
		navigate('playlist', {
			guid: currentPlaylist.guid,
		})
	}

	return (
		<Box display={'flex'} flexDirection={'row'}>
			{currentPlaylist.isOn && isOn && (
				<>
					<ButtonGroup>
						<Button
							color="secondary"
							size="small"
							variant="contained"
							onClick={openPlaylist}
						>
							Otevřít playlist
						</Button>
						{isInCurrentPlaylist ? (
							<>
								<Button
									color="error"
									variant="contained"
									size="small"
									onClick={removeFromCurrentPlaylist}
								>
									Odebrat z playlistu
								</Button>
							</>
						) : (
							<>
								<Button
									color="secondary"
									size="small"
									onClick={addToCurrentPlaylist}
								>
									Přidat do playlistu
								</Button>
							</>
						)}
					</ButtonGroup>
				</>
			)}
		</Box>
	)
}
