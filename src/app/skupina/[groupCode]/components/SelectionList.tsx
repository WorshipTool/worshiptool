import { Search } from '@mui/icons-material'
import { Box, Button, CircularProgress, Grow, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SongListCards from '../../../../common/components/songLists/SongListCards/SongListCards'
import OnChangeDelayer from '../../../../common/providers/ChangeDelayer/ChangeDelayer'
import OnScrollComponent from '../../../../common/providers/OnScrollComponent/OnScrollComponent'
import { Gap } from '../../../../common/ui/Gap'
import SearchBar from '../../../../common/ui/SearchBar/SearchBar'
import useGroup from '../../../../hooks/group/useGroup'
import useGroupSelection from '../../../../hooks/group/useGroupSelection'
import normalizeSearchText from '../../../../tech/normalizeSearchText'
import Loading from '../loading'

export default function SelectionList() {
	const { items, search, reload, loading } = useGroupSelection()
	const { name } = useGroup()

	// const navigate = useSmartNavigate()

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
							...(top
								? {
										top: 310,
								  }
								: {
										top: 56,
								  }),
							minHeight: 'calc(100vh - 56px + 15px)',
							paddingX: 5,
						}}
					>
						<OnChangeDelayer
							value={normalizeSearchText(searchString)}
							onChange={onChange}
						/>
						<Grow in={!top} timeout={top ? 100 : 300}>
							<Box
								display={'flex'}
								flexDirection={'row'}
								justifyContent={'end'}
								sx={{
									pointerEvents: 'none',
									position: 'fixed',
									top: 28,
									zIndex: 1,
									// left:0, right:0,
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'center',
								}}
							>
								<Box width={400} sx={{ pointerEvents: 'auto' }}>
									<SearchBar onChange={(s) => setSearchString(s)} sx={{}} />
								</Box>
							</Box>
						</Grow>
						<Gap value={0.5} />
						<Box
							sx={{
								width: '100%',
								display: 'flex',
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
