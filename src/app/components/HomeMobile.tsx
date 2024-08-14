'use client'

import { useFooter } from '@/common/components/Footer/hooks/useFooter'
import { useToolbar } from '@/common/components/Toolbar/hooks/useToolbar'
import { Gap } from '@/common/ui/Gap'
import SearchIcon from '@mui/icons-material/Search'
import { Box, InputBase, styled, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import RecommendedSongsList from './components/RecommendedSongsList/RecommendedSongsList'
import SearchedSongsList from './components/SearchedSongsList'

const SearchContainer = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.grey[100],
	padding: '0.5rem',
	paddingLeft: '0.8rem',
	paddingRight: '0.8rem',
	borderRadius: '0.5rem',
	display: 'flex',

	justifyContent: 'center',
	alignItems: 'center',
}))
const SearchInput = styled(InputBase)(({ theme }) => ({
	flex: 1,
	marginLeft: '0.5em',
	position: 'relative',
}))

export default function HomeMobile() {
	const theme = useTheme()

	const [searchValue, setSearchValue] = useState('')
	const [showSearchedList, setShowSearchedList] = useState(false)

	const onSearchValueChange = (event: any) => {
		setShowSearchedList(true)
		setSearchValue(event.target.value)
	}

	const toolbar = useToolbar()
	useEffect(() => {
		toolbar.setTransparent(false)
	}, [])

	const footer = useFooter()
	useEffect(() => {
		footer.setShow(true)
	}, [])

	return (
		<Box
			sx={{
				display: 'none',
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column-reverse',
				[theme.breakpoints.down('sm')]: {
					display: 'flex',
				},
				position: 'relative',
			}}
		>
			<Gap />
			<Box width={`calc(100% - ${theme.spacing(0)})`}>
				{showSearchedList && <SearchedSongsList searchString={searchValue} />}
				<RecommendedSongsList listType="list" />
			</Box>
			<Gap />
			<Box
				sx={{
					display: 'flex',
					width: `100%`,
					flex: 1,
					flexDirection: 'row',
					position: 'sticky',
					top: 60,
					// zIndex: 1,
				}}
			>
				<Box sx={{ flex: 1 }} position={'relative'}>
					<SearchContainer
						sx={{
							boxShadow: '0px 4px 5px' + theme.palette.grey[400],
						}}
					>
						<SearchIcon />
						<SearchInput
							placeholder="Hledej..."
							onChange={onSearchValueChange}
							autoFocus
							value={searchValue}
						></SearchInput>
					</SearchContainer>
				</Box>
			</Box>
		</Box>
	)
}
