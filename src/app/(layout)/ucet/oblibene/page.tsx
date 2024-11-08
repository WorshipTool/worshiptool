'use client'
import FavouritesListOrderSelect, {
	FavouritesOrderOptions,
} from '@/app/(layout)/ucet/oblibene/components/FavouritesListOrderSelect'
import FavouritesRowItem from '@/app/(layout)/ucet/oblibene/components/FavouritesRowItem'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import Pager from '@/common/components/Pager/Pager'
import { Box, Typography } from '@/common/ui'
import { useFavourites } from '@/hooks/favourites/useFavourites'
import { useSelection } from '@/hooks/playlist/useSelection'
import { useUrlState } from '@/hooks/urlstate/useUrlState'
import { PlaylistGuid } from '@/interfaces/playlist/playlist.types'
import { useMemo } from 'react'

export default SmartPage(page, ['middleWidth', 'topPadding'])

function page() {
	const { selectionGuid } = useFavourites()

	const { items: allItems } = useSelection(selectionGuid as PlaylistGuid)

	const [sortOption, setSortOption] = useUrlState<FavouritesOrderOptions>(
		'sortKey',
		'addedAt'
	)

	// sort items
	const items = useMemo(() => {
		const arr = allItems.sort((a, b) => {
			if (sortOption === 'addedAt') {
				return a.order > b.order ? -1 : 1
			}
			if (sortOption === 'title') {
				return a.variant.preferredTitle.localeCompare(b.variant.preferredTitle)
			}
			return 0
		})
		return [...arr]
	}, [allItems, sortOption])

	return (
		<Box display={'flex'} flexDirection={'column'} gap={2}>
			<Box display={'flex'} gap={2} alignItems={'center'}>
				<Typography
					variant="h4"
					strong
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 1,
					}}
				>
					{/* <Favorite /> */}
					Mé oblíbené
				</Typography>

				<Typography thin color="grey.500">
					Celkem {items.length} písní
				</Typography>
				<Box flex={1} />

				<FavouritesListOrderSelect
					onChange={setSortOption}
					startValue={sortOption || undefined}
				/>
			</Box>

			{items.length === 0 ? (
				<Typography
					italic
					color="grey.500"
					sx={{
						textAlign: 'center',
					}}
				>
					Nemáte žádné oblíbené písně.
				</Typography>
			) : (
				<></>
			)}

			<Pager data={items} take={5}>
				{(part, loading, startIndex) => {
					return (
						<Box display={'flex'} flexDirection={'column'} gap={1}>
							{part.map((item, index) => {
								return (
									<FavouritesRowItem
										key={item.guid}
										data={item.variant}
										index={startIndex + index}
									/>
								)
							})}
						</Box>
					)
				}}
			</Pager>
		</Box>
	)
}
