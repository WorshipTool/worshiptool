'use client'

import { createStory } from '@/app/(layout)/storybook/createStory'
import useLastAddedSongs from '@/app/components/components/LastAddedSongsList/hooks/useLastAddedSongs'
import useRecommendedSongs from '@/app/components/components/RecommendedSongsList/hooks/useRecommendedSongs'
import { GROUP_CARD_SX, SongGroup } from '@/common/ui/GroupList'
import { Box, Clickable, Image, Typography, useTheme } from '@/common/ui'
import { alpha } from '@/common/ui/mui'
import { getSmartDateAgoString } from '@/tech/date/date.tech'
import { getAssetUrl } from '@/tech/paths.tech'
import {
	AutoAwesomeRounded,
	FavoriteRounded,
	SearchRounded,
	StarRounded,
	WbSunnyRounded,
} from '@mui/icons-material'
import { ReactNode } from 'react'

/** Phone width the concept is drawn at, so it reads correctly in the gallery. */
const FRAME_WIDTH = 390
/** Gap between the hero band and the search field. */
const SEARCH_OVERLAP = 2

// One icon per "recently added" card, cycled — the concept shows variety rather
// than one repeated glyph.
const RECENT_ICONS = [
	<WbSunnyRounded key="a" />,
	<FavoriteRounded key="b" />,
	<StarRounded key="c" />,
	<AutoAwesomeRounded key="d" />,
]

/**
 * Playground for an illustrated home-screen concept: a tinted hero band with
 * the app's sheep, the search field lifted into its lower edge, then the
 * familiar grouped list and a horizontal row of recently added songs.
 *
 * Concept only — it does not replace HomeMobile. Everything is drawn with house
 * tokens: the lavender is `primary.dark` (the darker half of the brand
 * gradient) at low alpha, not a new colour, and the song rows are the shared
 * GroupList primitives so the list language matches the rest of the app.
 */
const HomeHeroConceptStory = () => {
	const theme = useTheme()
	const recommended = useRecommendedSongs()
	const lastAdded = useLastAddedSongs()

	const tint = (opacity: number) => alpha(theme.palette.primary.dark, opacity)

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
			{/* ---- hero: tinted band, title left, sheep sitting on a hill ---- */}
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
						alt="Ovečka"
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
						Chval Otce
					</Typography>
					<Typography small strong={500} color="grey.600" sx={{ marginTop: 0.5 }}>
						Jsi-li ovce, tak…
					</Typography>
				</Box>
			</Box>

			{/* ---- search, sitting just under the hero band ---- */}
			<Box sx={{ paddingX: 2, marginTop: SEARCH_OVERLAP }}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 1.5,
						bgcolor: 'background.paper',
						border: '1px solid',
						borderColor: tint(0.35),
						borderRadius: 2.5,
						paddingX: 2,
						paddingY: 1.5,
						boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
					}}
				>
					<SearchRounded sx={{ color: 'grey.500' }} />
					<Typography color="grey.500">Hledej podle názvu nebo části textu</Typography>
				</Box>
			</Box>

			{/* ---- recommended: the shared grouped list ---- */}
			<Box sx={{ paddingX: 2, paddingTop: 3 }}>
				{sectionLabel(
					'Doporučené pro tebe',
					<Clickable>
						<Typography small strong uppercase color="primary.dark">
							Procházet
						</Typography>
					</Clickable>
				)}
				<SongGroup songs={recommended.data.slice(0, 5)} previewLines={2} />
			</Box>

			{/* ---- recently added: a horizontal card row ---- */}
			<Box sx={{ paddingTop: 3, paddingBottom: 3 }}>
				<Box sx={{ paddingX: 2 }}>{sectionLabel('Naposledy přidané')}</Box>
				<Box sx={{ display: 'flex', gap: 1, paddingX: 2 }}>
					{lastAdded.data.slice(0, 4).map((song, i) => (
						<Box
							key={song.packGuid}
							sx={{
								...GROUP_CARD_SX,
								flex: 1,
								minWidth: 0,
								paddingX: 0.75,
								paddingY: 1.25,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								gap: 0.75,
								textAlign: 'center',
							}}
						>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									width: 34,
									height: 34,
									borderRadius: 1.5,
									bgcolor: tint(0.1),
									color: 'primary.dark',
								}}
							>
								{RECENT_ICONS[i % RECENT_ICONS.length]}
							</Box>
							<Typography
								strong
								size="0.72rem"
								sx={{
									width: '100%',
									lineHeight: 1.25,
									display: '-webkit-box',
									WebkitLineClamp: 2,
									WebkitBoxOrient: 'vertical',
									overflow: 'hidden',
								}}
							>
								{song.title}
							</Typography>
							<Typography size="0.65rem" color="grey.600" noWrap>
								{song.publishedAt ? getSmartDateAgoString(song.publishedAt) : ''}
							</Typography>
						</Box>
					))}
				</Box>
			</Box>
		</Box>
	)
}

createStory(HomeHeroConceptStory, HomeHeroConceptStory)
