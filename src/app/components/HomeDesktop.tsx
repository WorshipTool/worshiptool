'use client'

import MainSearchInput from '@/app/components/components/MainSearchInput'
import { useFooter } from '@/common/components/Footer/hooks/useFooter'
import { useToolbar } from '@/common/components/Toolbar/hooks/useToolbar'
import { useScrollHandler } from '@/common/providers/OnScrollComponent/useScrollHandler'
import { useChangeDelayer } from '@/hooks/changedelay/useChangeDelayer'
import { useUrlState } from '@/hooks/urlstate/useUrlState'
import { Box, Grid, Typography, useTheme } from '@mui/material'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import ContainerGrid from '../../common/components/ContainerGrid'
import FloatingAddButton from './components/FloatingAddButton'
import RecommendedSongsList from './components/RecommendedSongsList/RecommendedSongsList'
import SearchedSongsList from './components/SearchedSongsList'

export default function HomeDesktop() {
	const ANIMATION_DURATION = 0.2

	const theme = useTheme()

	const scrollPointRef = useRef(null)

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
	const scrollLevel = 20
	const scrollToTop = () => {
		window.scroll({
			top: 90,
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

	// Calculate inner height of the window
	const [innerHeight, setInnerHeight] = useState(window.innerHeight)
	useEffect(() => {
		const handleResize = () => {
			setInnerHeight(window.innerHeight)
		}
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

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
						top: isTop ? `35%` : 'calc(-7rem + 22px)',
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
											height: '7rem',
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

				<Box sx={{ height: '100vh' }}></Box>

				<div
					style={{
						left: 0,
						right: 0,
						position: 'absolute',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						padding: theme.spacing(2),
						top: '80%',
						transform: isTop
							? 'translateY(0)'
							: `translateY(calc(-${innerHeight}*0.8px + 170px))`,
						transition: `transform ${ANIMATION_DURATION}s ease`,
					}}
				>
					{searchString && <SearchedSongsList searchString={searchString} />}
					<RecommendedSongsList />
				</div>
			</Box>

			<FloatingAddButton extended={!isTop} />
		</>
	)
}
