'use client'
import { SongVariantDto, VariantPackGuid } from '@/api/dtos'
import { theme } from '@/common/constants/theme'
import { IconButton } from '@/common/ui/IconButton'
import { Typography } from '@/common/ui/Typography'
import { parseVariantAlias } from '@/routes'
import { ApiState } from '@/tech/ApiState'
import { OpenInNew } from '@mui/icons-material'
import { Box, LinearProgress, alpha } from '@mui/material'
import { useMemo } from 'react'
import './GlobalSongList.styles.css'

type UsersSongListProps = {
	onSongSelect: (packGuid: VariantPackGuid, songTitle: string) => void
	onSongDeselect: (packGuid: VariantPackGuid) => void
	selectedSongs: VariantPackGuid[]
	apiState: ApiState<SongVariantDto[]>
}

export default function UsersSongList(props: UsersSongListProps) {
	const onSongClick = (song: SongVariantDto) => {
		if (props.selectedSongs.includes(song.packGuid)) {
			props.onSongDeselect(song.packGuid)
			return
		}
		props.onSongSelect(song.packGuid, song.preferredTitle)
	}

	const items = useMemo(() => {
		return props.apiState.data ?? []
	}, [props.apiState.data])

	const LINK_ICON_OFFSET = 0

	return (
		<Box>
			<Box
				display={'flex'}
				flexDirection={'row'}
				gap={1}
				width={'100%'}
				className="global-song-list-container"
			>
				{items.map((song) => (
					<Box
						key={song.guid}
						sx={{
							borderRadius: 3,
							minWidth: 150,
							maxWidth: 180,
							maxHeight: 130,
							borderStyle: 'solid',
							cursor: 'pointer',
							...(props.selectedSongs.includes(song.packGuid)
								? {
										// Selected

										borderColor: 'primary.main',
										bgcolor: alpha(theme.palette.primary.main, 0.1),
										borderWidth: 2,
								  }
								: {
										// Not selected
										bgcolor: 'grey.100',
										borderColor: 'grey.200',
										borderWidth: 1,
								  }),
						}}
						onClick={() => onSongClick(song)}
						position={'relative'}
						className="global-song-list-item"
					>
						<Box
							sx={{
								position: 'absolute',
								top: LINK_ICON_OFFSET,
								right: LINK_ICON_OFFSET,
								borderRadius: 3,
								bgcolor: 'grey.100',
								padding: 1,
								pointerEvents: 'none',
							}}
							className="global-song-list-link-icon"
						>
							<IconButton
								size="small"
								to="variant"
								tooltip="Otevřít v novém okně"
								toParams={parseVariantAlias(song.packAlias)}
								target="_blank"
								sx={{
									pointerEvents: 'auto',
								}}
								onClick={(e) => e.stopPropagation()}
							>
								<OpenInNew
									sx={{
										fontSize: '1.1rem',
									}}
								/>
							</IconButton>
						</Box>
						<Box
							padding={2}
							display={'flex'}
							flexDirection={'column'}
							height={'calc(100% - 2*2*8px)'}
						>
							<Typography
								strong
								sx={{
									textOverflow: 'ellipsis',
									overflow: 'hidden',
									userSelect: 'none',
									display: '-webkit-box',
									WebkitBoxOrient: 'vertical',
									WebkitLineClamp: 2,
								}}
							>
								{song.preferredTitle}
							</Typography>

							<Typography
								// size={'small'}
								sx={{
									textOverflow: 'ellipsis',
									overflow: 'hidden',
									userSelect: 'none',
									flex: 1,
								}}
							>
								{song.sheet.getSections()[0].text}
							</Typography>
						</Box>
					</Box>
				))}

				{!props.apiState.loading && items.length === 0 && (
					<Box
						bgcolor={'grey.300'}
						padding={1}
						sx={{
							userSelect: 'none',
						}}
						flex={1}
					>
						<Typography color="grey.700">Není z čeho vybírat...</Typography>
					</Box>
				)}

				{props.apiState.loading && (
					<Box flex={1}>
						<LinearProgress />
					</Box>
				)}
			</Box>
		</Box>
	)
}
