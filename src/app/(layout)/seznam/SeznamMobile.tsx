'use client'

import { mapBasicVariantPackApiToDto } from '@/api/dtos/song/song.map'
import { GetListSongData } from '@/api/generated'
import { useApi } from '@/api/tech-and-hooks/useApi'
import { Box, CircularProgress, Typography } from '@/common/ui'
import { Pagination } from '@/common/ui/mui'
import { Skeleton } from '@/common/ui/mui/Skeleton'
import { SongVariantCard } from '@/common/ui/SongCard'
import { ChevronRightRounded, MusicNoteRounded } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { Fragment, useEffect, useMemo, useState } from 'react'

const PAGE_MAX_WIDTH = 480
const PER_PAGE = 12
// on app-shell routes the top bar's sticky spacer shrinks to the safe-area
// inset (Toolbar.tsx); reclaim exactly that so the grey canvas reaches the top
const TOOLBAR_SPACER = 'env(safe-area-inset-top)'
// the paginator is docked just above the global tab bar and always visible;
// the list clears both so the last card isn't hidden behind them
const TAB_BAR_OFFSET = 'calc(env(safe-area-inset-bottom) + 64px)'
const CONTENT_CLEARANCE = 'calc(env(safe-area-inset-bottom) + 148px)'
const PREVIEW_LINES = 1
// divider starts past the leading icon: row padding (2u) + icon (5u) + gap (1.5u)
const DIVIDER_INSET = 8.5

// the whole page of songs lives in one white "group" surface (iOS-style
// grouped list); each row is a flattened SongVariantCard separated by a hairline
const GROUP_CARD_SX = {
	bgcolor: 'background.paper',
	borderRadius: 3,
	boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
	overflow: 'hidden',
}

// strip the card chrome off SongVariantCard so it reads as a row inside the group
const FLAT_ROW_SX = {
	bgcolor: 'transparent',
	borderRadius: 0,
	outlineColor: 'transparent',
	'&:hover': { bgcolor: 'grey.50', boxShadow: 'none' },
	'&:active': { bgcolor: 'grey.100' },
}

// small alphabetical section label above each letter's group card
const LETTER_HEADER_SX = {
	paddingLeft: 0.5,
	paddingTop: 0.5,
	paddingBottom: 0.5,
}

// first letter of a song title, upper-cased for the section header
const firstLetter = (title: string) =>
	(title.trim().charAt(0) || '#').toLocaleUpperCase('cs')

function SongLeadingIcon() {
	return (
		<Box
			sx={{
				width: 40,
				height: 40,
				borderRadius: 2,
				bgcolor: 'grey.100',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<MusicNoteRounded sx={{ fontSize: 20, color: 'grey.500' }} />
		</Box>
	)
}

type SeznamMobileProps = {
	/** 1-indexed page, kept in the URL by the parent (shared with desktop) */
	page: number
	onPageChange: (page: number) => void
	count: number
}

/**
 * Native-feeling mobile songs list: white song cards floating on the grey
 * canvas (matching the home screen), but paginated — there are thousands of
 * songs, so paging beats an endless scroll. The desktop grid stays in
 * page.tsx; this component owns the phone view.
 */
export default function SeznamMobile({
	page,
	onPageChange,
	count,
}: SeznamMobileProps) {
	const t = useTranslations('songsList')
	const { songGettingApi } = useApi()

	const [items, setItems] = useState<GetListSongData[]>([])
	const [loading, setLoading] = useState(true)

	const pagesCount = Math.max(1, Math.ceil(count / PER_PAGE))

	// split the current page's songs into consecutive first-letter sections so
	// each new starting letter gets a header — kept entirely within the page
	// (the backend returns the list alphabetically sorted)
	const letterGroups = useMemo(() => {
		const groups: { letter: string; items: GetListSongData[] }[] = []
		for (const s of items) {
			const letter = firstLetter(s.main.title)
			const last = groups[groups.length - 1]
			if (last && last.letter === letter) last.items.push(s)
			else groups.push({ letter, items: [s] })
		}
		return groups
	}, [items])

	useEffect(() => {
		let active = true
		setLoading(true)
		songGettingApi
			.getList(page, PER_PAGE)
			.then((data) => {
				if (active) setItems(data)
			})
			.catch(() => {
				if (active) setItems([])
			})
			.finally(() => {
				if (active) setLoading(false)
			})
		return () => {
			active = false
		}
	}, [page, songGettingApi])

	const goToPage = (p: number) => {
		onPageChange(p)
		if (typeof window !== 'undefined')
			window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	return (
		<Box
			sx={{
				// full-bleed: escape the SmartPage padded wrapper and the toolbar spacer
				width: '100vw',
				marginLeft: 'calc(50% - 50vw)',
				marginTop: `calc(-1 * ${TOOLBAR_SPACER})`,
				minHeight: '100dvh',
				bgcolor: 'grey.100',
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			<Box
				sx={{
					width: '100%',
					maxWidth: PAGE_MAX_WIDTH,
					minWidth: 0,
					minHeight: '100dvh',
					bgcolor: 'grey.50',
					display: 'flex',
					flexDirection: 'column',
					boxShadow: 3,
				}}
			>
				<Box
					sx={{
						paddingX: 2.5,
						paddingTop: 'calc(env(safe-area-inset-top) + 24px)',
						paddingBottom: 1.5,
					}}
				>
					<Typography variant="h4" strong={800}>
						{t('title')}
					</Typography>
				</Box>

				<Box
					sx={{
						paddingX: 2,
						paddingTop: 1,
						paddingBottom: CONTENT_CLEARANCE,
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Box sx={{ position: 'relative', minHeight: 320 }}>
						{loading && items.length === 0 ? (
							<Box sx={GROUP_CARD_SX}>
								{Array.from({ length: PER_PAGE }).map((_, i) => (
									<Fragment key={i}>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												gap: 1.5,
												paddingX: 1.75,
												paddingY: 1.25,
											}}
										>
											<Skeleton
												variant="rounded"
												sx={{
													width: 40,
													height: 40,
													borderRadius: 2,
													bgcolor: 'grey.100',
													flexShrink: 0,
												}}
											/>
											<Box sx={{ flex: 1 }}>
												<Skeleton
													variant="text"
													sx={{ width: '55%', bgcolor: 'grey.100' }}
												/>
												<Skeleton
													variant="text"
													sx={{ width: '80%', bgcolor: 'grey.100' }}
												/>
											</Box>
										</Box>
										{i < PER_PAGE - 1 && (
											<Box
												sx={{
													height: '1px',
													bgcolor: 'grey.100',
													marginLeft: DIVIDER_INSET,
												}}
											/>
										)}
									</Fragment>
								))}
							</Box>
						) : (
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									gap: 1.5,
								}}
							>
								{letterGroups.map((group) => (
									<Box key={group.letter}>
										<Box sx={LETTER_HEADER_SX}>
											<Typography
												small
												strong={700}
												color="grey.500"
												sx={{ letterSpacing: '0.5px' }}
											>
												{group.letter}
											</Typography>
										</Box>
										<Box sx={GROUP_CARD_SX}>
											{group.items.map((s, i) => (
												<Fragment
													key={`${String(s.main.packGuid)}-${i}`}
												>
													<SongVariantCard
														data={mapBasicVariantPackApiToDto(s.main)}
														dense
														previewLines={PREVIEW_LINES}
														leadingIcon={<SongLeadingIcon />}
														trailingIcon={
															<ChevronRightRounded
																sx={{ color: 'grey.400' }}
															/>
														}
														sx={FLAT_ROW_SX}
													/>
													{i < group.items.length - 1 && (
														<Box
															sx={{
																height: '1px',
																bgcolor: 'grey.100',
																marginLeft: DIVIDER_INSET,
															}}
														/>
													)}
												</Fragment>
											))}
										</Box>
									</Box>
								))}
							</Box>
						)}

						{loading && items.length > 0 && (
							<Box
								sx={{
									position: 'absolute',
									inset: 0,
									display: 'flex',
									alignItems: 'flex-start',
									justifyContent: 'center',
									paddingTop: 6,
									bgcolor: 'grey.50',
									opacity: 0.6,
									borderRadius: 3,
								}}
							>
								<CircularProgress />
							</Box>
						)}
					</Box>
				</Box>
			</Box>

			{/* paginator docked just above the tab bar — always visible */}
			{pagesCount > 1 && (
				<Box
					sx={{
						position: 'fixed',
						bottom: TAB_BAR_OFFSET,
						left: '50%',
						transform: 'translateX(-50%)',
						width: '100%',
						maxWidth: PAGE_MAX_WIDTH,
						zIndex: 10,
						boxSizing: 'border-box',
						display: 'flex',
						justifyContent: 'center',
						paddingY: 0.75,
						bgcolor: 'background.paper',
						borderTop: '1px solid',
						borderColor: 'grey.200',
						boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
					}}
				>
					<Pagination
						count={pagesCount}
						page={page}
						onChange={(_, p) => goToPage(p)}
						color="primary"
						siblingCount={0}
						boundaryCount={1}
						sx={{
							// finger-sized touch targets (44px) while staying compact
							'& .MuiPaginationItem-root': {
								minWidth: 44,
								height: 44,
								margin: '0 2px',
								fontSize: '1rem',
							},
						}}
					/>
				</Box>
			)}
		</Box>
	)
}
