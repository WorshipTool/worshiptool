import { GetTeamStatisticsOutDto } from '@/api/generated'
import TeamStatisticsCard from '@/app/(submodules)/(teams)/sub/tymy/(teampage)/[alias]/statistiky/components/TeamStatisticsCard'
import OnlyAdmin from '@/common/components/OnlyAdmin'
import { Box, Gap, Typography } from '@/common/ui'

type MostFavouritesSongsCardProps = {
	data: GetTeamStatisticsOutDto['mostFavouriteSongs']
}

export default function MostFavouritesSongsCard(
	props: MostFavouritesSongsCardProps
) {
	const items = props.data
		.sort((a, b) => b.favouriteCount - a.favouriteCount)
		.filter((item) => item.favouriteCount > 0)
		.slice(0, 5)
	return (
		<TeamStatisticsCard label="Nejoblíbenější písně">
			<Gap value={0.5} />
			{items.length < 3 ? (
				<>
					<Typography italic>Data nejsou k dizpozici</Typography>
					<Box display={'flex'}>
						<OnlyAdmin notCollapse>
							<Typography italic small>
								Pro zobrazení trendů je potřeba mít alespoň 3 písně v tymu v
								oblíbených
							</Typography>
						</OnlyAdmin>
					</Box>
				</>
			) : (
				<>
					{items.map((item, index) => (
						<Typography key={item.song.title} {...(index === 0 ? {} : {})}>
							{index + 1}. {item.song.title}
						</Typography>
					))}
				</>
			)}
		</TeamStatisticsCard>
	)
}
