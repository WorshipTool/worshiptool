'use client'
import { BasicVariantPack, VariantPackGuid } from '@/api/dtos'
import PopupSongCard from '@/common/components/SongSelectPopup/components/PopupSongCard'
import { Box } from '@/common/ui'
import { Skeleton } from '@/common/ui/mui/Skeleton'
import { Typography } from '@/common/ui/Typography'
import { ApiState } from '@/tech/ApiState'
import './GlobalSongList.styles.css'

type GlobalSongListProps = {
	onSongSelect: (pack: BasicVariantPack) => void
	onSongDeselect: (pack: BasicVariantPack) => void
	selectedSongs: VariantPackGuid[]
	apiState: ApiState<BasicVariantPack[]>
	multiselect?: boolean
	items: BasicVariantPack[]
}

export default function PopupSongList(props: GlobalSongListProps) {
	return (
		<Box
			display={'flex'}
			flexDirection={'row'}
			gap={1}
			width={'100%'}
			className="global-song-list-container stylized-scrollbar"
		>
			{props.items.map((song) => {
				const onSelect = () => {
					props.onSongSelect(song)
				}
				const onDeselect = () => {
					props.onSongDeselect(song)
				}
				return (
					<PopupSongCard
						key={song.packGuid}
						song={song}
						onSelect={onSelect}
						onDeselect={onDeselect}
						selected={props.selectedSongs.includes(song.packGuid)}
					/>
				)
			})}

			{!props.apiState.loading && props.items.length === 0 && (
				<Box
					bgcolor={'grey.300'}
					padding={2}
					sx={{
						userSelect: 'none',
						borderRadius: 2,
					}}
					flex={1}
				>
					<Typography color="grey.700">Není z čeho vybírat...</Typography>
				</Box>
			)}

			{props.apiState.loading && (
				<Box flex={1} display={'flex'} flexDirection={'column'}>
					{/* <LinearProgress /> */}
					<Box flex={1} display={'flex'} flexDirection={'row'}>
						{Array.from({ length: 4 }).map((_, i) => (
							<Box key={i} padding={1}>
								<Skeleton
									variant="rectangular"
									height={116}
									width={140}
									sx={{
										borderRadius: 2,
									}}
								/>
							</Box>
						))}
					</Box>
				</Box>
			)}
		</Box>
	)
}
