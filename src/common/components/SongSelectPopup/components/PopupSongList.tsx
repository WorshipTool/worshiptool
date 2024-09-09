'use client'
import { SongVariantDto, VariantPackGuid } from '@/api/dtos'
import PopupSongCard from '@/common/components/SongSelectPopup/components/PopupSongCard'
import { Typography } from '@/common/ui/Typography'
import { ApiState } from '@/tech/ApiState'
import { Box, LinearProgress } from '@mui/material'
import { useMemo } from 'react'
import './GlobalSongList.styles.css'

type GlobalSongListProps = {
	onSongSelect: (packGuid: VariantPackGuid, songTitle: string) => void
	onSongDeselect: (packGuid: VariantPackGuid) => void
	selectedSongs: VariantPackGuid[]
	apiState: ApiState<SongVariantDto[]>
	multiselect?: boolean
}

export default function PopupSongList(props: GlobalSongListProps) {
	const items = useMemo(() => {
		return props.apiState.data ?? []
	}, [props.apiState.data])

	return (
		<Box
			display={'flex'}
			flexDirection={'row'}
			gap={1}
			width={'100%'}
			className="global-song-list-container stylized-scrollbar"
		>
			{items.map((song) => {
				const onSelect = () => {
					props.onSongSelect(song.packGuid, song.preferredTitle)
				}
				const onDeselect = () => {
					props.onSongDeselect(song.packGuid)
				}
				return (
					<PopupSongCard
						key={song.guid}
						song={song}
						onSelect={onSelect}
						onDeselect={onDeselect}
						selected={props.selectedSongs.includes(song.packGuid)}
					/>
				)
			})}

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
	)
}
