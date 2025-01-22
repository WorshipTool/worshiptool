import { VariantPackAlias, VariantPackGuid } from '@/api/dtos'
import { GetListSongData } from '@/api/generated'
import { Box, Divider, Typography } from '@/common/ui'
import { Paper, styled } from '@/common/ui/mui'
import { heartColor } from '@/common/ui/SongCard/components/HeartLikeButton'
import DraggableSong from '@/hooks/dragsong/DraggableSong'
import useFavourite from '@/hooks/favourites/useFavourite'
import { parseVariantAlias } from '@/routes/routes.tech'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { Favorite } from '@mui/icons-material'

const StyledPaper = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.grey[100],

	padding: '0.6rem',
	'&:hover': {
		backgroundColor: theme.palette.grey[200],
		boxShadow: `0px 0px 7px ${theme.palette.grey[600]}`,
	},
	cursor: 'pointer',
}))

export type AllSongItemProps = {
	data: GetListSongData
	index: number
}
export default function AllSongItem({ data: s, index }: AllSongItemProps) {
	const navigate = useSmartNavigate()
	const isFavorite = useFavourite(s.packGuid as VariantPackGuid)

	return (
		<DraggableSong
			data={{
				packGuid: s.packGuid as VariantPackGuid,
				title: s.title,
				alias: s.alias as VariantPackAlias,
			}}
		>
			<StyledPaper
				onClick={() => {
					navigate('variant', {
						...parseVariantAlias(s.alias as VariantPackAlias),
					})
				}}
			>
				<Box display={'flex'} gap={1}>
					<Typography strong>{index}</Typography>
					<Divider orientation="vertical" flexItem />
					<Typography
						strong={300}
						noWrap
						sx={{
							flex: 1,
						}}
					>
						{s.title}{' '}
					</Typography>

					{isFavorite && (
						<Favorite
							color={'inherit'}
							sx={{
								color: heartColor,
							}}
						/>
					)}
				</Box>
			</StyledPaper>
		</DraggableSong>
	)
}
