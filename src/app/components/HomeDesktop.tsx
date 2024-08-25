'use client'

import MainSearchInput from '@/app/components/components/MainSearchInput'
import { useFooter } from '@/common/components/Footer/hooks/useFooter'
import { useToolbar } from '@/common/components/Toolbar/hooks/useToolbar'
import { useScrollHandler } from '@/common/providers/OnScrollComponent/useScrollHandler'
import { useChangeDelayer } from '@/hooks/changedelay/useChangeDelayer'
import { useUrlState } from '@/hooks/urlstate/useUrlState'
import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import ContainerGrid from '../../common/components/ContainerGrid'
import FloatingAddButton from './components/FloatingAddButton'
import RecommendedSongsList from './components/RecommendedSongsList/RecommendedSongsList'
import SearchedSongsList from './components/SearchedSongsList'

export const RESET_HOME_SCREEN_EVENT_NAME = 'reset_home_screen_jh1a94'

export default function HomeDesktop() {
	const ANIMATION_DURATION = 0.2

	const theme = useTheme()
	const phoneVersion = useMediaQuery(theme.breakpoints.down('sm'))

	const scrollPointRef = useRef(null)

	// Manage search input, and url state with delay
	const [searchString, setSearchString] = useUrlState('hledat')
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

	useEffect(() => {
		const handler = () => {
			setSearchInputValue('')
		}

		window.addEventListener(RESET_HOME_SCREEN_EVENT_NAME, handler)
		return () => {
			window.removeEventListener(RESET_HOME_SCREEN_EVENT_NAME, handler)
		}
	}, [])

	// Manage scrolling to search results
	const scrollLevel = 20
	const scrollToTop = () => {
		window.scroll({
			top: 90,
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
		toolbar.setTransparent(isTop && !phoneVersion)
		toolbar.setHideMiddleNavigation(!isTop && !phoneVersion)
		toolbar.setShowTitle(!isTop || phoneVersion)
	}, [isTop, toolbar, phoneVersion])

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
					position: 'relative',
				}}
			>
				<motion.div
					style={{
						position: 'fixed',
						display: 'flex',
						flexDirection: 'column',
						zIndex: phoneVersion ? 1 : 10,
						alignItems: 'center',
						pointerEvents: 'none',
					}}
					initial={{
						top: !phoneVersion
							? isTop
								? `35%`
								: 'calc(-7rem + 22px)'
							: 'calc( 64px)',

						left: !phoneVersion ? 0 : theme.spacing(1),
						right: !phoneVersion ? 0 : theme.spacing(1),
					}}
					animate={{
						top: !phoneVersion
							? isTop
								? `35%`
								: 'calc(-7rem + 22px)'
							: 'calc( 64px)',

						left: !phoneVersion ? 0 : theme.spacing(1),
						right: !phoneVersion ? 0 : theme.spacing(1),
					}}
					transition={{
						type: 'keyframes',
						duration: ANIMATION_DURATION,
					}}
				>
					<ContainerGrid>
						<Grid item xs={12}>
							<Grid container justifyContent="center">
								<Grid item sm={6} xs={12} sx={{ pointerEvents: 'auto' }}>
									<AnimatePresence>
										{!phoneVersion && (
											<motion.div
												initial={{
													height: '7rem',
													opacity: isTop ? 1 : 0,
												}}
												animate={{
													opacity: isTop ? 1 : 0,
												}}
												exit={{
													opacity: 0,
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
													pointerEvents: 'none',
												}}
											>
												<Typography variant="h3" fontWeight={'200'}>
													Jsi-li ovce, tak...
												</Typography>
												<Typography variant="h1" fontWeight={'900'} noWrap>
													Chval Otce
												</Typography>
											</motion.div>
										)}
									</AnimatePresence>

									<MainSearchInput
										gradientBorder={isTop && !phoneVersion}
										value={searchInputValue}
										onChange={onSearchValueChange}
									/>
								</Grid>
							</Grid>
						</Grid>
					</ContainerGrid>
				</motion.div>
				<Box sx={{ height: phoneVersion ? 0 : 65 }}></Box>

				<div ref={scrollPointRef}></div>

				<Box sx={{ height: !phoneVersion ? '100vh' : 0 }}></Box>

				<div
					style={{
						left: 0,
						right: 0,
						position: 'absolute',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						padding: 0,
						top: !phoneVersion ? 'calc(100% - 275px)' : '66px',
						// TODO: fix height jumping on one column preview
						transform:
							isTop || phoneVersion
								? 'translateY(0)'
								: `translateY(calc(-${innerHeight}*0.8px + 170px))`,
						transition: `all ${ANIMATION_DURATION}s ease`,
					}}
				>
					{searchString && <SearchedSongsList searchString={searchString} />}
					<RecommendedSongsList />
				</div>
			</Box>

			{!phoneVersion && <FloatingAddButton extended={!isTop} />}
		</>
	)
}
