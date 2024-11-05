'use client'
import CreateNewMySongButton from '@/app/(layout)/ucet/pisne/components/CreateNewMySongButton'
import MySongItem from '@/app/(layout)/ucet/pisne/components/MySongItem'
import MySongListOrderSelect, {
	MySongsOrderOptions,
} from '@/app/(layout)/ucet/pisne/components/MySongListOrderSelect'
import MySongsFilterPanel, {
	MySongFilterOption,
} from '@/app/(layout)/ucet/pisne/components/MySongsFilterPanel'
import Pager from '@/common/components/Pager/Pager'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Typography } from '@/common/ui/Typography'
import { useUrlState } from '@/hooks/urlstate/useUrlState'
import { useApiStateEffect } from '@/tech/ApiState'
import { Box, LinearProgress } from '@mui/material'
import { useMemo, useState } from 'react'
import { mapSongVariantDataOutDtoToSongVariantDto } from '../../../../api/dtos'
import { useApi } from '../../../../hooks/api/useApi'
import { handleApiCall } from '../../../../tech/handleApiCall'

export default SmartPage(MySongsList, ['middleWidth'])

function MySongsList() {
	const { songGettingApi } = useApi()

	const [sortOption, setSortOption] = useUrlState<MySongsOrderOptions>(
		'sortKey',
		'updatedAt'
	)

	const [{ data: allVariants, loading }] = useApiStateEffect(async () => {
		const result = await handleApiCall(
			songGettingApi.songGettingControllerGetSongListOfUser()
		)
		const variants = result.variants.map((variant) => {
			return mapSongVariantDataOutDtoToSongVariantDto(variant)
		})
		return variants
	})

	const [filters, setFilters] = useState<MySongFilterOption[]>([])

	const filteredVariants = useMemo(() => {
		return allVariants?.filter((variant) => {
			return filters.length > 0
				? filters.some((filter) => {
						if (filter === 'public') {
							return variant.public
						}
						if (filter === 'private') {
							return !variant.public
						}
						return false
				  })
				: true
		})
	}, [allVariants, filters])

	const variants = useMemo(() => {
		const arr =
			(sortOption === 'updatedAt'
				? filteredVariants?.sort((a, b) => {
						return (
							new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
						)
				  })
				: sortOption === 'createdAt'
				? filteredVariants?.sort((a, b) => {
						return (
							new Date(b.packCreatedAt).getTime() -
							new Date(a.packCreatedAt).getTime()
						)
				  })
				: sortOption === 'title'
				? filteredVariants?.sort((a, b) => {
						return a.preferredTitle.localeCompare(b.preferredTitle)
				  })
				: filteredVariants) || []

		return [...arr]
	}, [filteredVariants, sortOption])

	try {
		return (
			<Box paddingTop={7} display={'flex'} flexDirection={'column'} gap={3}>
				<Box display={'flex'} flexDirection={'column'} gap={2}>
					<Box display={'flex'} gap={2} alignItems={'end'} flexWrap={'wrap'}>
						<Typography variant="h4" strong={600}>
							Moje písně
						</Typography>

						{!loading && (
							<Typography thin color="grey.500">
								Celkem {variants?.length} písní
							</Typography>
						)}

						<MySongListOrderSelect
							onChange={setSortOption}
							startValue={sortOption || undefined}
						/>

						{filters.length === 0 && (
							<MySongsFilterPanel
								addedFilters={filters}
								onChange={setFilters}
							/>
						)}

						<Box flex={1} />

						<CreateNewMySongButton />
					</Box>
					{filters.length > 0 && (
						<MySongsFilterPanel addedFilters={filters} onChange={setFilters} />
					)}
				</Box>

				{loading && (
					<>
						<LinearProgress />
					</>
				)}
				<Pager data={variants || []} take={5}>
					{(variants, loading, startIndex) => {
						return (
							<Box display={'flex'} flexDirection={'column'} gap={1}>
								{variants.map((variant, index) => {
									return (
										<MySongItem
											variant={variant}
											index={index + startIndex}
											key={`mysong${variant.guid}`}
										/>
									)
								})}
							</Box>
						)
					}}
				</Pager>
				{/* {variants.map((variant, index) => {
					return (
						<MySongItem
							variant={variant}
							index={index}
							key={`mysong${variant.guid}`}
						></MySongItem>
					)
				})}

				{variants.length == 0 && (
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							gap: 2,
						}}
					>
						<Typography>Nemáš žádné vytvořené písně.</Typography>
						<Button
							onClick={() => {
								navigate('addMenu', {})
							}}
							variant="contained"
						>
							Vytvořit
						</Button>
					</Box>
				)} */}
			</Box>
		)
	} catch (e) {
		return <Typography>Chyba při načítání písní</Typography>
	}
}
