'use client'

import { createStory } from '@/app/(layout)/storybook/createStory'
import useLastAddedSongs from '@/app/components/components/LastAddedSongsList/hooks/useLastAddedSongs'
import useRecommendedSongs from '@/app/components/components/RecommendedSongsList/hooks/useRecommendedSongs'
import { GROUP_CARD_SX, SongGroup } from '@/common/ui/GroupList'
import { Box, Clickable, Image, Typography, useTheme } from '@/common/ui'
import { alpha } from '@/common/ui/mui'
import { getSmartDateAgoString } from '@/tech/date/date.tech'
import { getAssetUrl } from '@/tech/paths.tech'
import { ChevronRightRounded } from '@mui/icons-material'
import { useTranslations } from 'next-intl'
import { Fragment, ReactNode } from 'react'

/** Phone width the concept is drawn at, so it reads correctly in the gallery. */
const FRAME_WIDTH = 390
const PREVIEW_LINES = 2
const TEXT_DIVIDER_INSET = 1.75

/**
 * Playground for one change only: an illustrated hero header for the phone home
 * — the app's sheep sitting on a hill, with the title and subtitle beside it.
 *
 * Everything below the header is today's home screen, unchanged: the same
 * sections, the same shared GroupList rows, the same brand blue. The tint is
 * `primary.main` at low alpha, so the header is the existing colour rather than
 * a new one.
 *
 * Concept only — it does not touch HomeMobile.
 */
const HomeHeroConceptStory = () => {
	const theme = useTheme()
	const tHome = useTranslations('home')
	const recommended = useRecommendedSongs()
	const lastAdded = useLastAddedSongs()

	const tint = (opacity: number) => alpha(theme.palette.primary.main, opacity)

	const sectionLabel = (text: string, action?: ReactNode) => (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				gap: 1,
				paddingX: 0.5,
				paddingBottom: 1,
			}}
		>
			<Typography small strong uppercase color="grey.700">
				{text}
			</Typography>
			{action}
		</Box>
	)

	const dateOf = (publishedAt?: Date | null) =>
		publishedAt ? getSmartDateAgoString(publishedAt) : ''

	return (
		<Box
			data-testid="home-hero-concept"
			sx={{
				width: FRAME_WIDTH,
				maxWidth: '100%',
				bgcolor: 'grey.50',
				borderRadius: 3,
				overflow: 'hidden',
				border: '1px solid',
				borderColor: 'grey.300',
			}}
		>
			{/* ===== the only new part: an illustrated hero header ===== */}
			<Box
				sx={{
					position: 'relative',
					bgcolor: tint(0.07),
					paddingTop: 4,
					paddingX: 2.5,
					paddingBottom: 3,
					overflow: 'hidden',
				}}
			>
				{/* the hill: a wide ellipse cropped by the band's bottom edge */}
				<Box
					sx={{
						position: 'absolute',
						left: '-15%',
						right: '-15%',
						bottom: 0,
						height: 72,
						borderRadius: '50% 50% 0 0',
						bgcolor: tint(0.13),
						pointerEvents: 'none',
					}}
				/>
				{/* the sheep stands on it, clear of the title column */}
				<Box
					sx={{
						position: 'absolute',
						right: 12,
						bottom: 10,
						width: 116,
						height: 116,
						pointerEvents: 'none',
					}}
				>
					<Image
						src={getAssetUrl('/sheeps/ovce3.svg')}
						alt={tHome('hero.title')}
						fill
						sizes="116px"
						style={{ objectFit: 'contain', objectPosition: 'bottom center' }}
					/>
				</Box>

				<Box sx={{ position: 'relative', maxWidth: '58%', paddingBottom: 5 }}>
					<Typography
						strong={900}
						size="2.1rem"
						sx={{ lineHeight: 1.1, letterSpacing: '-0.5px' }}
					>
						{tHome('hero.title')}
					</Typography>
					<Typography small strong={500} color="grey.600" sx={{ marginTop: 0.5 }}>
						{tHome('hero.lead')}
					</Typography>
				</Box>
			</Box>

			{/* ===== below here: today's home screen, unchanged ===== */}
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 3,
					paddingX: 2,
					paddingTop: 2.5,
					paddingBottom: 3,
				}}
			>
				<Box>
					{sectionLabel(
						tHome('recommended.idea'),
						<Clickable>
							<Typography small strong uppercase color="primary.main">
								{tHome('allList.browse')}
							</Typography>
						</Clickable>
					)}
					<SongGroup
						songs={recommended.data.slice(0, 5)}
						previewLines={PREVIEW_LINES}
					/>
				</Box>

				<Box>
					{sectionLabel(tHome('lastAdded.title'))}
					<Box sx={GROUP_CARD_SX}>
						{lastAdded.data.slice(0, 5).map((song, i) => (
							<Fragment key={song.packGuid}>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										gap: 1.5,
										paddingX: 1.75,
										paddingY: 1.25,
									}}
								>
									<Typography noWrap sx={{ flex: 1 }}>
										{song.title}
									</Typography>
									<Typography small color="grey.600" noWrap>
										{dateOf(song.publishedAt)}
									</Typography>
									<ChevronRightRounded
										fontSize="small"
										sx={{ color: 'grey.400' }}
									/>
								</Box>
								{i < Math.min(lastAdded.data.length, 5) - 1 && (
									<Box
										sx={{
											height: '1px',
											bgcolor: 'grey.200',
											marginLeft: TEXT_DIVIDER_INSET,
										}}
									/>
								)}
							</Fragment>
						))}
					</Box>
				</Box>
			</Box>
		</Box>
	)
}

createStory(HomeHeroConceptStory, HomeHeroConceptStory)
