'use client'
import { Box, Typography, useTheme } from '@/common/ui'
import { styled } from '@/common/ui/mui'
import { Grid } from '@/common/ui/mui/Grid'
import { useEffect, useState } from 'react'
import ContainerGrid from '../../../../common/components/ContainerGrid'
import SongListCards, {
	SongListCardsProps,
} from '../../../../common/components/songLists/SongListCards/SongListCards'
import { Button } from '../../../../common/ui/Button'
import SongCardSkeleton from './SongCardSkeleton'
import useRecommendedSongs from './hooks/useRecommendedSongs'

const GridContainer = styled(Grid)(({ theme }) => ({
	padding: 10,
	paddingTop: 5,
}))

type RecommendedSongsListProps = {
	listType?: SongListCardsProps['variant']
}

export default function RecommendedSongsList({
	listType = 'row',
}: RecommendedSongsListProps) {
	const theme = useTheme()
	const { data, isLoading, isError, isSuccess } = useRecommendedSongs()

	// const navigate = useSmartNavigate()
	const [init, setInit] = useState(false)
	useEffect(() => {
		setInit(true)
	}, [])

	return (
		<ContainerGrid
			sx={{
				width: '100%',
			}}
		>
			{<Typography strong>Nějaký nápad:</Typography>}

			{isError && (
				<>
					<Typography>Při načítání se vyskytla chyba...</Typography>
				</>
			)}

			<GridContainer
				container
				columns={{ xs: 1, sm: 2, md: 4 }}
				sx={{ padding: 0 }}
			>
				{!init || isLoading ? (
					<Grid
						container
						columns={{ xs: 1, md: 2, lg: 4 }}
						spacing={1}
						sx={{
							width: `calc(100% + ${theme.spacing(2)})`,
						}}
					>
						{Array.from({ length: 4 }).map((_, i) => (
							<Grid item xs={1} key={i}>
								<SongCardSkeleton />
							</Grid>
						))}
					</Grid>
				) : null}
				<SongListCards
					data={data.slice(0, 4)}
					variant={listType}
					properties={['SHOW_ADDED_BY_LOADER']}
				/>
			</GridContainer>

			{init && (
				<Box
					display={'flex'}
					flexDirection={'row'}
					alignItems={'center'}
					flexWrap={'wrap'}
				>
					<Typography>Nebo si vyberte ze </Typography>
					<Button size="small" variant="text" to="songsList">
						Seznamu
					</Button>
					<Typography>všech písní ve zpěvníku</Typography>
				</Box>
			)}
		</ContainerGrid>
	)
}
