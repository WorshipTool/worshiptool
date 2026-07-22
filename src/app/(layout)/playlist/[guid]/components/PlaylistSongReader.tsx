'use client'

import SheetDisplay from '@/common/components/SheetDisplay/SheetDisplay'
import { Z_INDEX } from '@/common/constants/zIndex'
import { Box, IconButton, Typography } from '@/common/ui'
import { useSmartNavigate } from '@/routes/useSmartNavigate'
import { PlaylistItemDto } from '@/interfaces/playlist/playlist.types'
import { parseVariantAlias } from '@/tech/song/variant/variant.utils'
import { ArrowBackRounded, OpenInFullRounded } from '@mui/icons-material'
import { Sheet } from '@pepavlin/sheet-api'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef, useState } from 'react'

const CARD = {
	bgcolor: 'background.paper',
	borderRadius: 3,
	boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
	padding: 2.5,
} as const

// one song slide: the shared SheetDisplay on a white card (same component and
// look as the standalone song page), with the playlist item's stored key applied
function ReaderSlide({ item }: { item: PlaylistItemDto }) {
	const sheet = useMemo(() => {
		const s = new Sheet(item.pack.sheetData)
		if (item.toneKey) s.setKey(item.toneKey)
		return s
	}, [item.pack.sheetData, item.toneKey])
	return (
		<Box sx={CARD}>
			<SheetDisplay
				sheet={sheet}
				title={item.pack.title}
				hideChords={false}
				variant="default"
				editMode={false}
			/>
		</Box>
	)
}

/**
 * Full-screen song reader for a playlist: the whole song (shared SheetDisplay on
 * a white card) with horizontal swipe between the songs of the playlist. Opened
 * from the list; the hardware / browser back closes it (history-integrated).
 */
export default function PlaylistSongReader({
	items,
	playlistTitle,
	startIndex,
	onClose,
}: {
	items: PlaylistItemDto[]
	playlistTitle: string
	startIndex: number
	onClose: () => void
}) {
	const tCommon = useTranslations('common')
	const navigate = useSmartNavigate()
	const scrollerRef = useRef<HTMLDivElement>(null)
	const [current, setCurrent] = useState(startIndex)
	const rafRef = useRef(0)

	// open at the tapped song (no smooth jump) once the scroller has its width
	useEffect(() => {
		const el = scrollerRef.current
		if (el) el.scrollLeft = startIndex * el.clientWidth
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// integrate with browser / Android back: back closes the reader
	useEffect(() => {
		window.history.pushState({ plReader: true }, '')
		const onPop = () => onClose()
		window.addEventListener('popstate', onPop)
		return () => window.removeEventListener('popstate', onPop)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const onScroll = () => {
		if (rafRef.current) return
		rafRef.current = requestAnimationFrame(() => {
			rafRef.current = 0
			const el = scrollerRef.current
			if (!el || el.clientWidth === 0) return
			const i = Math.round(el.scrollLeft / el.clientWidth)
			setCurrent((c) => (c === i ? c : i))
		})
	}

	const currentItem = items[current]

	return (
		<Box
			sx={{
				position: 'fixed',
				inset: 0,
				zIndex: Z_INDEX.OVERLAY,
				bgcolor: 'grey.50',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			{/* header: back · playlist title + position · open full song */}
			<Box
				sx={{
					flexShrink: 0,
					display: 'flex',
					alignItems: 'center',
					gap: 0.5,
					paddingTop: 'calc(env(safe-area-inset-top) + 12px)',
					paddingX: 1.5,
					paddingBottom: 1,
				}}
			>
				<IconButton onClick={() => window.history.back()} alt={tCommon('back')} color="grey.800">
					<ArrowBackRounded />
				</IconButton>
				<Box sx={{ flex: 1, minWidth: 0, textAlign: 'center' }}>
					<Typography strong noWrap>
						{playlistTitle}
					</Typography>
					<Typography small color="grey.500">
						{current + 1} / {items.length}
					</Typography>
				</Box>
				<IconButton
					onClick={() =>
						currentItem && navigate('variant', parseVariantAlias(currentItem.pack.packAlias))
					}
					alt={tCommon('open')}
					color="grey.800"
				>
					<OpenInFullRounded />
				</IconButton>
			</Box>

			{/* horizontal snap scroller — one full-width slide per song */}
			<Box
				ref={scrollerRef}
				onScroll={onScroll}
				sx={{
					flex: 1,
					minHeight: 0,
					display: 'flex',
					overflowX: 'auto',
					overflowY: 'hidden',
					scrollSnapType: 'x mandatory',
					'&::-webkit-scrollbar': { display: 'none' },
				}}
			>
				{items.map((item, i) => (
					<Box
						key={item.guid}
						sx={{
							flex: '0 0 100%',
							width: '100%',
							height: '100%',
							overflowY: 'auto',
							scrollSnapAlign: 'center',
							paddingX: 2,
							paddingTop: 1,
							paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)',
						}}
					>
						{/* only mount the sheet near the current slide (keeps big playlists light) */}
						{Math.abs(i - current) <= 1 ? <ReaderSlide item={item} /> : null}
					</Box>
				))}
			</Box>

			{/* position dots */}
			<Box
				sx={{
					flexShrink: 0,
					display: 'flex',
					justifyContent: 'center',
					gap: 0.75,
					paddingTop: 1,
					paddingBottom: 'calc(env(safe-area-inset-bottom) + 12px)',
				}}
			>
				{items.map((item, i) => (
					<Box
						key={item.guid}
						sx={{
							width: i === current ? 22 : 7,
							height: 7,
							borderRadius: 999,
							bgcolor: i === current ? 'primary.main' : 'grey.300',
							transition: 'width 0.2s',
						}}
					/>
				))}
			</Box>
		</Box>
	)
}
