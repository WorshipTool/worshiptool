'use client'
import AllSongItem from '@/app/(layout)/seznam/AllSongItem'
import Pager from '@/common/components/Pager/Pager'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { useDownSize } from '@/common/hooks/useDownSize'
import { Box, CircularProgress, Typography } from '@/common/ui'
import { Container } from '@/common/ui/mui'
import { Grid } from '@/common/ui/mui/Grid'
import { useApiStateEffect } from '@/tech/ApiState'
import { Gap } from '../../../common/ui/Gap/Gap'
import { useApi } from '../../../hooks/api/useApi'
import { useUrlState } from '../../../hooks/urlstate/useUrlState'
import { handleApiCall } from '../../../tech/handleApiCall'

export default SmartPage(List)
function List() {
	const [page, setPage] = useUrlState('stránka', 1, {
		parse: (v) => parseInt(v),
		stringify: (v) => v.toString(),
	})
	console.log('page', page)

	const { songGettingApi } = useApi()

	const [{ data: count }] = useApiStateEffect(async () =>
		handleApiCall(songGettingApi.songGettingControllerGetListSongCount())
	)

	const isSmall = useDownSize('md')
	const isMiddle = useDownSize('lg')
	const countPerPage = isSmall ? 8 : isMiddle ? 16 : 21
	const getPageData = async (page: number) => {
		const r = await handleApiCall(
			songGettingApi.songGettingControllerGetList(page, countPerPage + 1)
		)

		return r.slice(0, countPerPage)
	}

	return (
		<Box>
			<Container
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					gap: 4,
				}}
			>
				<Gap value={3} />
				<Box display={'flex'}>
					<Typography variant="h4" strong>
						Seznam všech písní
					</Typography>
				</Box>
				<Pager
					data={getPageData}
					allCount={count || 0}
					take={countPerPage}
					startPage={10}
					onPageChange={setPage}
				>
					{(data, loading, startIndex) => {
						return (
							<Box
								display={'flex'}
								flexDirection={'column'}
								gap={2}
								position={'relative'}
							>
								<Box
									sx={{
										position: 'absolute',
										top: 0,
										left: 0,
										right: 0,
										bottom: 0,
										bgcolor: loading ? 'grey.300' : 'transparent',
										opacity: 0.5,
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										pointerEvents: loading ? undefined : 'none',
										transition: 'all 0.3s',
									}}
								>
									{loading && <CircularProgress />}
								</Box>

								<Grid container columns={3} spacing={1} paddingBottom={2}>
									{data.map((s, index) => {
										return (
											<Grid
												item
												xs={3}
												md={1.5}
												lg={1}
												key={s.main.songGuid as any}
											>
												<AllSongItem data={s} index={startIndex + index + 1} />
											</Grid>
										)
									})}
								</Grid>
							</Box>
						)
					}}
				</Pager>

				<Gap value={2} />
			</Container>
		</Box>
	)
}
