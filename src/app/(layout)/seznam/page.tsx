'use client'
import { VariantPackAlias, VariantPackGuid } from '@/api/dtos'
import Pager from '@/common/components/Pager/Pager'
import { SmartPage } from '@/common/components/app/SmartPage/SmartPage'
import { Box, CircularProgress, Divider, Typography } from '@/common/ui'
import { Container, Grid, Paper, styled } from '@/common/ui/mui'
import DraggableSong from '@/hooks/dragsong/DraggableSong'
import { parseVariantAlias } from '@/routes/routes.tech'
import { useApiStateEffect } from '@/tech/ApiState'
import { Gap } from '../../../common/ui/Gap/Gap'
import { useApi } from '../../../hooks/api/useApi'
import { useSmartNavigate } from '../../../routes/useSmartNavigate'
import { handleApiCall } from '../../../tech/handleApiCall'

const StyledPaper = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.grey[100],

	padding: '0.6rem',
	'&:hover': {
		backgroundColor: theme.palette.grey[200],
		boxShadow: `0px 0px 7px ${theme.palette.grey[600]}`,
	},
	cursor: 'pointer',
}))

export default SmartPage(List)
function List() {
	// const [page, setPage] = useState(1)
	// const [pageCount, setPageCount] = useState(1)

	const { songGettingApi } = useApi()
	// const {
	// 	nextPage,
	// 	loadPage,
	// 	data: songs,
	// 	nextExists,
	// } = usePagination<GetListSongData>((page, resolve, arr) => {
	// 	handleApiCall(songGettingApi.songGettingControllerGetList(page))
	// 		.then((data) => {
	// 			const uniq = data.filter((v) => {
	// 				return !arr.find((s) => s.guid == v.guid)
	// 			})
	// 			resolve(uniq)
	// 		})
	// 		.catch((e) => {
	// 			console.log(e)
	// 		})
	// })
	const navigate = useSmartNavigate()

	// const countPerPage = 30
	// useEffect(() => {
	// 	const count = Math.floor(songs.length / countPerPage) + 1
	// 	setPageCount(count)
	// }, [songs])

	// useEffect(() => {
	// 	nextPage()
	// }, [songs])

	// const onPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
	// 	setPage(value)
	// }

	const [{ data: count }] = useApiStateEffect(async () =>
		handleApiCall(songGettingApi.songGettingControllerGetListSongCount())
	)

	const COUNT_PER_PAGE = 30
	const getPageData = (page: number) => {
		return handleApiCall(
			songGettingApi.songGettingControllerGetList(page, COUNT_PER_PAGE)
		).then((data) => {
			const uniq = data.filter((v, i, a) => {
				return a.findIndex((t) => t.guid === v.guid) === i
			})
			return uniq
		})
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
					{/* {nextExists && (
						<Box
							flex={1}
							display={'flex'}
							sx={{
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Gap horizontal value={2} />
							<CircularProgress color="inherit" size={'2rem'} thickness={4} />
						</Box>
					)} */}
				</Box>
				<Pager data={getPageData} allCount={count || 0} take={30}>
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
											<Grid item xs={3} md={1.5} lg={1} key={s.guid}>
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
																...parseVariantAlias(
																	s.alias as VariantPackAlias
																),
															})
														}}
													>
														<Box display={'flex'} gap={1}>
															<Typography strong>
																{startIndex + index + 1}
															</Typography>
															<Divider orientation="vertical" flexItem />
															<Typography strong={300} noWrap>
																{s.title}{' '}
															</Typography>
														</Box>
													</StyledPaper>
												</DraggableSong>
											</Grid>
										)
									})}
								</Grid>
							</Box>
						)
					}}
				</Pager>

				<Gap value={3} />
			</Container>
		</Box>
	)
}
