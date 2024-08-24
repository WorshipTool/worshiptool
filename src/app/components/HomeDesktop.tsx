'use client'

import MainSearchInput from '@/app/components/components/MainSearchInput'
import { useFooter } from '@/common/components/Footer/hooks/useFooter'
import { useToolbar } from '@/common/components/Toolbar/hooks/useToolbar'
import { useScrollHandler } from '@/common/providers/OnScrollComponent/useScrollHandler'
import { useChangeDelayer } from '@/hooks/changedelay/useChangeDelayer'
import { useUrlState } from '@/hooks/urlstate/useUrlState'
import {
	Box,
	Grid,
	InputBase,
	Typography,
	styled,
	useTheme,
} from '@mui/material'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import ContainerGrid from '../../common/components/ContainerGrid'
import FloatingAddButton from './components/FloatingAddButton'
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
	zIndex: 100,
}))

export default function HomeDesktop() {
	const ANIMATION_DURATION = 0.2

	const theme = useTheme()

	const scrollPointRef = useRef(null)

	/**
	 * Calculation value to correct window height
	 * ...handles resizing
	 */
	const [correctingOffsetForWindowHeight, setcorrectingOffsetForWindowHeight] =
		useState(1000)
	useEffect(() => {
		const onResize = () => {
			const min = window.innerHeight
			setcorrectingOffsetForWindowHeight(min)
		}
		onResize()
		window.addEventListener('resize', onResize)
		return () => {
			window.removeEventListener('resize', onResize)
		}
	}, [])

	// Manage search input, and url state with delay
	const [searchString, setSearchString] = useUrlState('search')
	const [searchInputValue, setSearchInputValue] = useState(searchString || '')

	const onSearchValueChange = (e: string) => {
		setSearchInputValue(e)
		if (searchString === null) setSearchString('')
	}

	useChangeDelayer(
		searchInputValue,
		(value) => {
			if (value !== '') setSearchString(value.replaceAll(',', ' '))
		},
		[]
	)
	// Manage scrolling to search results
	const scrollLevel = 50
	const scrollToTop = () => {
		window.scroll({
			top: scrollLevel * 2,
			left: 0,
			behavior: 'smooth',
		})
	}

	useEffect(() => {
		if (searchString === null) return
		scrollToTop()
	}, [searchString])

	// Manage toolbar and footer
	const { isTop } = useScrollHandler({
		topThreshold: scrollLevel,
	})

	const toolbar = useToolbar()
	const footer = useFooter()

	useEffect(() => {
		toolbar.setTransparent(isTop)
		toolbar.setHideMiddleNavigation(!isTop)
		toolbar.setShowTitle(!isTop)
	}, [isTop, toolbar])

	useEffect(() => {
		footer.setShow(false)
	}, [footer])

	return (
		<>
			{/* <Toolbar transparent={isTop} /> */}

			<Box
				sx={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'start',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<motion.div
					style={{
						position: 'fixed',
						left: 0,
						right: 0,
						display: 'flex',
						flexDirection: 'column',
						zIndex: 10,
						alignItems: 'center',
						pointerEvents: 'none',
					}}
					initial={{
						top: '35%',
					}}
					animate={{
						top: isTop ? '35%' : 28,
					}}
					transition={{
						type: 'keyframes',
						duration: ANIMATION_DURATION,
					}}
				>
					<ContainerGrid>
						<Grid item xs={12}>
							<Grid container justifyContent="center">
								<Grid item xs={6} sx={{ pointerEvents: 'auto' }}>
									<motion.div
										initial={{
											height: '7rem',
											opacity: 1,
										}}
										animate={{
											height: isTop ? '7rem' : '0',
											opacity: isTop ? 1 : 0,
										}}
										transition={{
											type: 'keyframes',
											duration: ANIMATION_DURATION / 2,
										}}
										style={{
											display: 'flex',
											justifyContent: 'center',
											marginBottom: theme.spacing(1),
											flexDirection: 'column',
											userSelect: 'none',
										}}
									>
										<Typography variant="h3" fontWeight={'200'}>
											Jsi-li ovce, tak...
										</Typography>
										<Typography variant="h1" fontWeight={'900'}>
											Chval Otce
										</Typography>
									</motion.div>

									<MainSearchInput
										gradientBorder={isTop}
										value={searchInputValue}
										onChange={onSearchValueChange}
									/>
								</Grid>
							</Grid>
						</Grid>
					</ContainerGrid>
				</motion.div>
				<Box sx={{ height: 65 }}></Box>

				<div ref={scrollPointRef}></div>

				<Box sx={{ height: correctingOffsetForWindowHeight }}></Box>

				<motion.div
					style={{
						left: 0,
						right: 0,
						position: 'fixed',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						padding: theme.spacing(2),
					}}
					initial={{
						top: '80%',
						position: 'fixed',
					}}
					animate={{
						top: isTop ? '80%' : 170,
						position: isTop ? 'fixed' : 'absolute',
					}}
					transition={{
						type: 'keyframes',
						duration: ANIMATION_DURATION,
					}}
				>
					{searchString && <SearchedSongsList searchString={searchString} />}
					<RecommendedSongsList />
				</motion.div>
			</Box>

			<FloatingAddButton extended={!isTop} />
		</>
	)
}
