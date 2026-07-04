'use client'

import ParseAdminOption from '@/app/(layout)/vytvorit/components/ParseAdminOption'
import MainSearchInput from '@/app/components/components/MainSearchInput'
import RecommendedSongsList from '@/app/components/components/RecommendedSongsList/RecommendedSongsList'
import RightSheepPanel from '@/app/components/components/RightSheepPanel/RightSheepPanel'
import { useFooter } from '@/common/components/Footer/hooks/useFooter'
import { useToolbar } from '@/common/components/Toolbar/hooks/useToolbar'
import { useScrollHandler } from '@/common/providers/OnScrollComponent/useScrollHandler'
import { gradient } from '@/common/constants/theme'
import { Box, Image, Typography, useTheme } from '@/common/ui'
import { Chip, useMediaQuery } from '@/common/ui/mui'
import { Groups, LibraryMusic, SwapVert } from '@mui/icons-material'
import { useChangeDelayer } from '@/hooks/changedelay/useChangeDelayer'
import { useUrlState } from '@/hooks/urlstate/useUrlState'
import useWorshipCzVersion from '@/hooks/worshipcz/useWorshipCzVersion'
import { getAssetUrl } from '@/tech/paths.tech'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'
import ContainerGrid, {
	containerMaxWidth,
} from '../../common/components/ContainerGrid'
import FloatingAddButton from './components/FloatingAddButton'
import SearchedSongsList from './components/SearchedSongsList'

export const RESET_HOME_SCREEN_EVENT_NAME = 'reset_home_screen_jh1a94'

const ANIMATION_DURATION = 0.2

// Decorative chords gently floating in the empty area of the hero
const FLOATING_CHORDS = [
	{ label: 'G', top: '20%', left: '7%', size: '1.7rem', duration: 6, delay: 0 },
	{
		label: 'Em',
		top: '62%',
		left: '9%',
		size: '1.35rem',
		duration: 7,
		delay: 0.8,
	},
	{
		label: 'D',
		top: '79%',
		left: '30%',
		size: '1.9rem',
		duration: 6.5,
		delay: 1.6,
	},
	{
		label: 'C',
		top: '56%',
		left: '57%',
		size: '1.25rem',
		duration: 7.5,
		delay: 0.4,
	},
]

export default function HomeDesktop() {
	const theme = useTheme()
	const phoneVersion = useMediaQuery(theme.breakpoints.down(700))
	const isMobile = phoneVersion
	const tHome = useTranslations('home')

	const scrollPointRef = useRef(null)

	// Manage search input, and url state with delay
	const [searchString, setSearchString] = useUrlState('hledat')
	// const [searchStringRaw, setSearchStringRaw] = useState(searchString || '')
	const [searchInputValue, setSearchInputValue] = useState(searchString || '')

	const onSearchValueChange = useCallback(
		(e: string) => {
			setSearchInputValue(e)
			if (searchString === null) setSearchString('')
		},
		[searchString]
	)

	useChangeDelayer(
		searchInputValue,
		(value) => {
			if (value !== '') {
				setSearchString(value)
			}
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
	const scrollToTop = useCallback(() => {
		window.scroll({
			top: 90,
			behavior: 'smooth',
		})
	}, [])

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
	}, [isTop, toolbar, phoneVersion])

	useEffect(() => {
		footer.setShow(false)
	}, [footer])

	// Calculate inner height of the window
	const [innerHeight, setInnerHeight] = useState(
		typeof window !== 'undefined' ? window.innerHeight : 500
	)
	useEffect(() => {
		const handleResize = () => {
			setInnerHeight(window.innerHeight)
		}
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	const useWorshipVersion = useWorshipCzVersion()

	const [smartSearch, setSmartSearch] = useUrlState('smartSearch', false, {
		parse: (value) => value === 'true',
		stringify: (value) => (value ? 'true' : 'false'),
	})

	const paddingX = 32
	const gapString = `calc(max(${paddingX}px, (100vw - ${containerMaxWidth}px) / 2) )`

	const shapeSizeString = `calc(max(50vw, 50vh) * 1.35)`
	const heroLead = tHome('hero.lead')
	const heroTitle = tHome('hero.title')
	const heroSubtitle = tHome('hero.subtitle')
	const heroSubtitleLower = tHome('hero.subtitleLower')

	// Brand-gradient hero title (blue → purple)
	const heroTitleSx = {
		background: `linear-gradient(100deg, ${gradient.from} 20%, ${gradient.to})`,
		backgroundClip: 'text',
		WebkitBackgroundClip: 'text',
		color: 'transparent',
		width: 'fit-content',
		paddingRight: '0.08em',
	}

	const quickSearches = [
		tHome('quickSearch.q1'),
		tHome('quickSearch.q2'),
		tHome('quickSearch.q3'),
	]

	const features = [
		{
			icon: <LibraryMusic fontSize="small" />,
			label: tHome('features.chords'),
		},
		{ icon: <SwapVert fontSize="small" />, label: tHome('features.transpose') },
		{ icon: <Groups fontSize="small" />, label: tHome('features.teams') },
	]
	return (
		<>
			<Box
				sx={{
					position: 'fixed',
					top: isTop ? '38vh' : '-100%',
					right: isTop ? 0 : '-100%',
					transform: 'translateX(50%) translateY(-50%) rotate(175deg)',
					zIndex: -1,
					opacity: isMobile ? 0 : 1,
					transition: 'top 0.2s ease, right 0.2s ease, opacity 0.2s ease',
					width: shapeSizeString,
					height: shapeSizeString,
				}}
			>
				<Image
					src={getAssetUrl('/gradient-shapes/shape1.svg')}
					alt={tHome('backgroundShape')}
					fill
					priority
					sizes="(max-width: 700px) 0px, calc(max(50vw, 50vh) * 1.35)"
					style={{
						filter: 'brightness(1)',
					}}
				/>
				<Image
					src={getAssetUrl('/gradient-shapes/shape2.svg')}
					alt={tHome('backgroundShape')}
					fill
					priority
					sizes="(max-width: 700px) 0px, calc(max(50vw, 50vh) * 1.35)"
					style={{
						filter: 'brightness(1.1)',
					}}
				/>
			</Box>

			{/* Soft brand-color glows that give the grey background depth */}
			<Box
				sx={{
					position: 'fixed',
					inset: 0,
					zIndex: -2,
					pointerEvents: 'none',
					background: `
						radial-gradient(1000px 700px at 20% 35%, ${gradient.from}14, transparent 70%),
						radial-gradient(800px 600px at 8% 92%, ${gradient.to}0e, transparent 70%),
						radial-gradient(700px 500px at 58% 85%, ${gradient.from}0a, transparent 70%)
					`,
				}}
			/>

			{!isMobile && (
				<Box
					sx={{
						position: 'fixed',
						inset: 0,
						zIndex: -1,
						pointerEvents: 'none',
						opacity: isTop ? 1 : 0,
						transition: 'opacity 0.3s ease',
						'@keyframes floatChord': {
							'0%': { transform: 'translateY(-10px)' },
							'100%': { transform: 'translateY(10px)' },
						},
					}}
				>
					{FLOATING_CHORDS.map((c) => (
						<Typography
							key={c.label}
							sx={{
								position: 'absolute',
								top: c.top,
								left: c.left,
								fontSize: c.size,
								fontWeight: 700,
								color: 'primary.dark',
								opacity: 0.13,
								animation: `floatChord ${c.duration}s ease-in-out ${c.delay}s infinite alternate`,
							}}
						>
							{c.label}
						</Typography>
					))}
				</Box>
			)}

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
								? `32%`
								: 'calc(-7rem + 22px)'
							: isTop
							? '64px'
							: 'calc( 64px - 64px)',

						left: !phoneVersion ? paddingX : theme.spacing(1),
						right: !phoneVersion ? paddingX : theme.spacing(1),
					}}
					animate={{
						// position: phoneVersion ? 'sticky' : 'fixed',
						top: !phoneVersion
							? isTop
								? `32%`
								: 'calc(-7rem + 22px - 24px)'
							: isTop
							? '64px'
							: 'calc( 64px - 64px)',

						left: !phoneVersion
							? isTop
								? paddingX
								: `calc( ${paddingX}px + ${gapString} )`
							: theme.spacing(1),
						right: !phoneVersion ? paddingX : theme.spacing(1),
					}}
					transition={{
						type: 'keyframes',
						duration: ANIMATION_DURATION,
					}}
				>
					<ContainerGrid>
						<Box
							sx={{
								display: 'flex',
								justifyContent: ' space-between',
								width: '100%',
								gap: gapString,
							}}
						>
							<Box
								flex={1}
								sx={{
									display: 'flex',
									justifyContent: 'center',
								}}
							>
								<Box
									maxWidth={isMobile ? '100vw' : `min(550px, 50vw)`}
									flex={1}
									sx={{
										display: 'flex',
										flexDirection: 'column',
										gap: isMobile ? 1 : 3,
									}}
								>
									<AnimatePresence>
										{!phoneVersion ? (
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
												{useWorshipVersion ? (
													<Box>
														<Typography
															variant="h3"
															strong={200}
															color="text.secondary"
														>
															{heroLead}
														</Typography>
														<Typography
															variant="h1"
															strong={800}
															noWrap
															sx={heroTitleSx}
														>
															{heroTitle}
														</Typography>

														<>
															<Typography
																// variant="h5"
																strong={400}
																noWrap
																uppercase
																// small
																color="grey.500"
																sx={{
																	paddingLeft: 1,
																}}
															>
																{heroSubtitle}
															</Typography>
														</>
													</Box>
												) : (
													<>
														<Typography
															variant="h3"
															strong={200}
															color="text.secondary"
														>
															{heroLead}
														</Typography>
														<Typography
															variant="h1"
															strong={800}
															noWrap
															sx={heroTitleSx}
														>
															{heroTitle}
														</Typography>
													</>
												)}
											</motion.div>
										) : (
											<Box
												sx={{
													display: 'flex',
													flexDirection: 'column',
												}}
											>
												<Typography
													variant="h4"
													strong={200}
													color="text.secondary"
												>
													{heroLead}
												</Typography>
												<Typography
													variant="h3"
													strong={800}
													noWrap
													sx={heroTitleSx}
												>
													{heroTitle}
												</Typography>

												{useWorshipVersion && (
													<>
														<Typography variant="h4" strong={200} noWrap>
															{heroSubtitleLower}
														</Typography>
													</>
												)}
											</Box>
										)}
									</AnimatePresence>

									<MainSearchInput
										gradientBorder={isTop && !phoneVersion}
										value={searchInputValue}
										onChange={onSearchValueChange}
										smartSearch={smartSearch ?? false}
										onSmartSearchChange={setSmartSearch}
									/>

									<Box
										sx={{
											opacity: isTop && !searchInputValue ? 1 : 0,
											transition: 'opacity 0.2s ease',
											pointerEvents:
												isTop && !searchInputValue ? 'auto' : 'none',
											display: phoneVersion ? 'none' : 'flex',
											flexDirection: 'column',
											gap: 4,
										}}
									>
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'row',
												alignItems: 'center',
												gap: 1,
												flexWrap: 'wrap',
											}}
										>
											<Typography small color="text.secondary">
												{tHome('hero.tryFor')}
											</Typography>
											{quickSearches.map((q) => (
												<Chip
													key={q}
													label={q}
													size="small"
													clickable
													onClick={() => onSearchValueChange(q)}
													sx={{
														bgcolor: 'background.paper',
														boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
													}}
												/>
											))}
										</Box>

										{!phoneVersion && (
											<Box
												sx={{ display: 'flex', flexDirection: 'row', gap: 2.5 }}
											>
												{features.map((f) => (
													<Box
														key={f.label}
														sx={{
															display: 'flex',
															alignItems: 'center',
															gap: 1.25,
															flex: 1,
														}}
													>
														<Box
															sx={{
																width: 38,
																height: 38,
																minWidth: 38,
																borderRadius: 2.5,
																display: 'flex',
																alignItems: 'center',
																justifyContent: 'center',
																background: `linear-gradient(135deg, ${gradient.from}1f, ${gradient.to}1f)`,
																color: 'primary.dark',
															}}
														>
															{f.icon}
														</Box>
														<Typography
															small
															strong={500}
															color="text.secondary"
														>
															{f.label}
														</Typography>
													</Box>
												))}
											</Box>
										)}
									</Box>
								</Box>
							</Box>

							{!isMobile && (
								<Box
									sx={{
										maxWidth: isTop ? 500 : 0,
										// maxHeight: isTop ? 500 : 0,
										// transform: 'translateY(-50px)',
										opacity: isTop ? 1 : 0,
										transition:
											'max-width 0.2s ease, opacity 0.2s ease, max-height 0.2s ease',
										// display: 'flex',
										// flexDirection: 'column',
										// gap: 2,
										pointerEvents: 'auto',
									}}
								>
									<RightSheepPanel mobileVersion={isMobile} />
								</Box>
							)}
						</Box>
					</ContainerGrid>
				</motion.div>
				<Box sx={{ height: 65 }}></Box>
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
						top: !phoneVersion ? 'calc(100% - 275px)' : '155px',
						// TODO: fix height jumping on one column preview
						transform:
							isTop || phoneVersion
								? 'translateY(0)'
								: `translateY(calc(-${innerHeight}*0.8px + 170px))`,
						transition: `all ${ANIMATION_DURATION}s ease`,
					}}
				>
					{searchString && (
						<SearchedSongsList
							searchString={searchString}
							useSmartSearch={smartSearch ?? false}
						/>
					)}
					<RecommendedSongsList />
					{isMobile && (
						<Box
							sx={{
								paddingTop: 16,
								paddingBottom: 4,
							}}
						>
							<RightSheepPanel mobileVersion={isMobile} />
						</Box>
					)}
				</div>
			</Box>

			{!phoneVersion ? (
				<FloatingAddButton extended={!isTop} />
			) : (
				<>
					<ParseAdminOption />
				</>
			)}
		</>
	)
}
