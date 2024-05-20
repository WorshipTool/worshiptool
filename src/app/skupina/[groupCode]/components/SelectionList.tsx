import { Search } from '@mui/icons-material'
import {
	Box,
	Button,
	CircularProgress,
	Grow,
	Typography,
	useTheme,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import SongListCards from '../../../../common/components/songLists/SongListCards/SongListCards'
import OnChangeDelayer from '../../../../common/providers/ChangeDelayer/ChangeDelayer'
import OnScrollComponent from '../../../../common/providers/OnScrollComponent/OnScrollComponent'
import { Gap } from '../../../../common/ui/Gap'
import SearchBar from '../../../../common/ui/SearchBar/SearchBar'
import useGroup from '../../../../hooks/group/useGroup'
import useGroupSelection from '../../../../hooks/group/useGroupSelection'
import usePlaylists from '../../../../hooks/playlist/usePlaylists'
import { useApiStateEffect } from '../../../../tech/ApiState'
import normalizeSearchText from '../../../../tech/normalizeSearchText'
import Loading from '../loading'
import PinnedPlaylistAlternativeDisplay from './PinnedPlaylistAlternativeDisplay'

type SelectionListProps = {}

export default function SelectionList(props: SelectionListProps) {
	const { items, search, reload, loading } = useGroupSelection()
	const { name, payload } = useGroup()
	const { getPlaylistByGuid } = usePlaylists()

	// const navigate = useSmartNavigate()

	const pinnedPlaylistGuid = payload?.pinnedPlaylist
	const [pinnedState] = useApiStateEffect(async () => {
		if (!pinnedPlaylistGuid) return
		return await getPlaylistByGuid(pinnedPlaylistGuid)
	}, [pinnedPlaylistGuid])

	const [searchString, setSearchString] = React.useState<string>('')
	const [stillString, setStillString] = useState<string>('')

	const onChange = async (searchString: string) => {
		setStillString(searchString)

		if (searchString === '') reload()
		else search(searchString)
	}

	useEffect(() => {
		const onFocus = () => {
			window.scrollTo(0, 10)
		}
		window.addEventListener('searchBarFocus', onFocus)
		return () => {
			window.removeEventListener('searchBarFocus', onFocus)
		}
	}, [])

	const onSearchClick = () => {
		window.dispatchEvent(new Event('searchBarFocus'))
	}

	const [init, setInit] = useState(false)
	useEffect(() => {
		setInit(true)
	}, [])

	const theme = useTheme()

	return !init ? (
		<Loading />
	) : (
		<OnScrollComponent
			component={(top) => {
				return (
					<Box
						display={'flex'}
						flexDirection={'column'}
						alignItems={'center'}
						sx={{
							transition: 'all 0.2s ease',
							position: 'absolute',
							right: 0,
							left: 56,

							paddingX: 5,
							[theme.breakpoints.down('sm')]: {
								left: 0,
								top: 112,
								paddingX: 2,
							},
							...(top
								? {
										top: 310,
								  }
								: {
										top: 56,
								  }),
							minHeight: 'calc(100vh - 56px + 15px)',
						}}
					>
						<OnChangeDelayer
							value={normalizeSearchText(searchString)}
							onChange={onChange}
						/>

						<Box
							display={{
								xs: 'block',
								sm: 'block',
								md: 'none',
							}}
							width={'100%'}
						>
							{pinnedState.data && (
								<PinnedPlaylistAlternativeDisplay playlist={pinnedState.data} />
							)}
						</Box>
						<Grow in={!top} timeout={top ? 100 : 300}>
							<Box
								display={{
									xs: 'none',
									sm: 'none',
									md: 'flex',
								}}
								flexDirection={'row'}
								justifyContent={'end'}
								sx={{
									pointerEvents: 'none',
									position: 'fixed',
									top: 28,
									zIndex: 1,
									// left:0, right:0,
									flexDirection: 'row',
									justifyContent: 'center',
								}}
							>
								<Box width={400} sx={{ pointerEvents: 'auto' }}>
									<SearchBar onChange={(s) => setSearchString(s)} sx={{}} />
								</Box>
							</Box>
						</Grow>
						<Box
							display={{
								xs: 'flex',
								sm: 'flex',
								md: 'none',
							}}
							sx={{
								zIndex: 1,
								marginTop: 2,
								flexDirection: 'row',
								width: '100%',
								position: 'sticky',
								top: 60,
								[theme.breakpoints.down('sm')]: {
									top: 120,
									marginBottom: 1,
								},
								[theme.breakpoints.down('md')]: {
									marginTop: 0,
								},
							}}
						>
							<SearchBar
								onChange={(s) => setSearchString(s)}
								sx={{ width: '100%' }}
							/>
						</Box>

						<Gap value={0.5} />
						<Box
							display={{
								xs: 'none',
								sm: 'none',
								md: 'flex',
							}}
							sx={{
								width: '100%',
								flexDirection: 'row',
								justifyContent: 'end',
								position: 'relative',
								transition: 'all 0.2s ease',
								...(top
									? {}
									: {
											opacity: 0,
									  }),
							}}
						>
							<Button
								color="inherit"
								onClick={onSearchClick}
								startIcon={<Search />}
							>
								Hledat
							</Button>
						</Box>
						<Gap value={0.5} />
						{loading ? (
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'start',
									alignItems: 'start',
									flex: 1,
									color: 'black',
								}}
							>
								<CircularProgress size={'2rem'} color="inherit" />
							</Box>
						) : (
							<>
								<SongListCards data={items.map((v) => v.variant)} />
								{items.length == 0 && stillString !== '' && (
									<Typography>
										{`Ve skupině ${name} nebyly nalezeny žádné písně s výrazem "
										${stillString}"`}
									</Typography>
								)}
							</>
						)}
					</Box>
				)
			}}
		/>
	)
}
